import { Controller, useFormContext } from 'react-hook-form';

import { PET_GENDER_CONFIG, PET_GENDERS } from '@/features/pets/constants';
import type { TUpdatePetInfoInput } from '@/features/pets/schemas';
import { Field, FieldError, FieldLabel, FieldLegend, FieldSet } from '@/shared/ui/field';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';

export function PetGenderField() {
  const { control } = useFormContext<TUpdatePetInfoInput>();
  return (
    <Controller
      name="gender"
      control={control}
      render={({ field, fieldState }) => (
        <FieldSet>
          <FieldLegend variant="label">Giới tính</FieldLegend>
          <RadioGroup value={field.value} onValueChange={field.onChange} className="grid-cols-2">
            {PET_GENDERS.map((gender) => {
              const { label } = PET_GENDER_CONFIG[gender];
              return (
                <Field key={gender} data-invalid={fieldState.invalid} orientation="horizontal">
                  <RadioGroupItem id={gender} value={gender} aria-invalid={fieldState.invalid} />
                  <FieldLabel htmlFor={gender}>{label}</FieldLabel>
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
