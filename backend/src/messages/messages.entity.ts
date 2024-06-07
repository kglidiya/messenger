import { AuthorizationEntity } from 'src/authorization/authorization.entity';
import { IMessageStatus } from 'src/interfaces';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

interface IReactions {
  reaction: string;
  from: string;
}
@Entity({ name: 'messages' })
export class MessagesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ default: false })
  modified: boolean;
}
