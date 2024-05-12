import axios, { AxiosResponse } from "axios";

import { deleteCookie, getCookie, setCookie } from "./cookies";
import { ICreateChatDto, ILoginDto } from "./types";

export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const REFRESH_TOKEN = `${BASE_URL}refresh`;
export const SIGN_IN_URL = `${BASE_URL}signin`;
export const SIGN_UP_URL = `${BASE_URL}signup`;
export const FORGOT_PASSWORD_URL = `${BASE_URL}forgot-password`;
export const RESET_PASSWORD_URL = `${BASE_URL}reset-password`;

export const checkResponse = <T>(res: AxiosResponse): Promise<T> => {
  if (res.status !== 200 && res.status !== 201) {
    throw new Error();
  } else {
    return res.data;
  }
};

const checkToken = async () => {
  let accessToken: string | undefined = getCookie("token");
  const refreshToken: string | undefined = localStorage.token;
  if (!accessToken && Date.now() >= +localStorage.expires_on) {
    deleteCookie("token");
    deleteCookie("expires_on");
    localStorage.removeItem("token");
    return;
  }

  if (!accessToken) {
    if (Date.now() <= +localStorage.expires_on) {
      try {
        const res = await axios(REFRESH_TOKEN, {
          method: "GET",
          headers: { Authorization: `Bearer ${refreshToken}` },
        });
        accessToken = res.data.accessToken;
        localStorage.setItem("token", res.data.refreshToken);
        localStorage.setItem("expires_on", String(Date.now() + 600000 * 1000));
        setCookie("token", res.data.accessToken, { path: "/", expires: 6000 });
      } catch (e: any) {
        deleteCookie("token");
        deleteCookie("expires_on");
        localStorage.removeItem("token");
        return;
      }
    }
  }
};
export const registerUser = async (data: ILoginDto) => {
  const res = await axios(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
  localStorage.setItem("token", res.data.refreshToken);
  localStorage.setItem("expires_on", String(Date.now() + 600000 * 1000));
  setCookie("token", res.data.accessToken, { path: "/", expires: 6000 });
  return checkResponse<any>(res);
};

export const login = async (data: ILoginDto) => {
  const res = await axios(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
  localStorage.setItem("token", res.data.refreshToken);
  localStorage.setItem("expires_on", String(Date.now() + 600000 * 1000));
  setCookie("token", res.data.accessToken, { path: "/", expires: 6000 });
  return checkResponse<any>(res);
};

export const findUser = async (data: string) => {
  checkToken();
  const res = await axios(`${BASE_URL}/users/searchedUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    data,
  });
  return checkResponse<any>(res);
};
// getOneUserData
export const findUserById = async (data: any) => {
  // console.log(data);
  checkToken();
  const res = await axios(`${BASE_URL}/users/getOneUserData`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    data,
  });
  return checkResponse<any>(res);
};

export const createChat = async (data: ICreateChatDto) => {
  // console.log(data);
  checkToken();
  const res = await axios(`${BASE_URL}/rooms/createGroupChat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    data,
  });
  return checkResponse<any>(res);
};

// export const createGroupChat = async (data: any) => {
//   checkToken();
//   const res = await axios(`${BASE_URL}/rooms/createGroupChat`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getCookie("token")}`,
//     },
//     data,
//   });
//   return checkResponse<any>(res);
// };
export const getMyChats = async (data: { userId: string }) => {
  checkToken();
  const res = await axios(`${BASE_URL}/rooms/getAllGroups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    data,
  });
  return checkResponse<any>(res);
};

export const getOneRoom = async (data: { roomId: string }) => {
  // console.log(data);
  checkToken();
  const res = await axios(`${BASE_URL}/rooms/getOneGroup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    data,
  });
  return checkResponse<any>(res);
};

export const connectToChat = async (data: { currentUserId: string; recipientUserId: string }) => {
  checkToken();
  const res = await axios(`${BASE_URL}/rooms/connectToRoom`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    data,
  });
  return checkResponse<any>(res);
};

export const getPrevMessage = async (param: any) => {
  console.log(param);
  checkToken();
  const res = await axios(`${BASE_URL}/messages/getPrevMessage/${param.limit}/${param.offset}/${param.roomId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    // data,
  });
  return checkResponse<any>(res);
};

export const findMessages = async (param: any) => {
  // console.log(param);
  checkToken();
  const res = await axios(`${BASE_URL}/messages/getAllMessages/${param.query}/${param.roomId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    // data,
  });
  return checkResponse<any>(res);
};

export const getMessageIndex = async (param: any) => {
  // console.log(param);
  checkToken();
  const res = await axios(`${BASE_URL}/messages/getMessageIndex/${param.id}/${param.roomId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    // data,
  });
  return checkResponse<any>(res);
};

export const getOneUser = async (data: any) => {
  checkToken();
  const res = await axios(`${BASE_URL}/users/getOneUserData`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    data,
  });
  return checkResponse<any>(res);
};

// export const updateAvatar = async (data: any) => {
//   checkToken();
//   console.log(data);
//   const res = await axios(`${BASE_URL}/users/updateAvatar`, {
//     method: "POST",
//     headers: {
//       // "Content-Type": "application/json",
//       Authorization: `Bearer ${getCookie("token")}`,
//     },
//     data,
//   });
//   return checkResponse<any>(res);
// };

// export const getAvatar = async (id: any) => {
//   checkToken();
//   const res = await axios(`${BASE_URL}/avatar/${id}`, {
//     method: "GET",
//     headers: {
//       // "Content-Type": "application/json",
//       Authorization: `Bearer ${getCookie("token")}`,
//     },
//   });
//   return checkResponse<any>(res);
// };

//?id=${data.id}&roomId=${data.roomId}&currentUserId=${data.currentUserId}&recipientUserId=${data.recipientUserId}&parentMessage=${data.parentMessage}&isForwarded=${data.isForwarded}
export const sendFile = async (data: any) => {
  checkToken();
  // console.log(data);
  const res = await axios(`${BASE_URL}/messages/uploadFile`, {
    method: "POST",
    headers: {
      // "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    data,
  });
  return checkResponse<any>(res);
};

// export const sendFile = async (data: any, form: any) => {
//   checkToken();
//   console.log(data);
//   const res = await axios(
//     `${BASE_URL}/messages/uploadFile?roomId=${form.roomId}&currentUserId=${form.currentUserId}&recipientUserId=${form.recipientUserId}&message=${form.message}&parentMessage=${form.parentMessage}&isForwarded=${form.isForwarded}&readBy=${form.readBy}`,
//     {
//       method: "POST",
//       headers: {
//         // "Content-Type": "application/json",
//         Authorization: `Bearer ${getCookie("token")}`,
//       },
//       data,
//     },
//   );
//   return checkResponse<any>(res);
// };
export const getRecoveryCode = async (data: any) => {
  console.log(data);
  checkToken();
  const res = await axios(`${BASE_URL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    data,
  });
  return checkResponse<any>(res);
};

export const resetPassword = async (data: any) => {
  console.log(data);
  checkToken();
  const res = await axios(`${BASE_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    data,
  });
  return checkResponse<any>(res);
};
