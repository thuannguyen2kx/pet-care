import { Controller, type UseFormReturn } from 'react-hook-form';

import type { CreateShiftOverrideInput } from '@/features/employee-schedule/schemas';
import { PickerWithInput } from '@/shared/components/picker-with-input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Switch } from '@/shared/ui/switch';
import { Textarea } from '@/shared/ui/textarea';

type Props = {
  form: UseFormReturn<CreateShiftOverrideInput>;
};
export const CreateShiftOverrideForm = ({ form }: Props) => {
  const watchIsWorking = form.watch('isWorking');
  return (
    <form className="space-y-4">
      <FieldGroup>
        <Controller
          control={form.control}
          name="date"
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
      </FieldGroup>
      <div className="bg-muted/30 flex items-center gap-4 rounded-xl p-4">
        <Controller
          name="isWorking"
          control={form.control}
          render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
        />
        <span
          className={`text-sm font-medium ${watchIsWorking ? 'text-green-600' : 'text-muted-foreground'}`}
        >
          {watchIsWorking ? 'Làm việc' : 'Nghỉ'}
        </span>
        {watchIsWorking && (
          <div className="ml-auto flex items-center gap-2">
            <Input type="time" {...form.register('startTime')} className="w-28" />
            <span className="text-muted-foreground">-</span>
            <Input type="time" {...form.register('endTime')} className="w-28" />
          </div>
        )}
        {form.formState.errors.startTime && <FieldError errors={[form.formState.errors.date]} />}
      </div>
      <FieldGroup>
        <Controller
          control={form.control}
          name="reason"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Lý do điều chỉnh</FieldLabel>
              <Textarea {...field} placeholder="Ví dụ: Nghỉ phép, tăng ca, sự kiện đặc biệt..." />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
};
