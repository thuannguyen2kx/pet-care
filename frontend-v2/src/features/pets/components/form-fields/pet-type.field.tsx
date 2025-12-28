import { Controller, useFormContext } from 'react-hook-form';

import { PET_TYPE_CONFIG, PET_TYPES } from '@/features/pets/constants';
import type { TUpdatePetInfoInput } from '@/features/pets/schemas';
import { cn } from '@/shared/lib/utils';
import { Field, FieldError, FieldLabel, FieldLegend, FieldSet } from '@/shared/ui/field';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';

export function PetTypeField() {
  const { control } = useFormContext<TUpdatePetInfoInput>();

  return (
    <Controller
      control={control}
      name="type"
      render={({ field, fieldState }) => (
        <FieldSet data-invalid={fieldState.invalid}>
          <FieldLegend variant="label">Loại thú cưng</FieldLegend>

          <RadioGroup value={field.value} onValueChange={field.onChange} className="grid-cols-2">
            {PET_TYPES.map((petType) => {
              const { label, icon: Icon } = PET_TYPE_CONFIG[petType];
              const isSelected = field.value === petType;

              return (
                <FieldLabel key={petType} htmlFor={petType} className="border-border">
                  <Field data-invalid={fieldState.invalid} orientation="horizontal">
                    <RadioGroupItem id={petType} value={petType} className="sr-only" />

                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-full',
                        isSelected
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <span className="font-medium">{label}</span>
                  </Field>
                </FieldLabel>
              );
            })}
          </RadioGroup>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </FieldSet>
      )}
    />
  );
}
