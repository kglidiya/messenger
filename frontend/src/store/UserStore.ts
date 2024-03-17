import { makeAutoObservable } from "mobx";

import { files, messages, users } from "../utils/mockData";

export const DEFAULT_STATE = users[0];

export default class UserStore {
  _user: any | {};
  _contacts: any[];
  _chatingWith: string;
  _chat: any[];
  _isAuth: boolean;

  constructor() {
    this._user = DEFAULT_STATE;
    this._contacts = [];
    this._chatingWith = "2";
    this._chat = [];
    this._isAuth = false;

    makeAutoObservable(this);
  }

  setUser(user: any | {}) {
    this._user = user;
  }

  setContacts() {
    const contacts = users.filter((user: any) => {
      return this._user.userContacts.indexOf(user.id) !== -1;
    });
    this._contacts = contacts;
  }

  setChatingWith(id: string) {
    this._chatingWith = id;
  }

  setChat(userId: string, chatingWith: string) {
    const chat = messages.filter((message: any) => {
      if (
        (message.recipientId === userId && message.creatorId === chatingWith) ||
        (message.recipientId === chatingWith && message.creatorId === userId)
      ) {
        return message;
      }
    });
    this._chat = chat;
  }

  setAuth(auth: boolean) {
    this._isAuth = auth;
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

  get chat() {
    return this._chat;
  }

  get isAuth() {
    return this._isAuth;
  }
}
