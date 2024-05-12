import React, { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

import { io } from "socket.io-client";

import { Context } from "..";
import { socketInstane } from "../utils/webSocket";

export const SocketContext = createContext<any | null>(null);

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const userStore = useContext(Context).user;
  const [socket] = useState<any>(
    io(process.env.REACT_APP_BASE_URL as string, {
      transports: ["websocket", "polling", "flashsocket"],
      query: { userId: userStore.user.id },
    }),
  );
  // useEffect(() => {
  //   const s = io("http://localhost:3001", {
  //     transports: ["websocket", "polling", "flashsocket"],
  //     query: { userId: userStore.user.id },
  //   });
  //   setSocket(s);
  // }, [userStore.user]);
  // console.log(socket);
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
export default SocketProvider;
