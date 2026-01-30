import { Outlet } from 'react-router';

import { Header } from './header';

import { useNotificationSocket } from '@/features/notification/hooks/use-notification-socket';

export default function CustomerLayout() {
  useNotificationSocket();
  return (
    <main className="bg-background min-h-dvh">
      <Header />
      <Outlet />
    </main>
  );
}
