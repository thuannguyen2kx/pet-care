import { Plus, Search } from 'lucide-react';

import type { TServiceFilterForm } from '@/features/service/components/admin-service-list/service-filter-form.type';
import {
  CATEGORY_ALL,
  CATEGORY_OPTIONS,
  SORT_OPTIONS,
  STATUS_ALL,
  STATUS_OPTIONS,
  type TCategoryFilter,
} from '@/features/service/constants';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

type Props = {
  filter: TServiceFilterForm;
  onFilter: (filter: TServiceFilterForm) => void;
  onCreate: () => void;
};
export function ServiceFilterToolbar({ filter, onFilter, onCreate }: Props) {
  const handleChooseCategory = (value: TCategoryFilter) => {
    onFilter({
      ...filter,
      category: value === CATEGORY_ALL ? undefined : value,
    });
  };
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          value={filter.search ?? ''}
          onChange={(e) => onFilter({ ...filter, search: e.target.value, page: 1 })}
          placeholder="Tìm kiếm dịch vụ..."
          className="pl-9"
        />
      </div>

      <Select
        value={filter.category ?? CATEGORY_ALL}
        onValueChange={(value) => handleChooseCategory(value as TCategoryFilter)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Theo danh mục" />
        </SelectTrigger>

        <SelectContent align="end" popover="auto" className="border-border">
          <SelectItem value={CATEGORY_ALL}>Tất cả danh mục</SelectItem>

          {CATEGORY_OPTIONS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filter.status ?? STATUS_ALL}
        onValueChange={(v) =>
          onFilter({
            ...filter,
            status: v as TServiceFilterForm['status'],
            page: 1,
          })
        }
      >
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent align="end" popover="auto" className="border-border">
          {STATUS_OPTIONS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filter.sort ?? 'updated_desc'}
        onValueChange={(v) =>
          onFilter({
            ...filter,
            sort: v as TServiceFilterForm['sort'],
            page: 1,
          })
        }
      >
        <SelectTrigger className="w-50">
          <SelectValue placeholder="Sắp xếp" />
        </SelectTrigger>
        <SelectContent align="end" popover="auto" className="border-border">
          {SORT_OPTIONS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={onCreate} className="cursor-pointer">
        <Plus className="size-4.5" />
        Thêm dịch vụ mới
      </Button>
    </div>
  );
}
