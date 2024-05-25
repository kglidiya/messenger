export enum IMessageStatus {
  SENT = 'isSent',
  DELIVERED = 'isDelivered',
  READ = 'isRead',
}

export interface Message {
  id: string;
  dialog: string;
  currentUserName: string;
  currentUserId: string;
  recipientUserName: string;
  recipientUserId: string;
  message: string;
  file: any;
  status: IMessageStatus;
  date: Date;
  roomId: string;
  token?: string;
  modified: boolean;
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
