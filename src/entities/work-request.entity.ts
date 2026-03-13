// entities/work-request.entity.ts
import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Store } from './store.entity';
import { FreelancerProfile } from './freelancer-profile.entity';

export enum InitiatedBy { FREELANCER = 'freelancer', OWNER = 'owner' }
export enum RequestStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

@Entity('work_requests')
export class WorkRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Store)
    @JoinColumn({ name: 'store_id' })
    store: Store;

    @Column() store_id: string;

    @ManyToOne(() => FreelancerProfile)
    @JoinColumn({ name: 'freelancer_id' })
    freelancer: FreelancerProfile;

    @Column() freelancer_id: string;

    @Column({ type: 'enum', enum: InitiatedBy })
    initiated_by: InitiatedBy;

    @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.PENDING })
    status: RequestStatus;

    @CreateDateColumn() created_at: Date;
    @UpdateDateColumn() updated_at: Date;
}