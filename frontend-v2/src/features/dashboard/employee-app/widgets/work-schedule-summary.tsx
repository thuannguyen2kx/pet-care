import { format, isToday, parseISO } from 'date-fns';
import { CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router';

import type { EmployeeSchedule } from '@/features/employee/domain/employee.entity';
import { useEmployeeSchedule } from '@/features/employee-schedule/api/get-employee-schedule';
import { getWeekRange } from '@/features/employee-schedule/domain/date-range';
import { paths } from '@/shared/config/paths';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

const DAYS_OF_WEEK = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export function EmployeeWorkScheduleSummary() {
  const { startDate, endDate } = getWeekRange(new Date());

  const scheduleQuery = useEmployeeSchedule({
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd'),
  });
  const schedule = scheduleQuery.data ?? [];

  return (
    <Card className="rounded-none border-none p-4 shadow-none lg:col-span-3">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Lịch làm việc tuần này</CardTitle>
        <CardDescription>Theo dỗi lịch làm việc của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <WeekScheduleGrid isLoading={scheduleQuery.isLoading} schedule={schedule} />

        <div className="text-muted-foreground mt-4 flex items-center justify-end gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="bg-primary h-2 w-2 rounded-full" />
            Ngày làm việc
          </div>
          <div className="flex items-center gap-1">
            <span className="bg-muted h-2 w-2 rounded-full" />
            Nghỉ
          </div>
        </div>

        <Link to={paths.employee.schedule.path} className="mt-4 block">
          <Button variant="outline" className="w-full bg-transparent">
            Xem chi tiết lịch làm việc
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export function WeekScheduleGrid({
  isLoading,
  schedule,
}: {
  isLoading: boolean;
  schedule: EmployeeSchedule[];
}) {
  if (isLoading) {
    return <WeekScheduleSkeleton />;
  }

  return (
    <div className="grid grid-cols-7 gap-3">
      {DAYS_OF_WEEK.map((label, index) => {
        const day = schedule.find((d) => d.dayOfWeek === index);
        const working = day?.isWorking;
        const today = day ? isToday(parseISO(day.date)) : false;

        return (
          <div
            key={label}
            className={cn(
              'group relative overflow-hidden rounded-xl border-2 transition-all duration-300',
              working
                ? today
                  ? 'border-primary bg-primary shadow-primary/20 shadow-lg'
                  : 'border-primary/20 bg-primary/5 hover:border-primary/40 hover:bg-primary/10'
                : 'border-border bg-muted/30 hover:bg-muted/50',
            )}
          >
            <div className="flex flex-col items-center gap-2 p-3">
              {/* Day label */}
              <span
                className={cn(
                  'text-sm font-semibold tracking-tight',
                  working
                    ? today
                      ? 'text-primary-foreground'
                      : 'text-primary'
                    : 'text-muted-foreground',
                )}
              >
                {label}
              </span>

              <div className="flex h-8 w-8 items-center justify-center">
                {working ? (
                  <div
                    className={cn(
                      'rounded-full p-1.5',
                      today ? 'bg-primary-foreground/20' : 'bg-primary/20',
                    )}
                  >
                    <CheckCircle2
                      className={cn('h-4 w-4', today ? 'text-primary-foreground' : 'text-primary')}
                    />
                  </div>
                ) : (
                  <div className="bg-muted-foreground/30 h-1 w-6 rounded-full" />
                )}
              </div>

              {working && day?.startTime && day?.endTime ? (
                <div
                  className={cn(
                    'flex items-center gap-1 rounded-md px-2 py-1',
                    today ? 'bg-primary-foreground/10' : 'bg-primary/10',
                  )}
                >
                  <Clock
                    className={cn(
                      'h-3 w-3',
                      today ? 'text-primary-foreground/70' : 'text-primary/70',
                    )}
                  />
                  <span
                    className={cn(
                      'text-[10px] leading-none font-medium',
                      today ? 'text-primary-foreground/90' : 'text-primary/90',
                    )}
                  >
                    {day.startTime}
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground/50 text-[10px]">Nghỉ</span>
              )}
            </div>

            {working && !today && (
              <div className="from-primary/0 to-primary/5 absolute inset-0 bg-linear-to-br via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function WeekScheduleSkeleton() {
  return (
    <div className="grid grid-cols-7 gap-3">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="border-border rounded-xl border-2 p-3">
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-4 w-6 rounded" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-12 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
