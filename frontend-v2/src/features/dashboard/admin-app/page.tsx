import { AdminRecentBooking } from '@/features/dashboard/admin-app/widgets/recent-booking';
import { AdminStatsOverview } from '@/features/dashboard/admin-app/widgets/stats-overview';
import { AdminTopEmployees } from '@/features/dashboard/admin-app/widgets/top-employees';

export default function AdminDashboardPage() {
  return (
    <>
      <AdminStatsOverview />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <AdminRecentBooking />
        <AdminTopEmployees />
      </div>
    </>
  );
}
