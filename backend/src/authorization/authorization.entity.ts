import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomsEntity } from '../rooms/rooms.entity';
import { IAvatar } from './interfaces';
import LocalFile from 'src/localFile/localFile.entity';
import { ParticipantsEntity } from 'src/rooms/participants.entity';

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
  // @JoinColumn({ name: 'avatarId' })
  // @OneToOne(() => LocalFile, {
  //   nullable: true,
  // })
  // avatar?: LocalFile;

  // @Column({ nullable: true })
  // avatarId?: number;

  @Column({ default: false })
  isOnline: boolean;

  @Column({ default: null })
  recoveryCode: number;
  // @OneToMany(type => UserGroup, userGroup => userGroup.user)
  // userGroups: UserGroup[];
  // @OneToMany(() => ParticipantsEntity, (participants) => participants.userId)
  // participants: ParticipantsEntity[];
}
// createdAt: "111", // по сути мне это не нужно
// id: "1",
// username: "",
// email: "cat@mail.ru",
// password: "hash",
// avatar: "https://nztcdn.com/files/5b5ebf93-199c-4420-aea7-fabdade62ede.webp",
// isOnline: false, //пока не реализовано
// userContacts: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
// isPrinting: false, //пока не реализовано
