import { AlertCircle, FileText, Weight } from 'lucide-react';

import { UpdatePetAllergyDialog } from '@/features/pets/customer-app/pet-detail/dialog/update-pet-allergy';
import { UpdatePetMedicalNotesDialog } from '@/features/pets/customer-app/pet-detail/dialog/update-pet-medical-notes';
import type { Pet } from '@/features/pets/domain/pet.entity';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export function PetHealthTab({ pet }: { pet: Pet }) {
  return (
    <>
      <Card className="rounded-none border-none p-4 shadow-none">
        <CardHeader className="flex flex-row justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertCircle className="text-destructive size-5" />
            Dị ứng
          </CardTitle>
          <UpdatePetAllergyDialog petId={pet.id} allergies={pet.allergies} />
        </CardHeader>
        <CardContent>
          {pet.allergies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {pet.allergies.map((allergy, index) => (
                <Badge
                  key={index}
                  variant="destructive"
                  className="bg-destructive/10 text-destructive"
                >
                  {allergy}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Chưa ghi nhận dị ứng nào</p>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-none border-none p-4 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="text-primary h-5 w-5" />
            Ghi chú sức khỏe
          </CardTitle>
          <UpdatePetMedicalNotesDialog petId={pet.id} medicalNotes={pet.medicalNotes} />
        </CardHeader>
        <CardContent>
          <p className="text-foreground text-sm">
            {pet.medicalNotes || 'Chưa có ghi chú sức khỏe'}
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-none border-none p-4 shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Weight className="text-primary h-5 w-5" />
            Theo dõi cân nặng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 flex h-40 items-center justify-center">
            <p className="text-muted-foreground text-sm">
              Biểu đồ cân nặng sẽ hiển thị ở đây (Coming soon)
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
