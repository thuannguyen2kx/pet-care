import { useMemo, useState } from 'react';

import type { Pet, PetType } from '@/features/pets/domain/pet.entity';

export const ALL_PET_TYPE = 'all' as const;
export type PetFilterType = typeof ALL_PET_TYPE | PetType;

export function usePetsFilter<T extends Pet>(pets: T[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<PetFilterType>(ALL_PET_TYPE);

  const filteredPets = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return pets.filter((pet) => {
      const matchesSearch =
        pet.name.toLowerCase().includes(normalizedSearch) ||
        pet.breed.toLowerCase().includes(normalizedSearch);

      const matchesType = filterType === ALL_PET_TYPE || pet.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [pets, searchQuery, filterType]);

  return {
    searchQuery,
    filterType,

    setSearchQuery,
    setFilterType,

    filteredPets,

    isEmpty: filteredPets.length === 0,
    hasFilter: searchQuery.length > 0 || filterType !== ALL_PET_TYPE,
  };
}
