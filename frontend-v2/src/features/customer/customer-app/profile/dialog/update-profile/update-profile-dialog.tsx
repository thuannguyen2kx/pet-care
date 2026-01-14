import { Controller, type UseFormReturn } from 'react-hook-form';

import type { UpdateProfile } from '@/features/customer/domain/customer-state';
import { PickerWithInput } from '@/shared/components/picker-with-input';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  form: UseFormReturn<UpdateProfile>;
  isSubmitting: boolean;
};
export function UpdateCustomerProfileDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  isSubmitting,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin</DialogTitle>
          <DialogDescription>Cập nhật thông tin cá nhân của bạn</DialogDescription>
        </DialogHeader>
        <UpdateCustomerProfileForm form={form} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={isSubmitting}>
              Huỷ
            </Button>
          </DialogClose>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            Lưu thông tin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UpdateCustomerProfileForm({ form }: { form: UseFormReturn<UpdateProfile> }) {
  return (
    <form className="space-y-4">
      <FieldGroup>
        <Controller
          control={form.control}
          name="fullName"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Họ và tên</FieldLabel>
              <Input id={field.name} {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          control={form.control}
          name="phoneNumber"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Số điện thoại</FieldLabel>
              <Input id={field.name} {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          control={form.control}
          name="dateOfBirth"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Ngày sinh</FieldLabel>
              <PickerWithInput
                value={field.value ?? undefined}
                onChange={field.onChange}
                disabledDate={(date) => date > new Date()}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldSet>
        <FieldLegend>Địa chỉ</FieldLegend>
      </FieldSet>
      <FieldContent>
        <Controller
          control={form.control}
          name="address.province"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Tỉnh/Thành phố</FieldLabel>
              <Input value={field.value} onChange={field.onChange} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="address.ward"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Phường/Xã</FieldLabel>
              <Input value={field.value} onChange={field.onChange} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldContent>
      <FieldGroup></FieldGroup>
    </form>
  );
}
