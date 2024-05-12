import { Socket, io } from "socket.io-client";

export const socketInstane = io("http://localhost:3001", { transports: ["websocket", "polling", "flashsocket"] });
