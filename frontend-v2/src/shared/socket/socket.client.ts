import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

import { env } from '@/shared/config/env';

export const socket: Socket = io(env.SOCKET_URL, {
  // extraHeaders: {
  //   Authorization: `Bearer ${storage.get(STORAGE_KEYS.ACCESS_TOKEN)}`,
  // },
  autoConnect: false,
  transports: ['websocket'],
});
