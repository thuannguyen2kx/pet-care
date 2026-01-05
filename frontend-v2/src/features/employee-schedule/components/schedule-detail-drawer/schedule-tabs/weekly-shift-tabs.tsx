import { ShiftTemplateList } from '../shift-template-list/shift-template-list';

import type { TReplaceShiftTemplatePayload } from '@/features/employee-schedule/schemas';
import type { TShiftTemplate } from '@/features/employee-schedule/types';

type Props = {
  shifts: TShiftTemplate[];
  onDiable: (shiftId: string) => void;
  onReplace: ({
    shiftId,
    payload,
  }: {
    shiftId: string;
    payload: TReplaceShiftTemplatePayload;
  }) => void;
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
