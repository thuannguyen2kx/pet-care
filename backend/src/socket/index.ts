import { Server } from "socket.io";
import { socketAuthMiddleware } from "./socket.context";
import { registerNotificationGateway } from "./gateways/notification.gateway";
import { setNotificationIO } from "./emitters/notification.emitter";
import { config } from "../config/app.config";
import { setPaymentIO } from "./emitters/payment.emitter";
import { registerPaymentGateway } from "./gateways/payment.gateway";
import { registerUserGateway } from "./gateways/register-user.gateway";

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
    registerUserGateway(socket);
    registerNotificationGateway(io, socket);
    registerPaymentGateway(io, socket);
  });

  setNotificationIO(io);
  setPaymentIO(io);
  return io;
};
