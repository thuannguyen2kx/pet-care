import { Controller, useFormContext } from 'react-hook-form';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';

export function EmployeeCommissionRateField() {
  const form = useFormContext();

  return (
    <FieldGroup>
      <Controller
        name="commissionRate"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Hoa hồng (%)</FieldLabel>
            <Input
              type="number"
              id={field.name}
              placeholder="10"
              aria-invalid={fieldState.invalid}
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
