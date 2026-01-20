import { Link } from 'react-router';

import { formatPetType } from '@/features/pets/config';
import type { Pet } from '@/features/pets/domain/pet.entity';
import { getPetAge } from '@/features/pets/domain/pet.helper';
import { paths } from '@/shared/config/paths';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

type Props = { pets: Pet[] };
export function CustomerPetsTab({ pets }: Props) {
  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Bạn có <span className="text-foreground font-medium">{pets.length}</span> thú cưng
        </p>
        <Button size="sm" asChild>
          <Link to={paths.customer.petNew.path}>Thêm thú cưng</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {pets.map((pet) => {
          return (
            <Link to={paths.customer.petDetail.getHref(pet.id)} key={pet.id}>
              <Card className="hover:border-primary/50 overflow-hidden rounded-none border border-transparent shadow-none transition-all">
                <div className="flex items-center gap-4 p-4">
                  <img
                    src={pet.image || '/placeholder.svg'}
                    alt={pet.name}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-foreground font-semibold">{pet.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {formatPetType(pet.type)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">{pet.breed}</p>
                    <p className="text-muted-foreground text-sm">{getPetAge(pet.dateOfBirth)}</p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}
