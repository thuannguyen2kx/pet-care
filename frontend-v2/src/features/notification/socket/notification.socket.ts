import { socket } from '@/shared/socket/socket.client';
import { SOCKET_EVENTS } from '@/shared/socket/socket.events';

export const registerNotificationSocket = ({
  onNewNotification,
}: {
  onNewNotification: () => void;
}) => {
  socket.on(SOCKET_EVENTS.NOTIFICATION.NEW, onNewNotification);

  return () => {
    socket.off(SOCKET_EVENTS.NOTIFICATION.NEW, onNewNotification);
  };
};
