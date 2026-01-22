import { Controller, useFormContext } from 'react-hook-form';

import type { UpdatePetInfo } from '@/features/pets/domain/pet.state';
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/shared/ui/field';
import { Switch } from '@/shared/ui/switch';

export function PetNeuteredField() {
  const { control } = useFormContext<UpdatePetInfo>();
  return (
    <Controller
      name="isNeutered"
      control={control}
      render={({ field, fieldState }) => (
        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
          <FieldContent>
            <FieldLabel htmlFor={field.name}>Đã triệt sản</FieldLabel>
            <FieldDescription>Thú cưng đã được triệt sản chưa?</FieldDescription>
          </FieldContent>
          <Switch id={field.name} checked={field.value} onCheckedChange={field.onChange} />
        </Field>
      )}
    />
  );
}
