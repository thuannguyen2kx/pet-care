import { socket } from '@/shared/socket/socket.client';
import { SOCKET_EVENTS } from '@/shared/socket/socket.events';

export const registerPaymentSocket = ({ onPaymentPaid }: { onPaymentPaid: () => void }) => {
  socket.on(SOCKET_EVENTS.PAYMENT.PAID, onPaymentPaid);

  return () => {
    socket.off(SOCKET_EVENTS.PAYMENT.PAID, onPaymentPaid);
  };
};
