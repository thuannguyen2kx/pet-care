import type React from 'react';

import { useEmployeeNotificationSocket } from '@/features/notification/hooks/use-employee-notification-socket';
import { EmployeeDashboardHeader } from '@/routes/employee/layout/header';
import { EmployeeDashboardSidebar } from '@/routes/employee/layout/sidebar';
import { useUser } from '@/shared/lib/auth';

type Props = {
  children: React.ReactNode;
  title: string;
  description?: string;
};
export default function EmployeeLayout({ children, title, description }: Props) {
  const user = useUser();
  useEmployeeNotificationSocket();

  if (!user.data) return null;

  return (
    <div className="bg-background flex min-h-screen">
      <EmployeeDashboardSidebar
        fullName={user.data?.profile.displayName}
        email={user.data?.profile.email}
        imageUrl={user.data?.profile.avatarUrl ?? undefined}
      />
      <div className="flex flex-1 flex-col">
        <EmployeeDashboardHeader title={title} description={description} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
