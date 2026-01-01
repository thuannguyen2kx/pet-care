import { CheckCircle2 } from 'lucide-react';
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

type Props = {
  disabled?: boolean;
};
export function EmployeeAcceptBookingField({ disabled }: Props) {
  const form = useFormContext();
  return (
    <FieldGroup>
      <Controller
        name="isAcceptingBookings"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field orientation="horizontal" data-invalid={fieldState.invalid}>
            <FieldContent>
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${field.value ? 'bg-success/10' : 'bg-muted'}`}>
                  <CheckCircle2
                    className={`h-5 w-5 ${field.value ? 'text-success' : 'text-muted-foreground'}`}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor={field.name}>Nhận lịch hẹn</FieldLabel>
                  <FieldDescription>
                    {field.value
                      ? 'Bạn đang nhận lịch hẹn từ khách hàng'
                      : 'Bạn đang tạm ngừng nhận lịch hẹn'}
                  </FieldDescription>
                </div>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldContent>
            <Switch
              id={field.name}
              name={field.name}
              disabled={disabled}
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
