import { Server } from "socket.io";
import { SOCKET_EVENTS } from "../socket.events";

let io: Server;

export const setNotificationIO = (server: Server) => {
  io = server;
};

export const emitNewNotification = (userId: string) => {
  if (!io) return;

  io.to(`user:${userId}`).emit(SOCKET_EVENTS.NOTIFICATION.NEW);
};
