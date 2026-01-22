import { Controller, useFormContext } from 'react-hook-form';

import { EMPLOYEE_SPECIALTIES_CONFIG } from '@/features/employee/config';
import type { CreateEmployee } from '@/features/employee/domain/employee-state';
import { Checkbox } from '@/shared/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/shared/ui/field';

type Props = {
  disabled?: boolean;
};
export function EmployeeSpecialtiesField({ disabled }: Props) {
  const form = useFormContext<CreateEmployee>();

  return (
    <Controller
      name="specialties"
      control={form.control}
      render={({ field, fieldState }) => (
        <FieldSet>
          <FieldLegend variant="label">Chuyên môn</FieldLegend>
          <FieldDescription>Những chuyên môn của nhân viên</FieldDescription>
          <div data-slot="checkbox-group" className="flex w-full flex-row flex-wrap gap-4">
            {Object.entries(EMPLOYEE_SPECIALTIES_CONFIG).map(([specialty, config]) => (
              <Field
                key={specialty}
                orientation="horizontal"
                data-invalid={fieldState.invalid}
                className="w-max"
              >
                <FieldLabel
                  className={`border-border flex cursor-pointer items-center gap-1.5 rounded-xl border px-4 py-2 transition-all ${
                    field.value.includes(specialty)
                      ? 'bg-primary! text-primary-foreground border-primary'
                      : 'hover:bg-muted/50'
                  } ${!disabled && 'cursor-default'}`}
                >
                  <Checkbox
                    checked={field.value.includes(specialty)}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...field.value, specialty]
                        : field.value.filter((value) => value !== specialty);
                      field.onChange(newValue);
                    }}
                    disabled={disabled}
                    className={field.value.includes(specialty) ? 'border-primary-foreground' : ''}
                  />
                  <span className="text-sm font-medium">{config.label}</span>
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
