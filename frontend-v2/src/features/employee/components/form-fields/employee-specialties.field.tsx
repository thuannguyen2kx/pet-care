import { Controller, useFormContext } from 'react-hook-form';

import { specialties, specialtiesList } from '@/features/employee/constants/specialties';
import type { TCreateEmployeeInput } from '@/features/employee/shemas';
import { Checkbox } from '@/shared/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/shared/ui/field';

export function EmployeeSpecialtiesField() {
  const form = useFormContext<TCreateEmployeeInput>();

  return (
    <Controller
      name="specialties"
      control={form.control}
      render={({ field, fieldState }) => (
        <FieldSet>
          <FieldLegend variant="label">Chuyên môn</FieldLegend>
          <FieldDescription>Những chuyên môn của nhân viên</FieldDescription>
          <FieldGroup data-slot="checkbox-group">
            {specialtiesList.map((specialty) => (
              <Field
                key={specialty.value}
                orientation="horizontal"
                data-invalid={fieldState.invalid}
              >
                <Checkbox
                  id={`${field.name}-${specialty.value}`}
                  name={field.name}
                  checked={field.value.includes(specialty.value)}
                  onCheckedChange={(checked) => {
                    const newValue = checked
                      ? [...field.value, specialty.value]
                      : field.value.filter((value) => value !== specialty.value);
                    field.onChange(newValue);
                  }}
                />
                <FieldLabel htmlFor={`${field.name}-${specialty.value}`}>
                  {specialty.label}
                </FieldLabel>
              </Field>
            ))}
          </FieldGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </FieldSet>
      )}
    />
  );
}
