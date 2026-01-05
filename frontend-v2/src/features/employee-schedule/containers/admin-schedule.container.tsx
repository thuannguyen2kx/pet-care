import { useSearchParams } from 'react-router';
import { toast } from 'sonner';

import { useBulkCreateShifts } from '@/features/employee-schedule/api/bulk-create-shift';
import { useCreateBreakTemplate } from '@/features/employee-schedule/api/create-break-template';
import { useCreateShiftTemplate } from '@/features/employee-schedule/api/create-shift';
import { useCreateShiftOverride } from '@/features/employee-schedule/api/create-shift-override';
import { useTeamSchedule } from '@/features/employee-schedule/api/get-team-schedule';
import { useWeekNavigator } from '@/features/employee-schedule/components/employee-schedule/use-week-navigator';
import { AdminSchedulePrecenter } from '@/features/employee-schedule/precenters/admin-schedule-precenter';
import { getWeekRangeFromParam } from '@/features/employee-schedule/utils/get-week-range-from-param';

export default function AdminSchedulemutationConfigContainer() {
  const [searchParams] = useSearchParams();
  const { weekDates, navigateWeek } = useWeekNavigator();
  const weekParam = searchParams.get('week');
  const { startDate, endDate } = getWeekRangeFromParam(weekParam ?? undefined);
  const scheduleQuery = useTeamSchedule({
    startDate,
    endDate,
  });

  const createShiftTemplate = useCreateShiftTemplate({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Tạo ca làm việc thành công');
      },
    },
  });
  const bulkCreateShiftTemplate = useBulkCreateShifts({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Tạo ca làm việc thành công');
      },
    },
  });
  const createShiftOverride = useCreateShiftOverride({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Điều chỉnh ca làm việc thành công');
      },
    },
  });
  const createBreakTemplate = useCreateBreakTemplate({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Tạo thời gian nghỉ thành công');
      },
    },
  });

  const employeSchedules = scheduleQuery.data?.data.employees || [];

  return (
    <AdminSchedulePrecenter
      weekDates={weekDates}
      employees={employeSchedules}
      navigateWeek={navigateWeek}
      onCreateShiftTemplate={createShiftTemplate.mutate}
      onBulkCreateShiftTemplate={bulkCreateShiftTemplate.mutate}
      onCreateShiftOverride={createShiftOverride.mutate}
      onCreateBreakTemplate={createBreakTemplate.mutate}
    />
  );
}
