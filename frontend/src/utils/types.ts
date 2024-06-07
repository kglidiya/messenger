import AppStore from "../store/AppStore";

export interface IContext {
  store: AppStore;
}

export interface IUser {
  avatar: string | null;
  email?: string;
  id: string;
  isOnline?: boolean;
  userName: string;
}

export interface IGroupParticipant {
  userId: string;
  addedOn: number;
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

export interface LoginResponse extends IUser {
  accessToken: string;
  refreshToken: string;
  error?: string;
}

export interface ICreateChatDto {
  usersId: string[];
  name?: string;
  admin?: string[];
  participants?: IGroupParticipant[];
}
export interface ICreateChatResponse {
  avatar?: string | null;
  admin: string[];
  id: string;
  name: string;
  participants?: IGroupParticipant[];
  usersId: string;
}

export interface IContact extends IUser {
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
export interface IMessage {
  id: string;
  message: string;
  parentMessage: IMessage;
  currentUserId: string;
  recipientUserId: string;
  reactions: IReactions[];
  createdAt: string;
  status: IMessageStatus;
  file: IMessageFile | null;
  contact: IContact;
  roomId: string;
  readBy: string[];
  modified: boolean;
  isDeleted: boolean;
  isForwarded: boolean;
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

export interface IUnreadCount {
  roomId: string;
  unread: number;
}

export interface IAllGroupsResponse {
  contacts: IContact[];
  rooms: IRoom[];
}

export interface IResetPasswordDto {
  password: string;
  recoveryCode: number;
}

export interface IGetMessagesRequest {
  limit: number;
  offset: number;
  roomId: string;
}

export interface IWhoIsTyping {
  isTyping: boolean;
  roomId: string;
  userId: string;
}
