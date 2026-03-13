// entities/owner-profile.entity.ts
import {
    Entity, PrimaryGeneratedColumn, Column,
    OneToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('owner_profiles')
export class OwnerProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: string;

    @Column({ unique: true })
    identifier: string;   // mã định danh auto-generate

    @CreateDateColumn() created_at: Date;
}