import { AuthorizationEntity } from 'src/authorization/authorization.entity';
import { UserData } from '../interfaces';
interface IParticipants {
  user: AuthorizationEntity;
  addedOn: Date;
  isDeleted: boolean;
}
export interface GroupData {
  usersId: Array<string>;
  name: string;
  admin?: string[];
  participants?: IParticipants[];
}

export interface RoomData {
  // currentUserId?: string;
  // recipientUserId?: string;
  // groupId?: string;
  // unreadCount: number;
}

export interface IRoomParticipant {
  userId: string;
  addedOn: number;
  isDeleted: boolean;
  avatar: string | null;
  userName: string;
  email: string;
}

export interface IRoom {
  admin: string[];
  avatar: string | null;
  firstMessageId: string | null;
  firstUnreadMessage: string | null;
  lastMessageId: string | null;
  id: string;
  messagesTotal: string;
  name: string;
  participants: IRoomParticipant[];
  unread: number;
  usersId: string;
}

export interface IContact extends AuthorizationEntity {
  chatId: string;
}

export interface IAllGroupsResponse {
  contacts: IContact[];
  rooms: IRoom[];
}
