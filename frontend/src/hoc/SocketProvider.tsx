import { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

import { io } from "socket.io-client";

import { Context } from "..";

export const SocketContext = createContext<any | null>(null);

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const userStore = useContext(Context).user;
  // const [socket, setSocket] = useState<any>(null);
  const [socket] = useState<any>(
    io(process.env.REACT_APP_WS_URL as string, {
      transports: ["websocket", "polling", "flashsocket"],
      query: { userId: userStore.user.id },
    }),
  );

  // useEffect(() => {
  //   setSocket(
  //     io(process.env.REACT_APP_BASE_URL as string, {
  //       transports: ["websocket", "polling", "flashsocket"],
  //       query: { userId: userStore.user.id },
  //     }),
  //   );

  //   return () => {
  //     setSocket(null);
  //   };
  // }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
export default SocketProvider;
