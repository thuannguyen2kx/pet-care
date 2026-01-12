import { Avatar } from '@radix-ui/react-avatar';
import { Check, PawPrint } from 'lucide-react';
import { Link } from 'react-router';

import { formatGender, formatPetType, formatWeight, getPetAge } from '@/features/pets/helpers';
import type { TPet } from '@/features/pets/types';
import { paths } from '@/shared/config/paths';
import { cn } from '@/shared/lib/utils';
import { AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';

type Props = {
  pets: TPet[];
  isLoading: boolean;
  selectedPetId: string | null;
  onSelectPet: (petId: string) => void;
};
export function SelectedPetStep({ pets, isLoading, selectedPetId, onSelectPet }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="mb-2 h-7 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <PetCardSkeleton key={index} />
          ))}
        </div>
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-foreground text-xl font-semibold">Chọn thú cưng</h2>
        <p className="text-muted-foreground mt-1 text-sm">Bé cưng nào sẽ được chăm sóc hôm nay?</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {pets.map((pet) => {
          const isSelected = selectedPetId === pet._id;

          return (
            <button
              key={pet._id}
              onClick={() => onSelectPet(pet._id)}
              className={cn(
                'group relative flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-300',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50',
              )}
            >
              <Avatar className="h-16 w-16">
                <AvatarImage src={pet.image?.url ?? undefined} />
                <AvatarFallback>{pet.name[0]}</AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-foreground font-semibold">{pet.name}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{formatPetType(pet.type)}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-border text-xs">
                    {getPetAge(pet.dateOfBirth)}
                  </Badge>
                  <Badge variant="outline" className="border-border text-xs">
                    {formatWeight(pet.weight.toString())}
                  </Badge>
                  <Badge variant="outline" className="border-border text-xs">
                    {formatGender(pet.gender)}
                  </Badge>
                </div>
              </div>

              {isSelected && (
                <div className="bg-primary text-primary-foreground absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      <Link
        to={paths.customer.petNew.path}
        className="border-border text-muted-foreground hover:border-primary hover:text-primary flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 transition-colors"
      >
        <PawPrint className="h-5 w-5" />
        <span>Thêm thú cưng mới</span>
      </Link>
    </div>
  );
}

function PetCardSkeleton() {
  return (
    <div className="border-border relative flex items-center gap-4 rounded-2xl border-2 p-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-16" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}
