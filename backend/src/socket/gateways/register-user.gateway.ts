import { AuthSocket } from "../socket.types";

export const registerUserGateway = (socket: AuthSocket) => {
  const user = socket.user;
  if (!user) return;

  const userRoom = `user:${user.userId}`;
  socket.join(userRoom);

  console.log(`🔔 User ${user.userId} joined user room`);

  socket.on("disconnect", () => {
    console.log(`❌ User ${user.userId} disconnected`);
  });
};
