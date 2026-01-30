import jwt from "jsonwebtoken";
import { AuthSocket } from "./socket.types";
import { AccessTPayload } from "../utils/jw";

export const socketAuthMiddleware = (
  socket: AuthSocket,
  next: (err?: Error) => void,
) => {
  try {
    const authHeader =
      socket.handshake.auth?.token || socket.handshake.headers.authorization;

    if (!authHeader) {
      return next(new Error("Unauthorized"));
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as AccessTPayload;

    socket.user = {
      userId: payload.userId,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
};
