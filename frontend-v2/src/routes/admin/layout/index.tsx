import type React from 'react';

import { useAdminNotificationSocket } from '@/features/notification/hooks/use-admin-notification-socket';
import { DashboardHeader } from '@/routes/admin/layout/header';
import { DashboardSidebar } from '@/routes/admin/layout/sidebar';
import { useUser } from '@/shared/lib/auth';

type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
};
export default function DashboardLayout({ title, description, children }: Props) {
  const user = useUser();
  useAdminNotificationSocket();

  if (!user.data) return null;

  const { profile } = user.data;

  return (
    <div className="bg-background flex min-h-dvh">
      <DashboardSidebar
        name={profile.displayName}
        imageUrl={profile.avatarUrl ?? undefined}
        email={profile.email}
      />
      <div className="flex flex-1 flex-col">
        <DashboardHeader title={title} description={description} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
