import { Controller, useFormContext } from 'react-hook-form';

import { specialtiesList } from '@/features/employee/constants/specialties';
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

type Props = {
  disabled?: boolean;
};
export function EmployeeSpecialtiesField({ disabled }: Props) {
  const form = useFormContext<TCreateEmployeeInput>();

  return (
    <Controller
      name="specialties"
      control={form.control}
      render={({ field, fieldState }) => (
        <FieldSet>
          <FieldLegend variant="label">Chuyên môn</FieldLegend>
          <FieldDescription>Những chuyên môn của nhân viên</FieldDescription>
          <div data-slot="checkbox-group" className="flex w-full flex-row flex-wrap gap-4">
            {specialtiesList.map((specialty) => (
              <Field
                key={specialty.value}
                orientation="horizontal"
                data-invalid={fieldState.invalid}
                className="w-max"
              >
                <FieldLabel
                  className={`border-border flex cursor-pointer items-center gap-1.5 rounded-xl border px-4 py-2 transition-all ${
                    field.value.includes(specialty.value)
                      ? 'bg-primary! text-primary-foreground border-primary'
                      : 'hover:bg-muted/50'
                  } ${!disabled && 'cursor-default'}`}
                >
                  <Checkbox
                    checked={field.value.includes(specialty.value)}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...field.value, specialty.value]
                        : field.value.filter((value) => value !== specialty.value);
                      field.onChange(newValue);
                    }}
                    disabled={disabled}
                    className={
                      field.value.includes(specialty.value) ? 'border-primary-foreground' : ''
                    }
                  />
                  <span className="text-sm font-medium">{specialty.value}</span>
                </FieldLabel>
              </Field>
            ))}
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </FieldSet>
      )}
    />
  );
}
