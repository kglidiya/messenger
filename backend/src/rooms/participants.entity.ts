import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AuthorizationEntity } from '../authorization/authorization.entity';
import { RoomsEntity } from './rooms.entity';

interface IParticipants {
  user: AuthorizationEntity;
  addedOn: Date;
  isDeleted: boolean;
}
@Entity({ name: 'participants' })
export class ParticipantsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  addedOn: Date;

  @Column({ default: false })
  isDeleted: boolean;

  // @OneToOne(() => AuthorizationEntity)
  // @JoinColumn()
  // userId: AuthorizationEntity;
  // @ManyToOne(type => User, user => user.userGroups, { primary: true })
  // user: User;
  // @ManyToOne(type => Group, group => group.userGroups, { primary: true })
  // group: Group;
  // @ManyToOne(() => AuthorizationEntity, (user) => user.participants, {
  //   primary: true,
  // })
  // userId: AuthorizationEntity;

  // @ManyToOne(() => RoomsEntity, (room) => room.participants, { primary: true })
  // room: RoomsEntity;
  // @ManyToOne((type) => AuthorizationEntity, (user) => user.participants, {
  //   primary: true,
  // })
  // userId: AuthorizationEntity;
  // @ManyToOne((type) => RoomsEntity, (room) => room.participants, {
  //   primary: true,
  // })
  // room: RoomsEntity;
}
