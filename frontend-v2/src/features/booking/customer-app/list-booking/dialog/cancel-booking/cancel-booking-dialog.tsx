import { Controller, type UseFormReturn } from 'react-hook-form';

import type { CancelBooking } from '@/features/booking/domain/booking.state';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Textarea } from '@/shared/ui/textarea';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<CancelBooking>;
  onSubmit: () => void;
  isSubmitting: boolean;
};
export function CancelBookingDialog({ open, onOpenChange, form, onSubmit, isSubmitting }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Huỷ lịch đặt</DialogTitle>
          <DialogDescription>
            Vui lòng cho chúng tôi biết lý do bạn muốn huỷ lịch.
          </DialogDescription>
        </DialogHeader>

        <CancelBookingForm form={form} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Huỷ
            </Button>
          </DialogClose>
          <Button variant="destructive" disabled={isSubmitting} onClick={onSubmit}>
            Xác nhận huỷ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CancelBookingForm({ form }: { form: UseFormReturn<CancelBooking> }) {
  return (
    <FieldGroup>
      <Controller
        control={form.control}
        name="reason"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Lý do huỷ đặt lịch</FieldLabel>
            <Textarea
              id={field.name}
              aria-invalid={fieldState.invalid}
              {...field}
              placeholder="Nhập lý do huỷ lịch"
              rows={4}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
