import { BreakTemplateList } from '../break-template-list';

import type { BreakTemplate } from '@/features/employee-schedule/domain/schedule.entity';

type Props = {
  breaks: BreakTemplate[];
};

export function BreakTemplateTab({ breaks }: Props) {
  if (!breaks.length) {
    return (
      <div className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
        Chưa có thời gian nghỉ
      </div>
    );
  }

  return <BreakTemplateList breaks={breaks} />;
}
