import { FC, PropsWithChildren, createContext, useContext, useState } from "react";

import { Socket, io } from "socket.io-client";

import { Context } from "..";

export const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const store = useContext(Context)?.store;
  const [socket] = useState<Socket>(
    io(process.env.REACT_APP_WS_URL as string, {
      transports: ["websocket", "polling", "flashsocket"],
      query: { userId: store?.user?.id },
    }),
  );

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
export default SocketProvider;
