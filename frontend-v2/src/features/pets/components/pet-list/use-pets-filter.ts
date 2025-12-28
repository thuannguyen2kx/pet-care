import { useMemo, useState } from 'react';

import type { TPetType } from '@/features/pets/constants';
import type { TPet } from '@/shared/types/pet';

export type TFilterType = 'all' | TPetType;

export function usePetsFilter<T extends TPet>(pets: T[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<TFilterType>('all');

  const filteredPets = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return pets.filter((pet) => {
      const matchesSearch =
        pet.name.toLowerCase().includes(normalizedSearch) ||
        pet.breed.toLowerCase().includes(normalizedSearch);

      const matchesType = filterType === 'all' || pet.type === filterType;

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
    hasFilter: searchQuery.length > 0 || filterType !== 'all',
  };
}
