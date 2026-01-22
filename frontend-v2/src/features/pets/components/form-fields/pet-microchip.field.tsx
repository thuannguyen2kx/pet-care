import { Controller, useFormContext } from 'react-hook-form';

import type { UpdatePetInfo } from '@/features/pets/domain/pet.state';
import { Field, FieldDescription, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';

export function PetMicrochipField() {
  const { control } = useFormContext<UpdatePetInfo>();

  return (
    <Controller
      name="microchipId"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>Mã microchip (tùy chọn)</FieldLabel>
          <Input
            id={field.name}
            {...field}
            placeholder="VD: VN-2024-001234"
            aria-invalid={fieldState.invalid}
          />
          <FieldDescription>Nếu thú cưng đã được gắn chip</FieldDescription>
        </Field>
      )}
    />
  );
}
