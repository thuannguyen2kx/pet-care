import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { CATEGORY_ALL, CATEGORY_OPTIONS, type TCategoryFilter } from '@/features/service/constants';
import { mapQueryToSearchParams } from '@/features/service/mappers/map-query-to-search-params';
import type { TCustomerServiceFilter } from '@/features/service/schemas';
import { paths } from '@/shared/config/paths';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { Input } from '@/shared/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';

type Props = {
  filter: TCustomerServiceFilter;
};
export function CustomerServiceListToolbar({ filter }: Props) {
  const navigate = useNavigate();
  const [search, setSearch] = useState(filter?.search || '');
  const debounceSearch = useDebounce(search, 500);

  const handleChooseCategory = (value: TCategoryFilter) => {
    const nextFilter = {
      ...filter,
      category: value === CATEGORY_ALL ? undefined : value,
    };

    navigate({
      pathname: paths.customer.booking.path,
      search: mapQueryToSearchParams(nextFilter).toString(),
    });
  };

  useEffect(() => {
    const nextFilter = {
      ...filter,
      search: debounceSearch || undefined,
    };

    if (nextFilter.search !== filter?.search) {
      navigate({
        pathname: paths.customer.booking.path,
        search: mapQueryToSearchParams(nextFilter).toString(),
      });
    }
  }, [debounceSearch, filter, navigate]);
  return (
    <div className="sm:item-center mb-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
      <div className="relative max-w-md flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Tìm kiếm dịch vụ..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Tabs>
        <TabsList className="flex-wrap">
          <TabsTrigger value={CATEGORY_ALL} onClick={() => handleChooseCategory(CATEGORY_ALL)}>
            Tất cả
          </TabsTrigger>
          {CATEGORY_OPTIONS.map((cat) => (
            <TabsTrigger
              key={cat.value}
              value={cat.value}
              onClick={() => handleChooseCategory(cat.value)}
            >
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
