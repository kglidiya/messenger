import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AuthorizationEntity } from '../authorization/authorization.entity';
import { ParticipantsEntity } from './participants.entity';

interface IParticipants {
  userId: string;
  addedOn: Date;
  isDeleted: boolean;
}
@Entity({ name: 'rooms' })
export class RoomsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column('simple-array')
  // usersId: string[];
  @Column()
  usersId: string;
  // @ManyToOne(() => AuthorizationEntity, (user) => user.id, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn()
  // usersId: AuthorizationEntity;

  @Column({ default: '' })
  name: string;

  @Column({ default: null })
  avatar: string;
  // @Column({ default: 0 })
  // unreadCount: number;
  @Column('jsonb', { default: [] })
  admin?: string[];

  @Column('jsonb', { default: [] })
  participants?: IParticipants[];

  // @OneToMany(() => ParticipantsEntity, (participants) => participants.room)
  // participants: ParticipantsEntity[];

  // @Column('jsonb', { default: [] })
  // participants: ParticipantsEntity[];

  // @Column({ default: 0 })
  // messagesTotal?: number;

  // @Column({ default: null })
  // firstMessageId?: string;

  // @Column({ default: null })
  // lastMessageId?: string;
}
