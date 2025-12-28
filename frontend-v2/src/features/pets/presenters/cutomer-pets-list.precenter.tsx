import { useGetUserPets } from '@/features/pets/api/get-user-pet';
import PetCardSkeleton from '@/features/pets/components/pet-list/pet-card-skeletion';
import { PetsListEmpty } from '@/features/pets/components/pet-list/pet-list-empty';
import { PetsListGrid } from '@/features/pets/components/pet-list/pet-list-grid';
import { PetListToolbar } from '@/features/pets/components/pet-list/pet-list-toolbar';
import { usePetsFilter } from '@/features/pets/components/pet-list/use-pets-filter';

export function CustomerPetsListPrecenter() {
  const petsQuery = useGetUserPets();

  const pets = petsQuery.data?.data;

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
