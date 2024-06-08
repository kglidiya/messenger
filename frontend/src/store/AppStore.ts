import { makeAutoObservable, runInAction } from "mobx";

import { Dispatch, SetStateAction } from "react";

import { getMyChats, getOneRoom, getPrevMessage, login, registerUser } from "../utils/api";
import {
  IContact,
  ILoginDto,
  IMessage,
  IMessageStatus,
  IRoom,
  IUnreadCount,
  IUser,
  LoginResponse,
} from "../utils/types";

export default class AppStore {
  _user: IUser | null;
  _isAuth: boolean;
  _contacts: IContact[];
  _chatingWith: IContact | null;
  _prevMessages: IMessage[];
  _messageToForward: IMessage | null;
  _messageToEdit: IMessage | null;
  _contactToForward: IContact | null;
  _parentMessage: IMessage | null;
  _selectedUsers: string[];
  _roomAll: IRoom[];
  _currentRoom: IRoom | null;
  _roomId: string | null;
  _unreadCount: IUnreadCount[];
  _totalUnread: number;
  _filesCounter: number;
  _error: string | null;

  constructor() {
    this._user = null;
    this._isAuth = false;
    this._contacts = [];
    this._chatingWith = null;
    this._prevMessages = [];
    this._contactToForward = null;
    this._messageToForward = null;
    this._messageToEdit = null;
    this._parentMessage = null;
    this._selectedUsers = [];
    this._roomAll = [];
    this._currentRoom = null;
    this._roomId = null;
    this._unreadCount = [];
    this._totalUnread = 0;
    this._filesCounter = 0;
    this._error = null;

    makeAutoObservable(this);
  }

  async registerUser(data: ILoginDto) {
    const res = await registerUser(data);
    runInAction(() => {
      if (res?.error) {
        this._error = res.error;
      } else this._user = res as LoginResponse;
    });
  }

  async login(data: ILoginDto) {
    const res = await login(data);
    runInAction(() => {
      if (res?.error) {
        this._error = res.error;
      } else {
        const { accessToken, refreshToken, ...rest } = res as LoginResponse;
        this._user = rest;
      }
    });
  }

  setAuth(auth: boolean) {
    this._isAuth = auth;
  }

  setUser(user: IUser | null) {
    this._user = user;
  }

  async setContacts(setIsLoading?: Dispatch<SetStateAction<boolean>>) {
    const result = await getMyChats({ userId: this._user?.id as string });
    runInAction(() => {
      if (result) {
        this._contacts = result.contacts;
        this._roomAll = result.rooms;
        if (setIsLoading) {
          setIsLoading(false);
        }
      }
    });
  }

  setChatingWith(contact: IContact | null) {
    this._chatingWith = contact;
  }

  async setCurrentRoom(id: string | null) {
    if (!id) {
      this._currentRoom = null;
    } else {
      const newRoom = await getOneRoom({ roomId: id });
      runInAction(() => {
        this._currentRoom = newRoom;
        const oldRoom = this._roomAll.findIndex((el) => el.id === newRoom.id);
        this._roomAll.splice(oldRoom, 1, newRoom);
      });
    }
  }

  setRoomId(id: string | null) {
    if (id) {
      this._roomId = id;
    } else this._roomId = null;
  }

  async getPrevMessages(limit: number, offset: number, roomId: string) {
    const messages = await getPrevMessage({
      limit,
      offset,
      roomId,
    });
    runInAction(() => {
      if (messages.length) {
        this._prevMessages = messages;
      }
    });
  }

  setMessages(messages: IMessage[]) {
    this._prevMessages = messages;
  }

  setUnreadCount() {
    const unreadCount = [] as IUnreadCount[];
    for (let room of this._roomAll) {
      unreadCount.push({ roomId: room.id, unread: room.unread || 0 });
      this._totalUnread += room.unread || 0;
    }
    this._unreadCount = unreadCount;
  }

  incrementUnreadCount(message: IMessage) {
    const room = this._roomAll.filter((room) => room.id === message.roomId)[0];

    if (room) {
      const isPrivate = room.name === "private";
      if (isPrivate) {
        this._unreadCount.map((m) => {
          if (
            m.roomId === message.roomId &&
            message.status !== IMessageStatus.READ &&
            message.recipientUserId === this._user?.id
          ) {
            this._totalUnread++;
            return m.unread++;
          } else return m;
        });
      } else {
        this._unreadCount.map((m) => {
          if (
            m.roomId === message.roomId &&
            message.currentUserId !== this._user?.id &&
            message.readBy.findIndex((i) => i === this._user?.id) === -1
          ) {
            this._totalUnread++;
            return m.unread++;
          } else return m;
        });
      }
    }
  }

