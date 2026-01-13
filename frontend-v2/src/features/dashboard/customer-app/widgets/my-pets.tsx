import { ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router';

import { useGetUserPets } from '@/features/pets/api/get-user-pet';
import { PET_TYPE_CONFIG } from '@/features/pets/constants';
import { getPetAge } from '@/features/pets/helpers';
import type { TPet } from '@/features/pets/types';
import { paths } from '@/shared/config/paths';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

type Props = {
  pets?: TPet[];
};
export function MyPetsWidget({ pets }: Props) {
  const petsQuery = useGetUserPets({
    queryConfig: {
      enabled: !pets,
    },
  });

  if (petsQuery.isLoading) {
    return <MyPetsSkeleton />;
  }
  const petsData = pets || petsQuery.data?.data || [];

  return (
    <Card className="rounded-none border-none p-6 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Thú cưng của tôi</CardTitle>
        <Link to={paths.customer.pets.path}>
          <Button variant="ghost" size="sm" className="text-primary gap-1">
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {petsData.map((pet) => {
          const petTypeConfig = PET_TYPE_CONFIG[pet.type];
          return (
            <Link
              key={pet._id}
              to={paths.customer.petDetail.getHref(pet._id)}
              className="border-border hover:border-primary/50 hover:bg-muted/50 flex items-center gap-3 rounded-xl border p-3 transition-all"
            >
              <img
                src={pet?.image?.url || '/placeholder.svg'}
                alt={pet.name}
                className="h-14 w-14 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-foreground font-medium">{pet.name}</p>
                  <Badge variant="secondary" className="h-5 gap-1 px-1.5 text-xs">
                    <petTypeConfig.icon className="h-3 w-3" />
                    {petTypeConfig.label}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                  {pet.breed} • {getPetAge(pet.dateOfBirth)}
                </p>
              </div>
            </Link>
          );
        })}

        <Button variant="outline" className="w-full gap-2 bg-transparent" asChild>
          <Link to={paths.customer.petNew.path}>
            <Plus className="h-4 w-4" />
            Thêm thú cưng
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
function MyPetsSkeleton() {
  return (
    <Card className="rounded-none border-none p-6 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Thú cưng của tôi</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary gap-1" disabled>
          Xem tất cả
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="border-border flex items-center gap-3 rounded-xl border p-3">
            <Skeleton className="h-14 w-14 shrink-0 rounded-full" />

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}

        <Skeleton className="h-10 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}
