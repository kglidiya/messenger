export interface IReactions {
  reaction: string;
  from: string;
}

export interface IGroupParticipant {
  userId: string;
  addedOn: Date;
  isDeleted: boolean;
}
export enum IMessageStatus {
  SENT = "isSent",
  DELIVERED = "isDelivered",
  READ = "isRead",
}

export interface ILoginDto {
  email: string;
  password: string;
  isOnline: boolean;
}

export interface ICreateChatDto {
  usersId: string[];
  name?: string;
  admin?: string[];
  participants?: IGroupParticipant[];
}

export interface IMessage {
  id: string;
  message: string;
  parentMessage: IMessage;
  currentUserId: string;
  recipientUserId: string;
  reactions: IReactions;
  createdAt: string;
  status: IMessageStatus;
  file: { path: string; type: string; name: string } | null;
  contact: any;
  roomId: string;
  readBy: string[];
}

export interface IUser {
  email: string;
  id: string;
  isOnline: boolean;
  userName: string;
  avatar: string | null;
}

export interface IContact extends IUser {
  chatId?: string;
  participants?: IUser[];
}

export interface IRoom {
  admin: string[];
  avatar: string | null;
  id: string;
  messagesTotal: string;
  name: string;
  participants: IUser[];
  unread: number;
  usersId: string;
  firstMessageId?: string;
  lastMessageId?: string;
  firstUnreadMessage?: string | null;
}

export interface IUnreadCount {
  roomId: string;
  unread: number;
}
