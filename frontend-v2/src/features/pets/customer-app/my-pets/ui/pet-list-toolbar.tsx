import { Search } from 'lucide-react';

import { PET_TYPE_CONFIG } from '@/features/pets/config';
import {
  ALL_PET_TYPE,
  type PetFilterType,
} from '@/features/pets/customer-app/my-pets/application/use-pets-filter';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

type PetToolbarProps = {
  searchQuery: string;
  onSearchQuery: (query: string) => void;
  filterType: string;
  onFilterType: (type: PetFilterType) => void;
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
          className="pl-10 shadow-none focus-visible:ring-0"
          value={searchQuery}
          onChange={(e) => onSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant={filterType === ALL_PET_TYPE ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterType(ALL_PET_TYPE)}
          className={filterType !== ALL_PET_TYPE ? 'bg-transparent' : ''}
        >
          Tất cả
        </Button>
        {Object.entries(PET_TYPE_CONFIG).map(([type, config]) => {
          return (
            <Button
              key={type}
              variant={filterType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterType(type as PetFilterType)}
              className={filterType !== type ? 'bg-transparent' : ''}
            >
              <config.icon className="mr-1 h-4 w-4" />
              {config.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
