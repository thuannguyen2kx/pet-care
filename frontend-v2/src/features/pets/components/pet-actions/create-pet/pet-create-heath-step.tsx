import { PetAllergyField } from '@/features/pets/components/form-fields';
import { PetMedicalNotesField } from '@/features/pets/components/form-fields/pet-medical-notes.field';
import { CreatePetSummary } from '@/features/pets/components/pet-actions/create-pet/create-pet-sumary';

export function PetCreateHeathStep() {
  return (
    <div className="space-y-4">
      <PetAllergyField />
      <PetMedicalNotesField />
      <CreatePetSummary />
    </div>
  );
}
