import { Search } from 'lucide-react';

import { PET_TYPE_CONFIG, PET_TYPES } from '@/features/pets/constants';
import type { TFilterType } from '@/features/pets/hooks/use-pets-filter';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

type PetToolbarProps = {
  searchQuery: string;
  onSearchQuery: (query: string) => void;
  filterType: string;
  onFilterType: (type: TFilterType) => void;
};

export function PetListToolbar({
  searchQuery,
  onSearchQuery,
  filterType,
  onFilterType,
}: PetToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Tìm kiếm theo tên hoặc giống..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => onSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant={filterType === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterType('all')}
          className={filterType !== 'all' ? 'bg-transparent' : ''}
        >
          Tất cả
        </Button>
        {PET_TYPES.map((type) => {
          const { label, icon: Icon } = PET_TYPE_CONFIG[type];

          return (
            <Button
              key={type}
              variant={filterType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterType(type)}
              className={filterType !== type ? 'bg-transparent' : ''}
            >
              <Icon className="mr-1 h-4 w-4" />
              {label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
