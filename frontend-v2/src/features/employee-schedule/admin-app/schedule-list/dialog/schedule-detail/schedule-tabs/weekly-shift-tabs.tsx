import { ShiftTemplateList } from '../shift-template-list/shift-template-list';

import type { ShiftTemplate } from '@/features/employee-schedule/domain/schedule.entity';
import type {
  DisableShiftTemplate,
  ReplaceShiftTemplate,
} from '@/features/employee-schedule/domain/schedule.state';

type Props = {
  shifts: ShiftTemplate[];
  onDiable: (payload: DisableShiftTemplate) => void;
  onReplace: (payload: ReplaceShiftTemplate) => void;
};

export function WeeklyShiftTab({ shifts, onDiable, onReplace }: Props) {
  if (!shifts.length) {
    return (
      <div className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
        Chưa có lịch làm việc tuần
      </div>
    );
  }

  return <ShiftTemplateList shifts={shifts} onDisable={onDiable} onReplace={onReplace} />;
}
