import { QuickActions } from '@/features/dashboard/customer-app/ui/quick-actions';
import { MyPetsWidget } from '@/features/dashboard/customer-app/widgets/my-pets';
import { TodayBookingsWidget } from '@/features/dashboard/customer-app/widgets/today-bookings';
import { UpcommingBookingsWidget } from '@/features/dashboard/customer-app/widgets/upcomming-bookings';

type Props = {
  displayName: string;
};
export function CustomerAppDashboardView({ displayName }: Props) {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold">Xin chào, {displayName}! 👋</h1>
        <p className="text-muted-foreground">Hôm nay bạn muốn làm gì cho thú cưng của mình?</p>
      </div>

      <QuickActions />
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <TodayBookingsWidget />
          <UpcommingBookingsWidget />
        </div>
        <div>
          <MyPetsWidget />
        </div>
      </div>
    </div>
  );
}
