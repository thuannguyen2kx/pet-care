import { Outlet } from 'react-router';

import { Header } from './header';

import { useNotificationSocket } from '@/features/notification/hooks/use-notification-socket';
import { usePaymentSocket } from '@/features/payments/hooks/use-payment-socket';

export default function CustomerLayout() {
  useNotificationSocket();
  usePaymentSocket();

  return (
    <main className="bg-background min-h-dvh">
      <Header />
      <Outlet />
    </main>
  );
}
