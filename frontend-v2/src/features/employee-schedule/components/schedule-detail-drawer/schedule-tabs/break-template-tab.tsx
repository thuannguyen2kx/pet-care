import { BreakTemplateList } from '../break-template-list';

import type { TBreakTemplate } from '@/features/employee-schedule/types';

type Props = {
  breaks: TBreakTemplate[];
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
