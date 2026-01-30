import { useEffect } from 'react';

import { STORAGE_KEYS } from '@/shared/constant';
import { storage } from '@/shared/lib/storage';
import { socket } from '@/shared/socket/socket.client';

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const token = storage.get(STORAGE_KEYS.ACCESS_TOKEN);

  useEffect(() => {
    if (!token) return;

    socket.auth = { token };
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return <>{children}</>;
};
