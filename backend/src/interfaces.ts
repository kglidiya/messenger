import { AuthorizationEntity } from './authorization/authorization.entity';
import { MessagesEntity } from './messages/messages.entity';

export enum IMessageStatus {
  SENT = 'isSent',
  DELIVERED = 'isDelivered',
  READ = 'isRead',
}
export interface IContact extends AuthorizationEntity {
  chatId: string;
}

export interface IMessageFile {
  path: string;
  type: string;
  name: string;
}
export interface IReactions {
  reaction: string;
  from: string;
}
export interface ReactionsData extends IReactions {
  messageId: string;
  roomId: string;
}
export interface IMessage {
  id: string;
  message: string;
  parentMessage: MessagesEntity | null;
  currentUserId: string;
  recipientUserId: string;
  reactions: IReactions[];
  createdAt: string;
  status: IMessageStatus;
  file: IMessageFile | null;
  contact: AuthorizationEntity | null;
  roomId: string;
  readBy: string;
  modified: boolean;
  isDeleted: boolean;
  isForwarded: boolean;
}

export interface RoomId {
  roomId: string;
}

export interface UserId {
  userId: string;
}

export interface UserData {
  id: string;
  userName: string;
  avatar?: any | null;
  avatarId?: number;
  email: string;
}
