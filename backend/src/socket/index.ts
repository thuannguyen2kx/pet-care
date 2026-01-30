import { Server } from "socket.io";
import { socketAuthMiddleware } from "./socket.context";
import { registerNotificationGateway } from "./gateways/notification.gateway";
import { setNotificationIO } from "./emitters/notification.emitter";
import { config } from "../config/app.config";

export const initSocket = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: config.FRONTEND_ORIGIN,
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);
    registerNotificationGateway(io, socket);
  });

  setNotificationIO(io);

  return io;
};
