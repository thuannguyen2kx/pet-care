import { Clock, MoreVerticalIcon } from 'lucide-react';

import { ScheduleCell } from '@/features/employee-schedule/components/employee-schedule/schedule-cell';
import type { TEmployeeWeekSchedule } from '@/features/employee-schedule/domain/schedule.type';
import { getInitials } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

type Props = {
  employee: TEmployeeWeekSchedule;
  onCreateShift: (employeeId: string) => void;
  onBulkCreateShift: (employeeId: string) => void;
  onCreateShiftOverride: (employeeId: string) => void;
  onCreateBreakTemplate: (employeeId: string) => void;
  onViewEmployeeSchedule: (employeeId: string) => void;
  onNavigateSchedule: (employeeId: string) => void;
};

export function EmployeeScheduleRow({
  employee,
  onCreateShift,
  onBulkCreateShift,
  onCreateShiftOverride,
  onCreateBreakTemplate,
  onViewEmployeeSchedule,
  onNavigateSchedule,
}: Props) {
  return (
    <tr className="border-border hover:bg-muted/20 border-b transition-colors">
      <td className="p-4">
        <div
          role="button"
          className="flex cursor-pointer items-center gap-3"
          onClick={() => onViewEmployeeSchedule(employee.employeeId)}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={employee.profilePicture || '/placeholder.svg'} />

            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {getInitials(employee.fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-foreground font-medium">{employee.fullName}</p>
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />
              {employee.workHours.start} - {employee.workHours.end}
            </div>
          </div>
        </div>
      </td>
      {employee.days.map((day) => {
        return <ScheduleCell key={day.date} day={day} />;
      })}

      <td className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onNavigateSchedule(employee.employeeId)}>
              Xem ca làm việc
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCreateShift(employee.employeeId)}>
              Tạo ca làm việc
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onBulkCreateShift(employee.employeeId)}>
              Tạo ca theo tuần
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCreateShiftOverride(employee.employeeId)}>
              Điều chỉnh ca
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCreateBreakTemplate(employee.employeeId)}>
              Tạo thời gian nghỉ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
