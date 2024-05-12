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
}

export interface RoomData {
  currentUserId?: string;
  recipientUserId?: string;
  groupId?: string;
  unreadCount: number;
}

export interface GroupData {
  groupId: string;
  newName: string;
  newMember: UserData[];
  participants?: IParticipants[];
}