  decrementUnreadCount(message: IMessage) {
    const room = this._roomAll.filter((room) => room.id === message.roomId)[0];
    const isPrivate = room.name === "private";
    if (isPrivate) {
      this._unreadCount.map((m) => {
        if (
          m.roomId === message.roomId &&
          message.status === IMessageStatus.READ &&
          message.recipientUserId === this._user?.id
        ) {
          this._totalUnread--;
          return m.unread--;
        } else return m;
      });
    } else {
      this._unreadCount.map((m) => {
        if (
          m.roomId === message.roomId &&
          message.currentUserId !== this._user?.id &&
          message.readBy.findIndex((i) => i === this._user?.id) !== -1
        ) {
          this._totalUnread--;
          return m.unread--;
        } else return m;
      });
    }
  }

  addMessage(message: IMessage) {
    this._prevMessages.push(message);
  }

  updateMessage(newMessage: IMessage) {
    const oldMessage = this._prevMessages.findIndex((el) => el.id === newMessage.id);
    if (oldMessage !== -1) {
      this._prevMessages.splice(oldMessage, 1, newMessage);
    }
  }

  updateCurrentRoomLastMsgId(id: string) {
    if (this._currentRoom) {
      this._currentRoom.lastMessageId = id;
    }
  }

  updateUserData(newUser: IUser) {
    if (newUser.id !== this._user?.id) {
      const oldUser = this._contacts.findIndex((el) => el.id === newUser.id);
      this._contacts.splice(oldUser, 1, { ...newUser, chatId: this._contacts[oldUser].chatId });
      if (this._chatingWith?.id === newUser.id) {
        this._chatingWith = { ...newUser, chatId: this._contacts[oldUser].chatId };
      }
    } else this._user = newUser;
  }

  updateGroup(newRoomData: IRoom) {
    const oldRoom = this._roomAll.findIndex((room) => room.id === newRoomData.id);

    if (oldRoom !== -1) {
      this._roomAll.splice(oldRoom, 1, newRoomData);
      if (this._currentRoom && this._currentRoom.id === newRoomData.id) {
        this._currentRoom = newRoomData;
      }

      const contactIndex = this._contacts.findIndex((el) => {
        if (el.chatId) {
          return el.chatId === newRoomData.id;
        }
      });
      const contact = this._contacts[contactIndex];
      const contactUpdated = {
        ...contact,
        avatar: newRoomData.avatar,
        userName: newRoomData.name,
        id: newRoomData.usersId,
      };

      this._contacts.splice(contactIndex, 1, contactUpdated);

      if (this._chatingWith?.chatId === newRoomData.id) {
        this._chatingWith = {
          ...this._chatingWith,
          avatar: newRoomData.avatar,
          userName: newRoomData.name,
          id: newRoomData.usersId,
        };
      }
    }
  }
  setMessageToForward(id: string | null) {
    const message = this._prevMessages.filter((el) => el.id === id);
    if (message.length) {
      this._messageToForward = message[0];
    } else this._messageToForward = null;
  }

  setMessageToEdit(id: string) {
    const message = this._prevMessages.filter((el) => el.id === id);
    if (message.length) {
      this._messageToEdit = message[0];
    } else this._messageToEdit = null;
  }

  setParentMessage(message: IMessage | null) {
    this._parentMessage = message;
  }

  setContactToForward(contact: IContact | null) {
    this._contactToForward = contact;
  }

  setSelectedUsers(id: string, checked: boolean) {
    if (checked) {
      this._selectedUsers.push(id);
    } else {
      const ids = this._selectedUsers.filter((el) => el !== id);
      this._selectedUsers = ids;
    }
  }

  setFilesCounter(filesNumber: number) {
    this._filesCounter = filesNumber;
  }

  incrementFilesCounter() {
    this._filesCounter++;
  }

  clearMessages() {
    this._prevMessages = [];
  }

  clearContacts() {
    this._contacts = [];
    this._roomAll = [];
  }

  clearUnreadCount() {
    this._unreadCount = [];
    this._totalUnread = 0;
  }

  clearMessageToEdit() {
    this._messageToEdit = null;
  }

  clearSelectedUsers() {
    this._selectedUsers = [];
  }

  clearError() {
    this._error = null;
  }

  get user() {
    return this._user;
  }

  get contacts() {
    return this._contacts;
  }

  get chatingWith() {
    return this._chatingWith;
  }

  get isAuth() {
    return this._isAuth;
  }

  get prevMessages() {
    return this._prevMessages;
  }

  get messageToForward() {
    return this._messageToForward;
  }

  get messageToEdit() {
    return this._messageToEdit;
  }
  get parentMessage() {
    return this._parentMessage;
  }

  get contactToForward() {
    return this._contactToForward;
  }
  get selectedUsers() {
    return this._selectedUsers;
  }

  get roomId() {
    return this._roomId;
  }
  get roomAll() {
    return this._roomAll;
  }
  get unreadCount() {
    return this._unreadCount;
  }
  get totalUnread() {
    return this._totalUnread;
  }
  get currentRoom() {
    return this._currentRoom;
  }
  get filesCounter() {
    return this._filesCounter;
  }

  get error() {
    return this._error;
  }
}
