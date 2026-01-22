import { ShiftOverrideList } from '../shift-override-list';

import type { ShiftOverride } from '@/features/employee-schedule/domain/schedule.entity';

type Props = {
  overrides: ShiftOverride[];
};

export function ShiftOverrideTab({ overrides }: Props) {
  if (!overrides.length) {
    return (
      <div className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
        Không có lịch ngoại lệ
      </div>
    );
  }

  return <ShiftOverrideList shiftOverrides={overrides} />;
}
