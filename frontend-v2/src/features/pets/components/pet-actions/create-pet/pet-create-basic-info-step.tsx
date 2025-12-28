import {
  PetBreedField,
  PetGenderField,
  PetImageUploadField,
  PetNameField,
  PetTypeField,
} from '@/features/pets/components/form-fields';

export function PetCreateBasicInfoStep() {
  return (
    <div className="space-y-4">
      <PetImageUploadField />
      <PetNameField />
      <PetTypeField />
      <PetBreedField />
      <PetGenderField />
    </div>
  );
}
