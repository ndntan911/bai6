// entities/user.entity.ts
import {
    Entity, PrimaryGeneratedColumn, Column,
    CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum UserRole { OWNER = 'owner', FREELANCER = 'freelancer' }
export enum Gender { MALE = 'male', FEMALE = 'female', OTHER = 'other' }

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    full_name: string;

    @Column({ unique: true })
    phone: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'date', nullable: true })
    date_of_birth: Date;

    @Column({ type: 'enum', enum: Gender, nullable: true })
    gender: Gender;

    @Column({ nullable: true })
    avatar_url: string;

    @Column({ type: 'enum', enum: UserRole })
    role: UserRole;

    @Column({ default: false })
    is_verified: boolean;

    @CreateDateColumn() created_at: Date;
    @UpdateDateColumn() updated_at: Date;
}