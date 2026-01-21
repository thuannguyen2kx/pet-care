import { EmployeeScheduleRow } from '@/features/employee-schedule/admin-app/schedule-list/ui/employee-schedule-row';
import { ScheduleGridHeader } from '@/features/employee-schedule/admin-app/schedule-list/ui/schedule-grid-header';
import type { EmployeeWeekSchedule } from '@/features/employee-schedule/domain/schedule.entity';
import { Card } from '@/shared/ui/card';

type Props = {
  weekDates: Date[];
  employees: EmployeeWeekSchedule[];
  onCreateShift: (employeeId: string) => void;
  onBulkCreateShift: (employeeId: string) => void;
  onCreateShiftOverride: (employeeId: string) => void;
  onCreateBreakTemplate: (employeeId: string) => void;
  onNavigateSchedule: (employeeId: string) => void;
  onViewEmployeeSchedule: (employeeId: string) => void;
};
export function ScheduleGrid({
  weekDates,
  employees,
  onCreateShift,
  onBulkCreateShift,
  onCreateShiftOverride,
  onCreateBreakTemplate,
  onViewEmployeeSchedule,
  onNavigateSchedule,
}: Props) {
  return (
    <Card className="overflow-hidden rounded-none border-none p-4 shadow-none">
      <div className="overflow-x-auto">
        <table className="w-full overflow-hidden">
          <ScheduleGridHeader weekDates={weekDates} />
          <tbody>
            {employees.map((employee) => (
              <EmployeeScheduleRow
                key={employee.employeeId}
                employee={employee}
                onCreateShift={onCreateShift}
                onBulkCreateShift={onBulkCreateShift}
                onCreateShiftOverride={onCreateShiftOverride}
                onCreateBreakTemplate={onCreateBreakTemplate}
                onViewEmployeeSchedule={onViewEmployeeSchedule}
                onNavigateSchedule={onNavigateSchedule}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
