import { Calendar, Clock, Star } from 'lucide-react';

import { useTopEmployees } from '@/features/report/api/get-top-employees';
import type { TopEmployee } from '@/features/report/domain/report-entity';
import { EmptyState } from '@/shared/components/template/empty-state';
import { getInitials } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

export function EmployeeReportWidget() {
  const topEmployeesQuery = useTopEmployees();

  const employees = topEmployeesQuery.data ?? [];
  return (
    <Card className="rounded-none border-none p-4 shadow-none">
      <CardHeader>
        <CardTitle>Hiệu suất nhân viên</CardTitle>
        <CardDescription>Xếp hạng theo doanh thu và đánh giá</CardDescription>
      </CardHeader>
      <CardContent>
        <EmployeeList isLoading={topEmployeesQuery.isLoading} employees={employees} />
      </CardContent>
    </Card>
  );
}

function EmployeeList({ isLoading, employees }: { isLoading: boolean; employees: TopEmployee[] }) {
  if (isLoading) {
    return <EmployeeListSkeleton />;
  }
  if (employees.length === 0) {
    return (
      <EmptyState
        title="Hiện chưa có thống kê"
        description="Danh sách nhân viên chưa có dữ liệu đánh giá"
        icon={Star}
      />
    );
  }
  return (
    <div className="space-y-4">
      {employees.map((employee, index) => (
        <EmployeeListItem key={employee.id} employee={employee} rank={index + 1} />
      ))}
    </div>
  );
}

function EmployeeListItem({ employee, rank }: { employee: TopEmployee; rank: number }) {
  return (
    <div key={employee.id} className="bg-muted/30 flex items-center gap-4 p-4">
      <span className="text-primary w-8 text-xl font-bold">{rank}</span>
      <div className="bg-secondary flex h-12 w-12 items-center justify-center overflow-hidden rounded-full">
        <Avatar>
          <AvatarImage src={employee.profilePicture} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {getInitials(employee.fullName)}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{employee.fullName}</p>
        <div className="text-muted-foreground flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {employee.stats.completedBookings} lịch hẹn
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {employee?.stats.completedBookings} hoàn thành
          </span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-primary font-semibold">
          {((employee.stats.totalRevenue || 0) / 1000000).toFixed(1)}M
        </p>
        <div className="flex items-center gap-1 text-sm">
          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
          <span>{employee.stats.rating}</span>
        </div>
      </div>
    </div>
  );
}
function EmployeeListSkeleton() {
  return (
    <div className="space-y-2.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="border-border rounded-lg border p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-full" />

            <Skeleton className="h-12 w-12 rounded-full" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>

            <div className="shrink-0 space-y-1.5 text-right">
              <Skeleton className="ml-auto h-6 w-16" />
              <Skeleton className="ml-auto h-4 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
