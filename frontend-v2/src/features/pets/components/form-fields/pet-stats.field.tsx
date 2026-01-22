import { Controller, useFormContext } from 'react-hook-form';

import type { UpdatePetInfo } from '@/features/pets/domain/pet.state';
import { Field, FieldError, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';

export function PetStatsField() {
  const { control } = useFormContext<UpdatePetInfo>();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Controller
        name="weight"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Cân nặng (kg)</FieldLabel>
            <Input
              id={field.name}
              type="number"
              {...field}
              step="0.1"
              placeholder="VD: 4.5"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="color"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Màu lông</FieldLabel>
            <Input
              id={field.name}
              {...field}
              placeholder="VD: Vàng gold, Xám xanh..."
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
}
