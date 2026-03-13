// entities/store.entity.ts
import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { OwnerProfile } from './owner-profile.entity';

@Entity('stores')
export class Store {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => OwnerProfile)
    @JoinColumn({ name: 'owner_id' })
    owner: OwnerProfile;

    @Column()
    owner_id: string;

    @Column() name: string;
    @Column({ nullable: true }) logo_url: string;
    @Column({ nullable: true }) phone: string;
    @Column({ nullable: true }) email: string;
    @Column({ nullable: true }) street: string;
    @Column({ nullable: true }) ward: string;
    @Column({ nullable: true }) district: string;
    @Column({ nullable: true }) province: string;

    @CreateDateColumn() created_at: Date;
    @UpdateDateColumn() updated_at: Date;
}