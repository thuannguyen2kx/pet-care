import { Server } from "socket.io";
import { AuthSocket } from "../socket.types";

export const registerNotificationGateway = (io: Server, socket: AuthSocket) => {
  const user = socket.user;
  if (!user) return;

  const userRoom = `user:${user.userId}`;

  socket.join(userRoom);

  console.log(`🔔 User ${user.userId} joined notification room`);

  socket.on("disconnect", () => {
    console.log(`❌ User ${user.userId} disconnected`);
  });
};
