import { IContact } from "./types";

export const isAllContactsInTheGroup = (arr: IContact[], userId: string, usersId: string) => {
  const res = arr.filter((user: any) => {
    if (user.id !== userId && user.email && !usersId.includes(user.id)) return user;
  });
  // console.log(res);
  if (res.length === 0) {
    return true;
  } else return false;
};

export const findItemById = (arr: any, id: any) => {
  return arr.filter((user: any) => user.id === id);
};

export const countArrayItems = (arr: any) => {
  const output = [] as any;
  const reactions = arr.reduce((acc: any, el: any) => {
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

const isToday = (createdAt: any) => {
  const today = new Date();
  const dateToCheck = new Date(createdAt);

  if (today.toDateString() === dateToCheck.toDateString()) {
    return true;
  }

  return false;
};

const isYesterday = (createdAt: any) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateToCheck = new Date(createdAt);

  if (yesterday.toDateString() === dateToCheck.toDateString()) {
    return true;
  }

  return false;
};
export const getDate = (createdAt: any) => {
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

export const creactFileToSend = (fileData: any, type: string) => {
  return new File([fileData], "image.png", { type: type });
};

export const countLines = (textarea: any) => {
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

function saveFile(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = "file-name";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export async function downloadFile(url: string) {
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
    saveFile(blobUrl);
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("Error in fetching and downloading file:", err);
  }
}
