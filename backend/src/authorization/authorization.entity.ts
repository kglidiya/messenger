import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class AuthorizationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: '' })
  userName: string;

  @Column({ default: null })
  avatar: string;

  @Column({ default: false })
  isOnline: boolean;

  @Column({ default: null })
  recoveryCode: number;

  @Column('jsonb', { default: [] })
  bannedBy: string[];
}
