import { Link } from 'react-router';

import { formatPetType, getPetTypeConfig } from '@/features/pets/config';
import type { Pet } from '@/features/pets/domain/pet.entity';
import { paths } from '@/shared/config/paths';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';

export function PetCard({ pet }: { pet: Pet }) {
  const PetIcon = getPetTypeConfig(pet.type).icon;

  return (
    <Link
      to={paths.customer.petDetail.getHref(pet.id)}
      key={pet.id}
      className="group hover:border-primary/50 overflow-hidden transition-all"
    >
      {/* Pet Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={pet.image || '/placeholder.svg'}
          alt={pet.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        {/* Pet Type Badge */}
        <Badge className="absolute top-3 left-3 gap-1">
          <PetIcon className="h-3 w-3" />
          {formatPetType(pet.type)}
        </Badge>

        {/* Pet Name Overlay */}
        <div className="absolute right-0 bottom-0 left-0 p-4">
          <h3 className="text-primary-foreground text-xl font-bold">{pet.name}</h3>
          <p className="text-primary-foreground/80 text-sm">{pet.breed}</p>
        </div>
      </div>
    </Link>
  );
}
export function PetCardSkeleton() {
  return (
    <div className="group overflow-hidden rounded-2xl border">
      <div className="relative aspect-square overflow-hidden">
        <Skeleton className="h-full w-full" />

        <div className="absolute top-3 left-3">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <div className="absolute right-0 bottom-0 left-0 space-y-2 p-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}
