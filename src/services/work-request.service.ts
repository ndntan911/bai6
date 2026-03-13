// services/work-request.service.ts
import { AppDataSource } from '../data-source';
import { WorkRequest, InitiatedBy, RequestStatus } from '../entities/work-request.entity';
import { Contract } from '../entities/contract.entity';
import { FreelancerProfile } from '../entities/freelancer-profile.entity';
import { OwnerProfile } from '../entities/owner-profile.entity';
import { Store } from '../entities/store.entity';
import { IsNull } from 'typeorm';

export class WorkRequestService {
    private requestRepo = AppDataSource.getRepository(WorkRequest);
    private contractRepo = AppDataSource.getRepository(Contract);
    private freelancerRepo = AppDataSource.getRepository(FreelancerProfile);
    private ownerRepo = AppDataSource.getRepository(OwnerProfile);
    private storeRepo = AppDataSource.getRepository(Store);

    async freelancerSendRequest(userId: string, storeId: string) {
        console.log(userId, storeId)
        const profile = await this.freelancerRepo.findOne({ where: { user_id: userId } });
        if (!profile) throw { status: 404, message: 'Freelancer profile not found' };

        const store = await this.storeRepo.findOne({ where: { id: storeId } });
        if (!store) throw { status: 404, message: 'Store not found' };


        // Không được gửi yêu cầu đến cửa hàng của chính mình (nếu user là owner luôn)
        // Kiểm tra active contract
        const activeContract = await this.contractRepo.findOne({
            where: { freelancer_id: profile.id, ended_at: IsNull() },
        });
        if (activeContract) {
            throw {
                status: 400,
                message: 'You already have an active contract',
            };
        }

        // Kiểm tra pending request trùng
        const duplicate = await this.requestRepo.findOne({
            where: {
                store_id: storeId,
                freelancer_id: profile.id,
                status: RequestStatus.PENDING,
            },
        });
        if (duplicate) {
            throw { status: 409, message: 'You already have a pending request to this store' };
        }

        const request = this.requestRepo.create({
            store_id: storeId,
            freelancer_id: profile.id,
            initiated_by: InitiatedBy.FREELANCER,
        });
        await this.requestRepo.save(request);

        return { message: 'Work request sent successfully', request_id: request.id };
    }
    async ownerAcceptRequest(userId: string, requestId: string) {
        const ownerProfile = await this.ownerRepo.findOne({ where: { user_id: userId } });
        if (!ownerProfile) throw { status: 404, message: 'Owner profile not found' };

        const request = await this.requestRepo.findOne({
            where: { id: requestId },
            relations: ['store'],
        });
        if (!request) throw { status: 404, message: 'Request not found' };

        // Verify ownership
        if (request.store.owner_id !== ownerProfile.id) {
            throw { status: 403, message: 'You do not own this store' };
        }

        if (request.status !== RequestStatus.PENDING) {
            throw { status: 400, message: 'Request is no longer pending' };
        }

        if (request.initiated_by !== InitiatedBy.FREELANCER) {
            throw { status: 400, message: 'This is an offer sent by owner, not a request from freelancer' };
        }

        // Re-check freelancer vẫn chưa có contract tại thời điểm duyệt
        const activeContract = await this.contractRepo.findOne({
            where: { freelancer_id: request.freelancer_id, ended_at: IsNull() },
        });
        if (activeContract) {
            throw { status: 409, message: 'Freelancer already has an active contract' };
        }

        await AppDataSource.transaction(async (manager) => {
            await manager.update(WorkRequest, requestId, {
                status: RequestStatus.ACCEPTED,
            });
            await manager.save(
                manager.create(Contract, {
                    store_id: request.store_id,
                    freelancer_id: request.freelancer_id,
                    work_request_id: request.id,
                }),
            );
        });

        return { message: 'Request accepted. Contract created successfully.' };
    }
}