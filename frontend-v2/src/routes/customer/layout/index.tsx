import { Outlet } from 'react-router';

import { Header } from './header';

export default function CustomerLayout() {
  return (
    <main className="bg-background min-h-dvh">
      <Header />
      <Outlet />
    </main>
  );
}
