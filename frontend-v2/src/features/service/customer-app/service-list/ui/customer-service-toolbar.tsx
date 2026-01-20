import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { SERVICE_CATEGORY_CONFIG } from '@/features/service/config/service-category.config';
import type { ServicesQuery } from '@/features/service/domain/serivice.state';
import type { TCustomerServiceFilter } from '@/features/service/schemas';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { Input } from '@/shared/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';

type Props = {
  filter: TCustomerServiceFilter;
  setFilters: (next: Partial<ServicesQuery>) => void;
};
const CATEGORY_ALL = 'ALL' as const;

export function CustomerServiceListToolbar({ filter, setFilters }: Props) {
  const [search, setSearch] = useState(filter?.search || '');
  const debounceSearch = useDebounce(search, 500);

  const handleChooseCategory = (value: ServicesQuery['category']) => {
    setFilters({ category: value === CATEGORY_ALL ? undefined : value });
  };

  useEffect(() => {
    if (debounceSearch !== filter?.search) {
      setFilters({
        search: debounceSearch || undefined,
      });
    }
  }, [debounceSearch, filter?.search, setFilters]);
  return (
    <div className="sm:item-center mb-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
      <div className="relative max-w-md flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Tìm kiếm dịch vụ..."
          className="pl-9 shadow-none focus-visible:ring-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Tabs>
        <TabsList className="flex-wrap">
          <TabsTrigger
            value={filter.category ?? CATEGORY_ALL}
            onClick={() => handleChooseCategory(CATEGORY_ALL)}
          >
            Tất cả
          </TabsTrigger>
          {Object.entries(SERVICE_CATEGORY_CONFIG).map(([category, config]) => (
            <TabsTrigger
              key={category}
              value={category}
              onClick={() => handleChooseCategory(category)}
            >
              {config.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
