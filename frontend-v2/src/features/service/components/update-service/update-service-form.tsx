import { Controller, type UseFormReturn } from 'react-hook-form';

import { specialtiesList } from '@/features/employee/constants';
import { ServiceImageUploader } from '@/features/service/components/service-images-upload/service-image-uploader';
import { CATEGORY_OPTIONS } from '@/features/service/constants';
import type { TUpdateServiceInput } from '@/features/service/schemas';
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
  form: UseFormReturn<TUpdateServiceInput>;
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
                    {CATEGORY_OPTIONS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
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
                {specialtiesList.map((specialty) => (
                  <Field
                    key={specialty.value}
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                    className="w-max"
                  >
                    <FieldLabel
                      className={`border-border flex cursor-pointer items-center gap-1.5 rounded-xl border px-4 py-2 transition-all ${
                        field.value?.includes(specialty.value)
                          ? 'bg-primary! text-primary-foreground border-primary'
                          : 'hover:bg-muted/50'
                      } `}
                    >
                      <Checkbox
                        checked={field.value?.includes(specialty.value)}
                        onCheckedChange={(checked) => {
                          const value = field.value ?? [];

                          const newValue = checked
                            ? [...value, specialty.value]
                            : value.filter((v) => v !== specialty.value);
                          field.onChange(newValue);
                        }}
                        className={
                          field.value?.includes(specialty.value) ? 'border-primary-foreground' : ''
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
