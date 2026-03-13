// entities/email-verification.entity.ts
import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('email_verifications')
export class EmailVerification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column() user_id: string;

    @Column({ unique: true }) token: string;
    @Column() expires_at: Date;
    @Column({ nullable: true }) used_at: Date;

    @CreateDateColumn() created_at: Date;
}