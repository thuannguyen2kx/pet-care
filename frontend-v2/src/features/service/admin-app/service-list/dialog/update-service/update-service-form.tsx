import { Controller, type UseFormReturn } from 'react-hook-form';

import { EMPLOYEE_SPECIALTIES_CONFIG } from '@/features/employee/config';
import { ServiceImageUploader } from '@/features/service/admin-app/service-list/ui/service-images-upload/service-image-uploader';
import { SERVICE_CATEGORY_CONFIG } from '@/features/service/config';
import type { UpdateService } from '@/features/service/domain/serivice.state';
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
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';

type Props = {
  form: UseFormReturn<UpdateService>;
};
export function UpdateServiceForm({ form }: Props) {
  return (
    <form className="space-y-4">
      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Tên dịch vụ</FieldLabel>
              <Input
                id={field.name}
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="VD: Tắm & Vệ sinh cơ bản"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup>
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Tên dịch vụ</FieldLabel>
              <Textarea
                id={field.name}
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="Mô tả chi tiết về dịch vụ..."
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="grid grid-cols-2 gap-4">
        <FieldGroup>
          <Controller
            control={form.control}
            name="category"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Danh mục</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>

                  <SelectContent align="end" popover="auto" className="border-border">
                    {Object.entries(SERVICE_CATEGORY_CONFIG).map(([category, config]) => (
                      <SelectItem key={category} value={category}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
        <FieldGroup>
          <Controller
            control={form.control}
            name="duration"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Thời lượng (phút)</FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  placeholder="60"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </div>
      <FieldGroup>
        <Controller
          control={form.control}
          name="price"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Giá (VND)</FieldLabel>
              <Input
                id={field.name}
                type="number"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                aria-invalid={fieldState.invalid}
                placeholder="200000"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup>
        <Controller
          control={form.control}
          name="requiredSpecialties"
          render={({ field, fieldState }) => (
            <FieldSet>
              <FieldLegend variant="label">Yêu cầu chuyên môn</FieldLegend>
              <FieldDescription>
                Những chuyên môn của nhân viên cần thực hiện dịch vụ này
              </FieldDescription>
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
                        field.value?.includes(specialty as keyof typeof EMPLOYEE_SPECIALTIES_CONFIG)
                          ? 'bg-primary! text-primary-foreground border-primary'
                          : 'hover:bg-muted/50'
                      } `}
                    >
                      <Checkbox
                        checked={field.value?.includes(
                          specialty as keyof typeof EMPLOYEE_SPECIALTIES_CONFIG,
                        )}
                        onCheckedChange={(checked) => {
                          const value = field.value ?? [];

                          const newValue = checked
                            ? [...value, specialty]
                            : value.filter((v) => v !== specialty);
                          field.onChange(newValue);
                        }}
                        className={
                          field.value?.includes(
                            specialty as keyof typeof EMPLOYEE_SPECIALTIES_CONFIG,
                          )
                            ? 'border-primary-foreground'
                            : ''
                        }
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
      </FieldGroup>

      <FieldGroup>
        <Controller
          control={form.control}
          name="images"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Ảnh dịch vụ</FieldLabel>
              <ServiceImageUploader
                value={field.value ?? { existing: [], added: [] }}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}
