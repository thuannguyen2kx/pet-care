import { Controller, type UseFormReturn } from 'react-hook-form';

import type { TDayOfWeek } from '@/features/employee-schedule/domain/schedule.type';
import type { BulkCreateShiftsInput } from '@/features/employee-schedule/schemas';
import { PickerWithInput } from '@/shared/components/picker-with-input';
import { Field, FieldError, FieldLabel, FieldLegend, FieldSet } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Switch } from '@/shared/ui/switch';

type Props = {
  form: UseFormReturn<BulkCreateShiftsInput>;
};
const dayLabels = {
  0: 'Thứ hai',
  1: 'Thứ ba',
  2: 'Thứ tư',
  3: 'Thứ năm',
  4: 'Thứ sáu',
  5: 'Thứ bảy',
  6: 'Chủ nhật',
};
export function BulkCreateShiftTemplateForm({ form }: Props) {
  const watchShifts = form.watch('days');
  return (
    <form className="space-y-4">
      <FieldSet>
        <FieldLegend>Lịch làm việc hàng tuần</FieldLegend>
        <div className="space-y-2">
          {Object.keys(watchShifts).map((dayString) => {
            const day = Number(dayString) as TDayOfWeek;
            return (
              <div key={day} className="bg-muted/30 flex items-center gap-4 rounded-xl p-4">
                <div className="w-24 font-medium">{dayLabels[day]}</div>
                <Controller
                  name={`days.${day}.isWorking`}
                  control={form.control}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
                <span
                  className={`text-sm ${watchShifts[day].isWorking ? 'text-success' : 'text-muted-foreground'}`}
                >
                  {watchShifts[day].isWorking ? 'Làm việc' : 'Nghỉ'}
                </span>
                {watchShifts[day].isWorking && (
                  <div className="ml-auto flex items-center gap-2">
                    <Input
                      type="time"
                      {...form.register(`days.${day}.startTime`)}
                      className="w-28"
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input type="time" {...form.register(`days.${day}.endTime`)} className="w-28" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {form.formState.errors.days && <FieldError errors={[form.formState.errors.days]} />}
      </FieldSet>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
        <Controller
          name="effectiveFrom"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Ngày bắt đầu</FieldLabel>
              <PickerWithInput
                value={field.value}
                onChange={field.onChange}
                disabledDate={(date) => date < new Date()}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="effectiveTo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Ngày kết thúc</FieldLabel>
              <PickerWithInput
                value={field.value}
                onChange={field.onChange}
                disabledDate={(date) => date < new Date()}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </form>
  );
}
