import { AuthorizationEntity } from 'src/authorization/authorization.entity';
import { IMessageStatus } from 'src/interfaces';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

interface IReactions {
  reaction: string;
  from: string;
}
@Entity({ name: 'messages' })
export class MessagesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // @PrimaryGeneratedColumn()
  // id: number;

  @Column()
  createdAt: Date;

  @Column()
  roomId: string;

  @Column()
  currentUserId: string;

  @Column()
  recipientUserId: string;

  @Column({ default: null })
  message: string;

  @Column('jsonb', { default: null })
  file: { path: string; type: string };

  @ManyToOne(() => AuthorizationEntity, (user) => user, {
    nullable: true,
  })
  contact: AuthorizationEntity | null;

  @ManyToOne(() => MessagesEntity, {
    nullable: true,
  })
  parentMessage: MessagesEntity;
  @Column('jsonb', { default: [] })
  reactions: IReactions[];

  @Column({ type: 'enum', enum: IMessageStatus, nullable: true })
  status: IMessageStatus;

  @Column('jsonb', { default: [] })
  readBy: string[];

  @Column({ default: false })
  isForwarded: boolean;

  // @Column({ default: false })
  // isRead: boolean;

  // @Column({ default: false })
  // isSent: boolean;

  @Column({ default: false })
  isDelivered: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ default: false })
  modified: boolean;
}

// createdAt: "01:53",
// id: "10",
// creatorId: "1",
// recipientId: "2",
// message:
//   "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
// reactions: [
//   { reaction: "🤣", creatorId: "1" },
//   { reaction: "🤣", creatorId: "4" },
//   { reaction: "😳", creatorId: "3" },
// ],
// forwarded: false,
// isRead: true,
// isSent: true,
// isDelivered: true,
// fileId: "", //пустая строка если нет файлов, связывает с таблицей "files"
