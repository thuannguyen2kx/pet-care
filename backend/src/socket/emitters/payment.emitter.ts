import { Server } from "socket.io";
import { SOCKET_EVENTS } from "../socket.events";

let io: Server;

export const setPaymentIO = (server: Server) => {
  io = server;
};

export const emitPaymentPaid = (payload: {
  userId: string;
  paymentId: string;
  bookingId: string;
}) => {
  if (!io) return;

  io.to(`user:${payload.userId}`).emit(SOCKET_EVENTS.PAYMENT.PAID, {
    paymentId: payload.paymentId,
    bookingId: payload.bookingId,
  });
};
