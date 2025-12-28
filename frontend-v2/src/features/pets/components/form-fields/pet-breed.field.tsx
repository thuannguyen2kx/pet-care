import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { CAT_BREEDS, DOG_BREEDS } from '@/features/pets/constants';
import type { TUpdatePetInfoInput } from '@/features/pets/schemas';
import { Field, FieldError, FieldLabel } from '@/shared/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

export function PetBreedField() {
  const { control, watch } = useFormContext<TUpdatePetInfoInput>();

  const watchType = watch('type');
  const breeds = useMemo(() => {
    return watchType === 'dog' ? DOG_BREEDS : CAT_BREEDS;
  }, [watchType]);

  return (
    <Controller
      name="breed"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Giống</FieldLabel>
          <Select name={field.name} value={field.value} onValueChange={field.onChange}>
            <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
              <SelectValue placeholder="Chọn giống thú cưng" />
            </SelectTrigger>
            <SelectContent position="item-aligned" className="border-border">
              {breeds.map((breed) => (
                <SelectItem key={breed} value={breed}>
                  {breed}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
