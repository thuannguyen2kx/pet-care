import { Controller, type UseFormReturn } from 'react-hook-form';

import { getStatusConfig } from '@/features/booking/config/booking-status.config';
import type { BookingStatus } from '@/features/booking/domain/booking.entity';
import type { UpdateBookingStatus } from '@/features/booking/domain/booking.state';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/shared/ui/field';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import { Textarea } from '@/shared/ui/textarea';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<UpdateBookingStatus>;
  allowedStatuses: BookingStatus[];
  onSubmit: () => void;
  isSubmitting: boolean;
};
export function EmployeeUpdateBookingStatusDialog({
  open,
  onOpenChange,
  form,
  allowedStatuses,
  onSubmit,
  isSubmitting,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái đặt lịch</DialogTitle>
          <DialogDescription>Chọn trạng thái mới cho đặt lịch này.</DialogDescription>
        </DialogHeader>

        <UpdateBookingStatusForm form={form} allowedStatuses={allowedStatuses} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={isSubmitting}>
              Huỷ
            </Button>
          </DialogClose>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            Cập nhật trạng thái
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function UpdateBookingStatusForm({
  form,
  allowedStatuses,
}: {
  form: UseFormReturn<UpdateBookingStatus>;
  allowedStatuses: BookingStatus[];
}) {
  return (
    <form className="space-y-4">
      <FieldGroup>
        <Controller
          control={form.control}
          name="status"
          render={({ field, fieldState }) => (
            <FieldSet>
              <FieldLegend>Trạng thái</FieldLegend>
              <RadioGroup name={field.name} value={field.value} onValueChange={field.onChange}>
                {allowedStatuses.map((status) => {
                  const statusConfig = getStatusConfig(status);
                  return (
                    <FieldLabel
                      key={status}
                      htmlFor={`${field.name}-${status}`}
                      className={cn('border-border', statusConfig.className)}
                    >
                      <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                        <FieldContent>
                          <FieldTitle>{statusConfig.label}</FieldTitle>
                          <FieldDescription>{statusConfig.description}</FieldDescription>
                        </FieldContent>
                        <RadioGroupItem
                          value={status}
                          id={`${field.name}-${status}`}
                          aria-invalid={fieldState.invalid}
                        />
                      </Field>
                    </FieldLabel>
                  );
                })}
              </RadioGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldSet>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          control={form.control}
          name="reason"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Lý do</FieldLabel>
              <Textarea
                id={field.name}
                aria-invalid={fieldState.invalid}
                {...field}
                placeholder="Nhập lý do"
                rows={4}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          control={form.control}
          name="employeeNotes"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Ghi chú</FieldLabel>
              <Textarea
                id={field.name}
                aria-invalid={fieldState.invalid}
                {...field}
                placeholder="Ghi chú"
                rows={4}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}
