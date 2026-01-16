import { Star, User2Icon } from 'lucide-react';

import { useTopEmployees } from '@/features/report/api/get-top-employees';
import type { TopEmployee } from '@/features/report/domain/report-entity';
import { EmptyState } from '@/shared/components/template/empty-state';
import { getInitials } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

export function AdminTopEmployees() {
  const topEmployeesQuery = useTopEmployees();
  return (
    <Card className="rounded-none border-none p-4 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Nhân viên nổi bật</CardTitle>
        <CardDescription>Xếp hạng theo đánh giá</CardDescription>
      </CardHeader>
      <CardContent>
        <TopEmployeeList
          isLoading={topEmployeesQuery.isLoading}
          employees={topEmployeesQuery.data ?? []}
        />
      </CardContent>
    </Card>
  );
}
function TopEmployeeList({
  isLoading,
  employees,
}: {
  isLoading: boolean;
  employees: TopEmployee[];
}) {
  if (isLoading) {
    return <TopEmployeesSkeleton />;
  }
  if (employees.length === 0) {
    return (
      <EmptyState
        title="Hiện chưa có thống kê"
        description="Danh sách nhân viên chưa có dữ liệu đánh giá"
        icon={User2Icon}
      />
    );
  }
  return (
    <div className="space-y-4">
      {employees.map((employee, index) => (
        <TopEmployeeItem key={employee.id} employee={employee} rank={index + 1} />
      ))}
    </div>
  );
}
function TopEmployeeItem({ employee, rank }: { employee: TopEmployee; rank: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground w-5 text-sm font-medium">{rank}</span>

      <Avatar className="h-10 w-10">
        <AvatarImage src={employee.profilePicture} />
        <AvatarFallback className="bg-primary/10 text-primary text-sm">
          {getInitials(employee.fullName)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{employee.fullName}</p>
        <p className="text-muted-foreground text-xs">{employee.stats.completedBookings} dịch vụ</p>
      </div>

      <div className="flex items-center gap-1">
        <Star className="fill-warning text-warning h-4 w-4" />
        <span className="text-sm font-medium">{employee.stats.rating.toFixed(1)}</span>
      </div>
    </div>
  );
}

function TopEmployeesSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="h-4 w-5" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-4 w-10" />
        </div>
      ))}
    </div>
  );
}
