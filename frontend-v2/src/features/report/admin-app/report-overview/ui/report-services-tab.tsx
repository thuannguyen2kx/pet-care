import { ReportServiceByBookingCount } from '@/features/report/admin-app/report-overview/widgets/report-service-by-booking-count';
import { ReportServicesByRevenueWidget } from '@/features/report/admin-app/report-overview/widgets/report-services-by-revenue';

export function ReportServicesTab() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ReportServiceByBookingCount />
      <ReportServicesByRevenueWidget />
    </div>
  );
}
