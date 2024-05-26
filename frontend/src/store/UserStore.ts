import { AxiosError } from "axios";
import { extendObservable, makeAutoObservable, observe, runInAction, toJS } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { Socket, io } from "socket.io-client";

import {
  // getAvatar,
  getMyChats,
  getOneRoom,
  getPrevMessage,
  login,
  registerUser,
  // updateAvatar,
} from "../utils/api";
import { files, messages, users } from "../utils/mockData";
import { IContact, ILoginDto, IMessage, IMessageStatus, IRoom, IUnreadCount } from "../utils/types";

export const DEFAULT_STATE = users[0];
const streamToBlob = require("stream-to-blob");

// interface IRoom {
//   id: string;
//   name: string;
// }
export default class UserStore {
  _user: any | null;
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
      if (res.error) {
        this._error = res.error;
      } else this._user = res;
    });
  }

  async login(data: ILoginDto) {
    const res = await login(data);

    runInAction(() => {
      // console.log("res", res);
      if (res.error) {
        this._error = res.error;
      } else {
        const { accessToken, refreshToken, ...rest } = res;
        this._user = rest;
      }
      // if (res instanceof AxiosError) {
      //   console.log({ error: res.response?.data.message });
      // }
      // const { accessToken, refreshToken, ...rest } = res;
      // this._user = rest;
    });
  }

  setRoomId(id: string) {
    if (id) {
      this._roomId = id;
    } else this._roomId = null;
  }

  setUser(user: IContact | null) {
    this._user = user;
  }

  // setAvatar(id: any) {
  //   if (id) {
  //     this._avatar = `http://localhost:3001/avatar/${id}`;
  //   } else this._avatar = null;
  // }
  // async getOneRoom(roomId: string) {
  //   const result = await getOneRoom(roomId);
  //   runInAction(() => {
  //     const room = this._roomAll.filter((room: any) => room.id === result.id)[0];
  //     this._currentRoom = room;
  //     const oldRoom = this._roomAll.findIndex((el) => el.id === result.id);
  //     this._roomAll.splice(oldRoom, 1, result);
  //   });
  // }

  async setCurrentRoom(id: string) {
    // console.log("setCurrentRoom usersId", usersId);
    if (!id) {
      this._currentRoom = null;
    } else {
      // const room = this._roomAll.filter((room) => room.usersId === usersId)[0];

      const newRoom = await getOneRoom({ roomId: id });
      runInAction(() => {
        this._currentRoom = newRoom;
        // console.log(newRoom);
        // this._roomId = newRoom.id;
        const oldRoom = this._roomAll.findIndex((el) => el.id === newRoom.id);
        this._roomAll.splice(oldRoom, 1, newRoom);
        // this.updateGroup(newRoom);
      });
    }
  }

  updateCurrentRoomLastMsgId(id: string) {
    if (this._currentRoom) {
      this._currentRoom.lastMessageId = id;
    }
  }
  async setContacts(setIsLoading: any) {
    const result = await getMyChats({ userId: this._user.id });
    // console.log(toJS(result));
    runInAction(() => {
      if (result.length) {
        this._contacts = result[0];
        this._roomAll = result[1];
        // this.setCurrentRoom(this.chatingWith.id);
        if (result[0].length === 0) {
          // console.log(" setIsLoading(false);");
          setIsLoading(false);
        }
      }
    });
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
    const unreadCount = [];
    // console.log(toJS(this._roomAll));
    // console.log("this._totalUnread", this._totalUnread);
    for (let room of this._roomAll) {
      unreadCount.push({ roomId: room.id, unread: room.unread || 0 });
      this._totalUnread += room.unread || 0;
    }
    this._unreadCount = unreadCount;
  }

  incrementUnreadCount(message: IMessage) {
    // console.log(message);
    const room = this._roomAll.filter((room) => room.id === message.roomId)[0];
    const isPrivate = room.name === "private";
    if (isPrivate) {
      this._unreadCount.map((m) => {
        if (
          m.roomId === message.roomId &&
          message.status !== IMessageStatus.READ &&
          message.recipientUserId === this._user.id
        ) {
          this._totalUnread++;
          return m.unread++;
        } else return m;
      });
    } else {
      // console.log("message.readBy.findIndex((i: string) => i === this._user.id");
      this._unreadCount.map((m: any) => {
        if (
          m.roomId === message.roomId &&
          message.currentUserId !== this._user.id &&
          message.readBy.findIndex((i) => i === this._user.id) === -1
        ) {
          // console.log("incrementUnreadCount");
          // console.log(message.readBy.findIndex((i) => i === this._user.id));
          this._totalUnread++;
          return m.unread++;
        } else return m;
      });
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
          message.recipientUserId === this._user.id
        ) {
          this._totalUnread--;
          return m.unread--;
        } else return m;
      });
    } else {
      this._unreadCount.map((m) => {
        if (
          m.roomId === message.roomId &&
          message.currentUserId !== this._user.id &&
          message.readBy.findIndex((i) => i === this._user.id) !== -1
        ) {
          this._totalUnread--;
          return m.unread--;
        } else return m;
      });
    }
  }

  addMessage(message: IMessage) {
    // console.log(toJS(message));
    this._prevMessages.push(message);
  }

  updateMessage(newMessage: IMessage) {
    // console.log(newMessage);
    const oldMessage = this._prevMessages.findIndex((el) => el.id === newMessage.id);
    if (oldMessage !== -1) {
      this._prevMessages.splice(oldMessage, 1, newMessage);
    }
    // this._prevMessages.splice(oldMessage, 1, newMessage);
  }

  updateUserData(newUser: IContact) {
    // console.log(this._chatingWith.id === newUser.id);
    // console.log(this._user.id);
    // if (this._user && newUser) {
    // console.log("newUser", newUser);
    //     avatar
    // :
    // null
    // createdAt
    // :
    // "2024-05-19T06:51:30.050Z"
    // email
    // :
    // "2@test.ru"
    // id
    // :
    // "6d983f6c-2f8a-48b2-9f8a-344160caf950"
    // isOnline
    // :
    // true
    // userName
    // :
    // ""
    if (newUser.id !== this._user.id) {
      const oldUser = this._contacts.findIndex((el) => el.id === newUser.id);
      // console.log("oldUser", this._contacts[oldUser]);
      this._contacts.splice(oldUser, 1, { ...newUser, chatId: this._contacts[oldUser].chatId });
      // this._contacts = t;
      //this._chatingWith = newUser;
      if (this._chatingWith?.id === newUser.id) {
        this._chatingWith = { ...newUser, chatId: this._contacts[oldUser].chatId };
      }
    } else this._user = newUser;
    // }
  }

  clearMessages() {
    this._prevMessages = [];
  }

  updateRooms(roomId: string, lastMessageId: string) {
    // const oldRoom = this._roomAll.findIndex((el) => el.id === roomId);
    // this._contacts.splice(oldUser, 1, newUser);
    this._roomAll.map((room: any) => {
      if (room.id === roomId) {
        return (room.lastMessageId = lastMessageId);
      } else return room;
    });
  }

  // decrementRoomUndeadIndex(roomId: string) {
  //   // const oldRoom = this._roomAll.findIndex((el) => el.id === roomId);
  //   // this._contacts.splice(oldUser, 1, newUser);
  //   this._roomAll.map((room) => {
  //     if (room.id === roomId) {
  //       return room.firstUnreadMessageIndex--;
  //     } else return room;
  //   });
  // }

  // incrementRoomUndeadIndex(roomId: string) {
  //   // const oldRoom = this._roomAll.findIndex((el) => el.id === roomId);
  //   // this._contacts.splice(oldUser, 1, newUser);
  //   this._roomAll.map((room: any) => {
  //     if (room.id === roomId) {
  //       return room.firstUnreadMessageIndex++;
  //     } else return room;
  //   });
  // }

  clearContacts() {
    this._contacts = [];
    this._roomAll = [];
  }
  clearUnreadCount() {
    this._unreadCount = [];
    this._totalUnread = 0;
  }

  // clearTotalUnread() {
  //   this._totalUnread = 0;
  // }
  setChatingWith(user: IContact) {
    this._chatingWith = user;
  }
  // async setChat(userId: string, chatingWith: string) {
  //   const chart = await connectToChart({ currentUserId: userId, recipientUserId: chatingWith });
  //   runInAction(() => {
  //     this._chat = chart;
  //   });
  // }

  setAuth(auth: boolean) {
    this._isAuth = auth;
  }

  setMessageToForward(id: string) {
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
  clearMessageToEdit() {
    this._messageToEdit = null;
  }
  setParentMessage(message: IMessage) {
    this._parentMessage = message;
  }

  setContactToForward(contact: IContact) {
    this._contactToForward = contact;
  }
  setSelectedUsers(id: string, checked: boolean) {
    // console.log(checked);
    if (checked) {
      this._selectedUsers.push(id);
    } else {
      const ids = this._selectedUsers.filter((el) => el !== id);
      this._selectedUsers = ids;
    }
    // this._forwardTo = arr;
  }

  clearSelectedUsers() {
    this._selectedUsers = [];
  }

  clearError() {
    this._error = null;
  }

  // setCurrentRoom(usersId: any) {
  //   // console.log(usersId);
  //   if (!usersId) {
  //     this._currentRoom = null;
  //   } else {
  //     const room = this._roomAll.filter((room: any) => room.usersId === usersId && room.name !== "private")[0];
  //     this._currentRoom = room;
  //   }
  // }

  updateGroup(newRoomData: IRoom) {
    // const { ...newRoom } = newRoomData;
    // console.log(`newRoom`, newRoomData);
    const oldRoom = this._roomAll.findIndex((room) => room.id === newRoomData.id);
    // console.log(`oldRoom`, oldRoom);
    if (oldRoom !== -1) {
      this._roomAll.splice(oldRoom, 1, newRoomData);
      if (this._currentRoom && this._currentRoom.id === newRoomData.id) {
        this._currentRoom = newRoomData;
      }
      // if (this._currentRoom) {
      //   this._currentRoom = newRoomData;
      // }
      // this._currentRoom = newRoom;
      // console.log(
      //   `newRoom.usersId
      // `,
      //   newRoom.usersId.split(","),
      // );
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
        // participants: newRoomData.participants,
      };

      this._contacts.splice(contactIndex, 1, contactUpdated);

      if (this._chatingWith?.chatId === newRoomData.id) {
        // this._chatingWith = newRoomData;
        const usersId = newRoomData.usersId.split(",");
        this._chatingWith = {
          ...this._chatingWith,
          avatar: newRoomData.avatar,
          userName: newRoomData.name,
          id: newRoomData.usersId,
          // participants: newRoomData.participants,
        };
      }
    }
  }

  incrementFilesCounter() {
    this._filesCounter++;
  }
  setFilesCounter(filesNumber: number) {
    this._filesCounter = filesNumber;
  }
  get user() {
    // console.log("this._user", toJS(this._user));
    return this._user;
  }

  get contacts() {
    // console.log("this._contacts", toJS(this._contacts));
    return this._contacts;
  }

  get chatingWith() {
    // console.log("this._chatingWith", toJS(this._chatingWith));
    return this._chatingWith;
  }

  get isAuth() {
    return this._isAuth;
  }

  get prevMessages() {
    // console.log("this._prevMessages", toJS(this._prevMessages.length));
    return this._prevMessages;
  }

  get messageToForward() {
    // console.log(toJS(this._messageToForward));
    return this._messageToForward;
  }

  get messageToEdit() {
    // console.log("this._messageToEdit", toJS(this._messageToEdit));
    return this._messageToEdit;
  }
  get parentMessage() {
    // console.log("this._parentMessage", toJS(this._parentMessage));
    return this._parentMessage;
  }

  get contactToForward() {
    // console.log(toJS(this._contactToForward));
    return this._contactToForward;
  }
  get selectedUsers() {
    // console.log("toJS(this._selectedUsers)", toJS(this._selectedUsers));
    return this._selectedUsers;
  }

  get roomId() {
    // console.log("this._roomId", toJS(this._roomId));
    return this._roomId;
  }
  get roomAll() {
    // console.log("roomAll", toJS(this._roomAll));
    return this._roomAll;
  }
  get unreadCount() {
    // console.log(toJS(this._unreadCount));
    return this._unreadCount;
  }
  get totalUnread() {
    // console.log("this._totalUnread", toJS(this._totalUnread));
    return this._totalUnread;
  }
  get currentRoom() {
    // console.log("this._currentRoom", toJS(this._currentRoom));
    return this._currentRoom;
  }
  get filesCounter() {
    // console.log("this._filesCounter", toJS(this._filesCounter));
    return this._filesCounter;
  }

  get error() {
    console.log("this._error", toJS(this._error));
    return this._error;
  }
}
