import { Calendar } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/ui/field';
import { Switch } from '@/shared/ui/switch';
export function EmployeeVacationMode() {
  const form = useFormContext();

  return (
    <FieldGroup>
      <Controller
        name="vacationMode"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field orientation="horizontal" data-invalid={fieldState.invalid}>
            <FieldContent>
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${field.value ? 'bg-destructive/10' : 'bg-muted'}`}>
                  <Calendar
                    className={`h-5 w-5 ${field.value ? 'text-destructive' : 'text-muted-foreground'}`}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor={field.name}>Chế độ nghỉ phép</FieldLabel>
                  <FieldDescription>
                    {field.value
                      ? 'Nhân viên đang ở chế độ nghỉ phép'
                      : 'Cho phép nhân viên ở chế độ nghỉ phép'}
                  </FieldDescription>
                </div>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldContent>
            <Switch
              id={field.name}
              name={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-invalid={fieldState.invalid}
            />
          </Field>
        )}
      />
    </FieldGroup>
  );
}
