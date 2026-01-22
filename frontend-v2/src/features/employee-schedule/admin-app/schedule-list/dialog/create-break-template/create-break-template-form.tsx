import { Controller, type UseFormReturn } from 'react-hook-form';

import type { CreateBreakTemplate } from '@/features/employee-schedule/domain/schedule.state';
import { PickerWithInput } from '@/shared/components/picker-with-input';
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
import { Input } from '@/shared/ui/input';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';

type Props = {
  form: UseFormReturn<CreateBreakTemplate>;
};

const daysOfWeek = [
  { value: 1, label: 'T2', fullLabel: 'Thứ 2' },
  { value: 2, label: 'T3', fullLabel: 'Thứ 3' },
  { value: 3, label: 'T4', fullLabel: 'Thứ 4' },
  { value: 4, label: 'T5', fullLabel: 'Thứ 5' },
  { value: 5, label: 'T6', fullLabel: 'Thứ 6' },
  { value: 6, label: 'T7', fullLabel: 'Thứ 7' },
  { value: 0, label: 'CN', fullLabel: 'Chủ nhật' },
];

export function CreateBreakTemplateForm({ form }: Props) {
  const breakType = form.watch('breakType');

  return (
    <form className="space-y-4">
      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Tên thời gian nghỉ</FieldLabel>
              <Input
                id={field.name}
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="VD: Nghỉ trưa, nghỉ giảo lao"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup>
        <Controller
          name="breakType"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldSet data-invalid={fieldState.invalid}>
              <FieldLegend>Áp dụng cho</FieldLegend>
              <RadioGroup
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                aria-invalid={fieldState.invalid}
              >
                <FieldLabel htmlFor={`${field.name}-WEEKLY`} className="border-border">
                  <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                    <RadioGroupItem
                      id={`${field.name}-WEEKLY`}
                      value="WEEKLY"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldContent>
                      <FieldTitle>Theo thứ trong tuần</FieldTitle>
                      <FieldDescription>
                        Cố định hàng tuần (VD: T2-T6, 12:00-13:00)
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor={`${field.name}-DATE`} className="border-border">
                  <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                    <RadioGroupItem
                      id={`${field.name}-DATE`}
                      value="DATE"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldContent>
                      <FieldTitle>Theo khoảng ngày</FieldTitle>
                      <FieldDescription>Tạm thời trong một khoảng thời gian</FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              </RadioGroup>
            </FieldSet>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <FieldSet>
          <FieldLegend variant="label">Thời gian nghỉ</FieldLegend>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="startTime"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Bắt đầu</FieldLabel>
                  <Input type="time" id={field.name} {...field} aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="endTime"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Bắt đầu</FieldLabel>
                  <Input type="time" id={field.name} {...field} aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </FieldSet>
      </FieldGroup>
      {breakType === 'WEEKLY' && (
        <FieldGroup>
          <Controller
            name="dayOfWeek"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet>
                <FieldLegend>Ngày làm việc</FieldLegend>
                <RadioGroup
                  name={field.name}
                  value={String(field.value)}
                  onValueChange={field.onChange}
                  className="grid-cols-4"
                >
                  {daysOfWeek.map((d) => (
                    <FieldLabel
                      key={d.value}
                      htmlFor={`${field.name}-${d.value}`}
                      className="border-border"
                    >
                      <Field className="justify-center">
                        <RadioGroupItem
                          hidden
                          id={`${field.name}-${d.value}`}
                          value={String(d.value)}
                          aria-invalid={fieldState.invalid}
                        />
                        <span className="text-center">{d.label}</span>
                      </Field>
                    </FieldLabel>
                  ))}
                </RadioGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldSet>
            )}
          />
        </FieldGroup>
      )}

      <FieldGroup>
        <FieldSet>
          <FieldLegend variant="label">
            {breakType === 'WEEKLY' ? 'Hiệu lục' : 'Thời gian áp dụng'}
          </FieldLegend>
          {breakType === 'WEEKLY' && (
            <Controller
              name="effectiveFrom"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Ngày bắt đầu</FieldLabel>
                  <PickerWithInput
                    value={field.value}
                    onChange={field.onChange}
                    disabledDate={(date) => date < new Date()}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          )}
          {breakType === 'DATE' && (
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="effectiveFrom"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Từ ngày</FieldLabel>
                    <PickerWithInput
                      value={field.value}
                      onChange={field.onChange}
                      disabledDate={(date) => date < new Date()}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="effectiveTo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Đến ngày</FieldLabel>
                    <PickerWithInput
                      value={field.value}
                      onChange={field.onChange}
                      disabledDate={(date) => date < new Date()}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          )}
        </FieldSet>
      </FieldGroup>
    </form>
  );
}
