import { Socket } from "socket.io";

export interface SocketUser {
  userId: string;
  role: string;
}

export interface AuthSocket extends Socket {
  user?: SocketUser;
}
