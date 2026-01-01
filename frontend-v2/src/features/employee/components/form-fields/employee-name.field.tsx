import { Controller, useFormContext } from 'react-hook-form';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';

export function EmployeeNameField({ disabled }: { disabled?: boolean }) {
  const form = useFormContext();
  return (
    <FieldGroup>
      <Controller
        name="fullName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Họ và tên</FieldLabel>
            <Input
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Nguyễn Văn A"
              {...field}
              disabled={disabled}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
