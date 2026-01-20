import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router';

import { useGetUserPets } from '@/features/pets/api/get-user-pet';
import { usePetsFilter } from '@/features/pets/customer-app/my-pets/application/use-pets-filter';
import { PetCard, PetCardSkeleton } from '@/features/pets/customer-app/my-pets/ui/pet-card';
import { PetListToolbar } from '@/features/pets/customer-app/my-pets/ui/pet-list-toolbar';
import type { Pet } from '@/features/pets/domain/pet.entity';
import { paths } from '@/shared/config/paths';
import { Card, CardContent } from '@/shared/ui/card';

export function MyPetsList() {
  const petsQuery = useGetUserPets();

  const pets = petsQuery.data;

  const { filterType, filteredPets, isEmpty, searchQuery, setFilterType, setSearchQuery } =
    usePetsFilter(pets || []);

  if (petsQuery.isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <PetCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      <PetListToolbar
        searchQuery={searchQuery}
        onSearchQuery={setSearchQuery}
        filterType={filterType}
        onFilterType={setFilterType}
      />
      {isEmpty ? <PetsListEmpty /> : <PetsListGrid pets={filteredPets} />}
    </>
  );
}

export function PetsListEmpty() {
  return (
    <Card className="rounded-none border-none p-4 shadow-none">
      <CardContent>
        <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Search className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="text-foreground text-lg font-medium">Không tìm thấy thú cưng</h3>
        <p className="text-muted-foreground mt-1">Thử tìm kiếm với từ khóa khác</p>
      </CardContent>
    </Card>
  );
}

export function PetsListGrid({ pets }: { pets: Pet[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} />
      ))}
      <Card className="hover:border-primary/50 hover:bg-muted/30 flex items-center justify-center rounded-none border-dashed p-4 shadow-none transition-colors">
        <Link
          to={paths.customer.petNew.path}
          className="flex flex-col items-center p-12 text-center"
        >
          <div className="bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Plus className="text-primary h-8 w-8" />
          </div>
          <h3 className="text-foreground font-medium">Thêm thú cưng mới</h3>
          <p className="text-muted-foreground mt-1 text-sm">Tạo hồ sơ cho thú cưng của bạn</p>
        </Link>
      </Card>
    </div>
  );
}
