import { Link } from 'react-router';

import { PET_TYPE_CONFIG } from '@/features/pets/constants';
import { formatPetType } from '@/features/pets/helpers';
import type { TPet } from '@/features/pets/types';
import { paths } from '@/shared/config/paths';
import { Badge } from '@/shared/ui/badge';

export function PetCard({ pet }: { pet: TPet }) {
  const PetIcon = PET_TYPE_CONFIG[pet.type].icon;

  return (
    <Link
      to={paths.customer.petDetail.getHref(pet._id)}
      key={pet._id}
      className="group hover:border-primary/50 overflow-hidden rounded-2xl transition-all hover:shadow-lg"
    >
      {/* Pet Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={pet.image?.url || '/placeholder.svg'}
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
          <h3 className="text-xl font-bold text-white">{pet.name}</h3>
          <p className="text-sm text-white/80">{pet.breed}</p>
        </div>
      </div>
    </Link>
  );
}
