import { Controller, type UseFormReturn } from 'react-hook-form';

import type { TReplaceShiftTemplateInput } from '@/features/employee-schedule/schemas';
import { PickerWithInput } from '@/shared/components/picker-with-input';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';

type Props = {
  form: UseFormReturn<TReplaceShiftTemplateInput>;
};
export function ReplaceShiftTemplateForm({ form }: Props) {
  return (
    <form className="space-y-4">
      <FieldGroup>
        <FieldSet>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="startTime"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Bắt đầu</FieldLabel>
                  <Input type="time" id={field.name} {...field} aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="endTime"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Bắt đầu</FieldLabel>
                  <Input type="time" id={field.name} {...field} aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </FieldSet>
      </FieldGroup>
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
    </form>
  );
}
