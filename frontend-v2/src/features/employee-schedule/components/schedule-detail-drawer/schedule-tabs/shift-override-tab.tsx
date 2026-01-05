import { ShiftOverrideList } from '../shift-override-list';

import type { TShiftOverride } from '@/features/employee-schedule/types';

type Props = {
  overrides: TShiftOverride[];
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
