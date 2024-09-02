/* eslint-disable array-callback-return */
import { IContact, IMessage, IReactions } from "./types";

var CryptoJS = require("crypto-js");

export const encrypt = (message: string) => {
  return CryptoJS.AES.encrypt(JSON.stringify(message), process.env.REACT_APP_CRYPTO_KEY).toString();
};

export const decrypt = (message: string) => {
  const bytes = CryptoJS.AES.decrypt(message, process.env.REACT_APP_CRYPTO_KEY);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};

export const decryptOneMessage = (msg: IMessage) => {
  return {
    ...msg,
    message: msg.message ? decrypt(msg.message) : "",
    parentMessage:
      msg.parentMessage && msg.parentMessage.message
        ? { ...msg.parentMessage, message: decrypt(msg.parentMessage.message) }
        : msg.parentMessage,
  };
};

export const decryptAllMessages = (msg: IMessage[]) => {
  return msg.map((m) => {
    return decryptOneMessage(m);
  });
};

export const isAllContactsInTheGroup = (arr: IContact[], userId: string, usersId: string) => {
  const res = arr.filter((user) => {
    if (user.id !== userId && user.email && !usersId.includes(user.id)) {
      return user;
    }
  });
  if (res.length === 0) {
    return true;
  } else return false;
};

export const findItemById = (arr: any, id: string) => {
  return arr.filter((item: any) => item.id === id);
};

export const countArrayItems = (arr: IReactions[]) => {
  const output = [] as { reaction: string; count: number }[];
  const reactions = arr.reduce((acc: any, el) => {
    acc[el.reaction] = (acc[el.reaction] || 0) + 1;
    return acc;
  }, {});
  for (let key in reactions) {
    output.push({ reaction: key, count: reactions[key] });
  }
  return output;
};

export const getFormattedTime = (createdAt: string) => {
  const date = new Date(createdAt);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

const isToday = (createdAt: string) => {
  const today = new Date();
  const dateToCheck = new Date(createdAt);

  if (today.toDateString() === dateToCheck.toDateString()) {
    return true;
  }

  return false;
};

const isYesterday = (createdAt: string) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateToCheck = new Date(createdAt);

  if (yesterday.toDateString() === dateToCheck.toDateString()) {
    return true;
  }

  return false;
};
export const getDate = (createdAt: string) => {
  const date = new Date(createdAt);
  if (isToday(createdAt)) {
    return "Сегодня";
  }
  if (isYesterday(createdAt)) {
    return "Вчера";
  } else
    return (
      String(date.getDate()).padStart(2, "0") +
      "." +
      String(date.getMonth() + 1).padStart(2, "0") +
      "." +
      String(date.getFullYear())
    );
};

export const creactFileToSend = (fileData: File | Blob, type: string) => {
  return new File([fileData], "image.png", { type: type });
};

export const countLines = (textarea: HTMLTextAreaElement) => {
  let _buffer: any;
  if (_buffer == null) {
    _buffer = document.createElement("textarea");
    _buffer.style.border = "none";
    _buffer.style.height = "0";
    _buffer.style.overflow = "hidden";
    _buffer.style.padding = "0";
    _buffer.style.position = "absolute";
    _buffer.style.left = "0";
    _buffer.style.top = "0";
    _buffer.style.zIndex = "-1";
    document.body.appendChild(_buffer);
  }

  var cs = window.getComputedStyle(textarea);
  var pl = parseInt(cs.paddingLeft);
  var pr = parseInt(cs.paddingRight);
  var lh = parseInt(cs.lineHeight);

  // [cs.lineHeight] may return 'normal', which means line height = font size.
  if (isNaN(lh)) lh = parseInt(cs.fontSize);

  // Copy content width.
  _buffer.style.width = textarea.clientWidth - pl - pr + "px";

  // Copy text properties.
  _buffer.style.font = cs.font;
  _buffer.style.letterSpacing = cs.letterSpacing;
  _buffer.style.whiteSpace = cs.whiteSpace;
  _buffer.style.wordBreak = cs.wordBreak;
  _buffer.style.wordSpacing = cs.wordSpacing;
  _buffer.style.wordWrap = cs.wordWrap;

  // Copy value.
  _buffer.value = textarea.value;

  var result = Math.floor(_buffer.scrollHeight / lh);
  if (result === 0) result = 1;
  return result;
};

export const emailRegex = /^\S+@\S+\.\S+$/;

function saveFile(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export async function downloadFile(url: string, name: string) {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json, text/plain,application/zip, image/png, image/jpeg, image/*",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    saveFile(blobUrl, name);
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("Произошлп ошибка:", err);
  }
}

export const readFiles = (file: File): Promise<string> => {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (e) => res(e.target?.result as string);
    reader.onerror = (e) => rej(e);
    reader.readAsDataURL(file);
  });
};

export const playSound = (url: string) => {
  const audio = new Audio(url);
  audio.play();
};
