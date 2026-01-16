import { EmployeeStatsOverview } from '@/features/dashboard/employee-app/widgets/stats-overview';
import { EmployeeTodayBookingDashboard } from '@/features/dashboard/employee-app/widgets/today-booking';
import { EmployeeWorkScheduleSummary } from '@/features/dashboard/employee-app/widgets/work-schedule-summary';

export function EmployeeDashboardView() {
  return (
    <>
      <EmployeeStatsOverview />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <EmployeeTodayBookingDashboard />
        <EmployeeWorkScheduleSummary />
      </div>
    </>
  );
}
