import { ShiftTemplateItem } from '@/features/employee-schedule/components/schedule-detail-drawer/shift-template-list/shift-template-item';
import type { TReplaceShiftTemplatePayload } from '@/features/employee-schedule/schemas';
import type { TShiftTemplate } from '@/features/employee-schedule/types';

type Props = {
  shifts: TShiftTemplate[];
  onDisable: (shiftId: string) => void;
  onReplace: ({
    shiftId,
    payload,
  }: {
    shiftId: string;
    payload: TReplaceShiftTemplatePayload;
  }) => void;
};
const DAY_LABELS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

export function ShiftTemplateList({ shifts, onDisable, onReplace }: Props) {
  const shiftsByDay = shifts.reduce<Record<number, TShiftTemplate[]>>((acc, shift) => {
    if (!acc[shift.dayOfWeek]) acc[shift.dayOfWeek] = [];
    acc[shift.dayOfWeek].push(shift);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {DAY_LABELS.map((label, dayOfWeek) => {
        const dayShifts = shiftsByDay[dayOfWeek] ?? [];

        if (dayShifts.length === 0) return null;

        return (
          <section key={dayOfWeek} className="space-y-2">
            {/* Section header */}
            <div className="flex items-center justify-between">
              <h6 className="text-muted-foreground text-sm font-semibold">{label}</h6>
              <span className="text-muted-foreground text-xs">{dayShifts.length} ca</span>
            </div>

            {/* Shift items */}
            <div className="space-y-2">
              {dayShifts.map((shift) => (
                <ShiftTemplateItem
                  key={shift._id}
                  shift={shift}
                  onDisable={onDisable}
                  onReplace={onReplace}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
