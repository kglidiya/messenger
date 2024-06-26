import axios, { AxiosError, AxiosResponse } from "axios";

import { deleteCookie, getCookie, setCookie } from "./cookies";
import {
  IAllGroupsResponse,
  ICreateChatDto,
  ICreateChatResponse,
  IGetMessagesRequest,
  ILoginDto,
  IMessage,
  IResetPasswordDto,
  IRoom,
  IUser,
  LoginResponse,
} from "./types";

export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const REFRESH_TOKEN = `${BASE_URL}refresh`;
export const SIGN_IN_URL = `${BASE_URL}signin`;
export const SIGN_UP_URL = `${BASE_URL}signup`;
export const FORGOT_PASSWORD_URL = `${BASE_URL}forgot-password`;
export const RESET_PASSWORD_URL = `${BASE_URL}reset-password`;
export const USERS_URL = `${BASE_URL}users`;
export const ROOMS_URL = `${BASE_URL}rooms`;
export const MESSAGES_URL = `${BASE_URL}messages`;

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
    window.location.reload();
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
        setCookie("token", res.data.accessToken, { path: "/", expires: 6000 * 7200 });
      } catch (e: any) {
        deleteCookie("token");
        deleteCookie("expires_on");
        localStorage.removeItem("token");
        window.location.reload();
        return;
      }
    }
  }
};
export const registerUser = async (data: ILoginDto) => {
  try {
    const res = await axios(SIGN_UP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data,
    });
    localStorage.setItem("token", res.data.refreshToken);
    localStorage.setItem("expires_on", String(Date.now() + 600000 * 1000));
    setCookie("token", res.data.accessToken, { path: "/", expires: 6000 * 7200 });
    return checkResponse<LoginResponse | { error: string }>(res);
  } catch (error) {
    if (error instanceof AxiosError) {
      return { error: error.response?.data.message };
    }
  }
};

export const login = async (data: ILoginDto) => {
  try {
    const res = await axios(`${BASE_URL}signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data,
    });
    localStorage.setItem("token", res.data.refreshToken);
    localStorage.setItem("expires_on", String(Date.now() + 600000 * 1000));
    setCookie("token", res.data.accessToken, { path: "/", expires: 6000 * 7200 });
    return checkResponse<LoginResponse | { error: string }>(res);
  } catch (error) {
    if (error instanceof AxiosError) {
      return { error: error.response?.data.message };
    }
  }
};

export const findUser = async (data: string) => {
  await checkToken();
  const res = await axios(`${USERS_URL}/searchedUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    data,
  });
  return checkResponse<IUser>(res);
};

export const createChat = async (data: ICreateChatDto) => {
  await checkToken();
  const res = await axios(`${ROOMS_URL}/createGroupChat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    data,
  });
  return checkResponse<ICreateChatResponse>(res);
};

export const getMyChats = async (data: { userId: string }) => {
  await checkToken();
  const res = await axios(`${ROOMS_URL}/getAllGroups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    data,
  });
  return checkResponse<IAllGroupsResponse>(res);
};

export const getOneRoom = async (data: { roomId: string }) => {
  await checkToken();
  const res = await axios(`${ROOMS_URL}/getOneGroup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    data,
  });
  return checkResponse<IRoom>(res);
};

export const getPrevMessage = async (param: IGetMessagesRequest) => {
  await checkToken();
  const res = await axios(`${MESSAGES_URL}/getPrevMessage/${param.limit}/${param.offset}/${param.roomId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });
  return checkResponse<IMessage[]>(res);
};

export const findMessages = async (param: { query: string; roomId: string }) => {
  await checkToken();
  const res = await axios(`${MESSAGES_URL}/getAllMessages/${param.query}/${param.roomId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });
  return checkResponse<IMessage[]>(res);
};

export const getMessageIndex = async (param: { id: string; roomId: string }) => {
  await checkToken();
  const res = await axios(`${MESSAGES_URL}/getMessageIndex/${param.id}/${param.roomId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });
  return checkResponse<number>(res);
};

export const sendFile = async (data: FormData) => {
  await checkToken();
  const res = await axios(`${MESSAGES_URL}/uploadFile`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
    data,
  });
  return checkResponse<IMessage>(res);
};

export const getRecoveryCode = async (data: { email: string }) => {
  await checkToken();
  const res = await axios(FORGOT_PASSWORD_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    data,
  });
  return checkResponse<string>(res);
};

export const resetPassword = async (data: IResetPasswordDto) => {
  await checkToken();
  const res = await axios(RESET_PASSWORD_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    data,
  });
  return checkResponse<string>(res);
};
