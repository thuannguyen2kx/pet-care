import { XIcon } from 'lucide-react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import type { UpdatePetAllergies } from '@/features/pets/domain/pet.state';
import { Button } from '@/shared/ui/button';
import { Field, FieldContent, FieldError, FieldGroup, FieldSet } from '@/shared/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/shared/ui/input-group';

export function PetAllergyField() {
  const { control, formState } = useFormContext<UpdatePetAllergies>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'allergies',
  });
  return (
    <FieldSet className="gap-4">
      <FieldGroup className="gap-4">
        {fields.map((field, index) => (
          <Controller
            key={field.id}
            name={`allergies.${index}.value`}
            control={control}
            render={({ field: controllerField, fieldState }) => (
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <InputGroup>
                    <InputGroupInput
                      {...controllerField}
                      id={`allergies.${index}.value`}
                      placeholder="Nhập dị ứng của thú cưng"
                    />

                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => remove(index)}
                        aria-label={`Remove allergy ${index + 1}`}
                      >
                        <XIcon />
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            )}
          />
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => append({ value: '' })}>
          Thêm dị ứng
        </Button>
      </FieldGroup>
      {formState.errors.allergies?.root && (
        <FieldError errors={[formState.errors.allergies.root]} />
      )}
    </FieldSet>
  );
}
