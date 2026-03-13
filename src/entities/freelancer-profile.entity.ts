// entities/freelancer-profile.entity.ts
import {
    Entity, PrimaryGeneratedColumn, Column,
    OneToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('freelancer_profiles')
export class FreelancerProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: string;

    @Column({ nullable: true }) street: string;
    @Column({ nullable: true }) ward: string;
    @Column({ nullable: true }) district: string;
    @Column({ nullable: true }) province: string;

    @CreateDateColumn() created_at: Date;
}