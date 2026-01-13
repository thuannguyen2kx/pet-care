import { CustomerAppDashboardView } from '@/features/dashboard/customer-app/ui/dashboard-view';
import { useUser } from '@/shared/lib/auth';

export default function CustomerAppDashboardPage() {
  const user = useUser();

  const displayName = user.data?.profile.displayName || 'Khách hàng';
  return <CustomerAppDashboardView displayName={displayName} />;
}
