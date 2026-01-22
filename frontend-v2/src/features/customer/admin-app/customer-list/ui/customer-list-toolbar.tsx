import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { MEMBER_SHIP_TIER } from '@/features/customer/domain/customer-entity';
import type { CustomersQuery } from '@/features/customer/domain/customer-state';
import { USER_STATUS } from '@/features/user/domain/user.entity';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

type Props = {
  filters: CustomersQuery;
  setFilters: (next: Partial<CustomersQuery>) => void;
};
const ALL_MEMBER_SHIP_TIER = 'ALL';
const ALL_USER_STATUS = 'ALL';
function mapAllToUndefined<T>(value: string): T | undefined {
  return value === 'ALL' ? undefined : (value as T);
}

export function CustomerListToolbar({ filters, setFilters }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const debounceSearch = useDebounce(search, 500);

  useEffect(() => {
    if (debounceSearch !== filters.search) {
      setFilters({ search: debounceSearch || undefined, page: 1 });
    }
  }, [filters.search, debounceSearch, setFilters]);

  return (
    <div className="mb-6 flex flex-col gap-4 p-2 sm:flex-row">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          value={search}
          placeholder="Tìm kiếm khách hàng..."
          className="pl-9"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Select
        value={filters.status || ALL_USER_STATUS}
        onValueChange={(value) => {
          setFilters({ status: mapAllToUndefined(value), page: 1 });
        }}
      >
        <SelectTrigger className="w-60">
          <SelectValue placeholder="Trạng thái hoạt động" />
        </SelectTrigger>

        <SelectContent align="end" className="border-border">
          <SelectItem value={ALL_USER_STATUS}>Tất cả</SelectItem>
          <SelectItem value={USER_STATUS.ACTIVE}>Đang hoạt động</SelectItem>
          <SelectItem value={USER_STATUS.INACTIVE}>Ngưng hoạt động</SelectItem>
          <SelectItem value={USER_STATUS.SUSPENDED}>Tạm khóa</SelectItem>
          <SelectItem value={USER_STATUS.DELETED}>Đã xoá</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.memberShipTier || ALL_MEMBER_SHIP_TIER}
        onValueChange={(value) => {
          setFilters({ memberShipTier: mapAllToUndefined(value), page: 1 });
        }}
      >
        <SelectTrigger className="w-60">
          <SelectValue placeholder="Hạng mức" />
        </SelectTrigger>

        <SelectContent align="end" className="border-border">
          <SelectItem value={ALL_MEMBER_SHIP_TIER}>Tất cả</SelectItem>
          <SelectItem value={MEMBER_SHIP_TIER.BRONZE}>Đồng</SelectItem>
          <SelectItem value={MEMBER_SHIP_TIER.SILVER}>Bạc</SelectItem>
          <SelectItem value={MEMBER_SHIP_TIER.GOLD}>Vàng</SelectItem>
          <SelectItem value={MEMBER_SHIP_TIER.PLATINUM}>Kim cương</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
