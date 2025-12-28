import {
  PetBirthDateField,
  PetMicrochipField,
  PetNeuteredField,
  PetStatsField,
} from '@/features/pets/components/form-fields';

export function PetCreateDetailStep() {
  return (
    <div className="space-y-2">
      <PetBirthDateField />
      <PetStatsField />
      <PetMicrochipField />
      <PetNeuteredField />
    </div>
  );
}
