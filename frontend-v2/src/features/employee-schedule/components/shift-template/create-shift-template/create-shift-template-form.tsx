import { Select } from '@radix-ui/react-select';
import { Controller, type UseFormReturn } from 'react-hook-form';

import type { CreateShiftTemplateInput } from '@/features/employee-schedule/schemas';
import { PickerWithInput } from '@/shared/components/picker-with-input';
import { Field, FieldError, FieldLabel, FieldLegend, FieldSet } from '@/shared/ui/field';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

type Props = {
  form: UseFormReturn<CreateShiftTemplateInput>;
};
const daysOfWeekFull = [
  {
    value: 0,
    label: 'Thứ 2',
  },
  {
    value: 1,
    label: 'Thứ 3',
  },
  {
    value: 2,
    label: 'Thứ 4',
  },
  {
    value: 3,
    label: 'Thứ 5',
  },
  {
    value: 4,
    label: 'Thứ 6',
  },
  {
    value: 5,
    label: 'Thứ 7',
  },
  {
    value: 6,
    label: 'Chủ nhật',
  },
];
const timeSlots = Array.from({ length: 13 }, (_, i) => `${(i + 7).toString().padStart(2, '0')}:00`);
export function CreateShiftTemplateForm({ form }: Props) {
  return (
    <form className="space-y-5">
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
              {daysOfWeekFull.map((d) => (
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
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
        <Controller
          name="startTime"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Giờ bắt đầu</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thời gian bắt đầu" />
                </SelectTrigger>
                <SelectContent className="border-border">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="endTime"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Giờ kết thúc</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thời gian bắt đầu" />
                </SelectTrigger>
                <SelectContent className="border-border">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
        <Controller
          name="effectiveFrom"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
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
        <Controller
          name="effectiveTo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Ngày kết thúc</FieldLabel>
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
    </form>
  );
}
