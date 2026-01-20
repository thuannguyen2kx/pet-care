import { Controller, useFormContext } from 'react-hook-form';

import { PET_GENDER_CONFIG } from '@/features/pets/config';
import { Field, FieldError, FieldLabel, FieldLegend, FieldSet } from '@/shared/ui/field';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';

export function PetGenderField() {
  const { control } = useFormContext();
  return (
    <Controller
      name="gender"
      control={control}
      render={({ field, fieldState }) => (
        <FieldSet>
          <FieldLegend variant="label">Giới tính</FieldLegend>
          <RadioGroup value={field.value} onValueChange={field.onChange} className="grid-cols-2">
            {Object.entries(PET_GENDER_CONFIG).map(([gender, config]) => {
              return (
                <Field key={gender} data-invalid={fieldState.invalid} orientation="horizontal">
                  <RadioGroupItem id={gender} value={gender} aria-invalid={fieldState.invalid} />
                  <FieldLabel htmlFor={gender}>{config.label}</FieldLabel>
                </Field>
              );
            })}
          </RadioGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </FieldSet>
      )}
    />
  );
}
