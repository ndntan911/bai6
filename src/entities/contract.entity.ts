// entities/contract.entity.ts
import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, OneToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Store } from './store.entity';
import { FreelancerProfile } from './freelancer-profile.entity';
import { WorkRequest } from './work-request.entity';

@Entity('contracts')
export class Contract {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Store)
    @JoinColumn({ name: 'store_id' })
    store: Store;

    @Column() store_id: string;

    @OneToOne(() => FreelancerProfile)
    @JoinColumn({ name: 'freelancer_id' })
    freelancer: FreelancerProfile;

    @Column({ unique: true }) freelancer_id: string;

    @OneToOne(() => WorkRequest)
    @JoinColumn({ name: 'work_request_id' })
    work_request: WorkRequest;

    @Column({ unique: true }) work_request_id: string;

    @CreateDateColumn() started_at: Date;
    @Column({ nullable: true }) ended_at: Date;
    @Column({ nullable: true }) terminated_by: string;
}