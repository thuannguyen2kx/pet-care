import { Controller, useFormContext } from 'react-hook-form';

import { PET_TYPE_CONFIG } from '@/features/pets/config';
import { cn } from '@/shared/lib/utils';
import { Field, FieldError, FieldLabel, FieldLegend, FieldSet } from '@/shared/ui/field';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';

export function PetTypeField() {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="type"
      render={({ field, fieldState }) => (
        <FieldSet data-invalid={fieldState.invalid}>
          <FieldLegend variant="label">Loại thú cưng</FieldLegend>

          <RadioGroup value={field.value} onValueChange={field.onChange} className="grid-cols-2">
            {Object.entries(PET_TYPE_CONFIG).map(([petType, config]) => {
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
                      <config.icon className="h-6 w-6" />
                    </div>

                    <span className="font-medium">{config.label}</span>
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
