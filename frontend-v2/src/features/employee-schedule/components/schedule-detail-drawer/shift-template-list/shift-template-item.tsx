import { format } from 'date-fns';
import { Ban, Edit2 } from 'lucide-react';
import { useState } from 'react';

import { ReplaceShiftTemplateForm } from '@/features/employee-schedule/components/schedule-detail-drawer/shift-template-list/replace-shift-template-form';
import { ShiftRow } from '@/features/employee-schedule/components/schedule-detail-drawer/shift-template-list/shift-row';
import { useReplaceShiftTemplateForm } from '@/features/employee-schedule/components/schedule-detail-drawer/shift-template-list/use-replace-shift-template-form';
import type { TReplaceShiftTemplatePayload } from '@/features/employee-schedule/schemas';
import type { TShiftTemplate } from '@/features/employee-schedule/types';
import { Button } from '@/shared/ui/button';

type ItemProps = {
  shift: TShiftTemplate;
  onDisable: (shiftId: string) => void;
  onReplace: ({
    shiftId,
    payload,
  }: {
    shiftId: string;
    payload: TReplaceShiftTemplatePayload;
  }) => void;
};

export function ShiftTemplateItem({ shift, onDisable, onReplace }: ItemProps) {
  const [expanded, setExpanded] = useState(false);

  const { form } = useReplaceShiftTemplateForm({
    initialValues: {
      startTime: shift.startTime,
      endTime: shift.endTime,
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    onReplace({
      shiftId: shift._id,
      payload: {
        startTime: values.startTime,
        endTime: values.endTime,
        effectiveFrom: format(values.effectiveFrom, 'yyyy-MM-dd'),
      },
    });
    setExpanded(false);
  });

  return (
    <div className="rounded-lg border border-gray-200">
      <div className="group flex items-center justify-between p-4 hover:bg-gray-50">
        <ShiftRow shift={shift} />

        <button className="rounded-lg p-2 hover:bg-gray-100" onClick={() => setExpanded((v) => !v)}>
          <Edit2 className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {expanded && (
        <div className="border-border space-y-3 border-t bg-gray-50 px-4 py-4">
          <ReplaceShiftTemplateForm form={form} />

          <div className="flex justify-between">
            {shift.isActive && (
              <Button
                variant="ghost"
                className="text-destructive hover:text-destructive cursor-pointer"
                onClick={() => onDisable(shift._id)}
              >
                <Ban className="h-4 w-4" />
                Tạm ngưng ca
              </Button>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setExpanded(false)}>
                Huỷ
              </Button>
              <Button onClick={handleSubmit}>Lưu</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
