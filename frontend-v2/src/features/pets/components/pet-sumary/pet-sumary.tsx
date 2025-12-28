import { Cake, Calendar, Cpu, Palette, Weight } from 'lucide-react';
import { Link } from 'react-router';

import { DeletePetButton } from '@/features/pets/components/pet-actions/delete-pet.button';
import { UpdatePetImageDialog } from '@/features/pets/components/pet-actions/update-pet-image';
import { UpdatePetInfoDialog } from '@/features/pets/components/pet-actions/update-pet-info';
import { PET_TYPE_CONFIG } from '@/features/pets/constants';
import { formatGender, getPetAge } from '@/features/pets/helpers';
import type { TPet } from '@/features/pets/types';
import { paths } from '@/shared/config/paths';
import { formatDateVN } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

type Props = {
  pet: TPet;
  onDelete: () => void;
};
export function PetSumary({ pet, onDelete }: Props) {
  const { label, icon: Icon } = PET_TYPE_CONFIG[pet.type];
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <img
          src={pet.image?.url || '/placeholder.svg'}
          alt={pet.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        <Badge className="absolute top-4 left-4 gap-1">
          <Icon className="h-3 w-3" />
          {label}
        </Badge>
        <div className="absolute right-4 bottom-4 left-4">
          <div className="flex justify-between">
            <div>
              <h1 className="h4-bold text-white">{pet.name}</h1>
              <p className="text-white/80">{pet.breed}</p>
            </div>
            <UpdatePetImageDialog petId={pet._id} petImage={pet.image?.url ?? undefined} />
          </div>
        </div>
      </div>

      <CardContent className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-xl p-3 text-center">
            <Cake className="text-primary mx-auto mb-1 size-5" />
            <p className="text-foreground text-sm font-medium">{getPetAge(pet.dateOfBirth)}</p>
            <p className="text-muted-foreground text-xs">Tuổi</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-3 text-center transition-colors">
            <Weight className="text-primary mx-auto mb-1 h-5 w-5" />
            <p className="text-foreground text-sm font-medium">{pet.weight} kg</p>
            <p className="text-muted-foreground text-xs">Cân nặng</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 gap-2" asChild>
            <Link to={paths.customer.booking.path}>
              <Calendar className="size-4" />
              Đặt lịch
            </Link>
          </Button>
          <UpdatePetInfoDialog key={pet._id} pet={pet} />
        </div>
        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-lg">
              <Cake className="text-muted-foreground size-4" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Ngày sinh</p>
              <p className="text-foreground text-sm font-medium">
                {formatDateVN(new Date(pet.dateOfBirth))}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-lg">
              <Palette className="text-muted-foreground size-4" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Màu lông</p>
              <p className="text-foreground text-sm font-medium">{pet.color}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-lg">
              <Icon className="text-muted-foreground size-4" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Giới tính</p>
              <p className="text-foreground text-sm font-medium">
                {formatGender(pet.gender)}
                {pet.isNeutered && ' (Đã triệt sản)'}
              </p>
            </div>
          </div>
          {pet.microchipId && (
            <div className="flex items-center gap-3">
              <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-lg">
                <Cpu className="text-muted-foreground h-4 w-4" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Mã Microchip</p>
                <p className="text-foreground text-sm font-medium">{pet.microchipId}</p>
              </div>
            </div>
          )}
        </div>
        <DeletePetButton onDelete={onDelete} />
      </CardContent>
    </Card>
  );
}
