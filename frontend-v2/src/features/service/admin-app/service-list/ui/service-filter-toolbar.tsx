import { Plus, Search } from 'lucide-react';

import { SERVICE_CATEGORY_CONFIG } from '@/features/service/config';
import type { ServicesQuery } from '@/features/service/domain/serivice.state';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

type Props = {
  filter: ServicesQuery;
  onFilter: (next: Partial<ServicesQuery>) => void;
  onCreate: () => void;
};
const CATEGORY_ALL = 'all';
const STATUS_ALL = 'all' as const;
const STATUS_OPTIONS = [
  { value: STATUS_ALL, label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'inactive', label: 'Ngưng hoạt động' },
] as const;

const SORT_OPTIONS = [
  { value: 'updated_desc', label: 'Mới cập nhật' },
  { value: 'price_asc', label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
] as const;

export function ServiceFilterToolbar({ filter, onFilter, onCreate }: Props) {
  const handleChooseCategory = (value: ServicesQuery['category']) => {
    onFilter({
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
        onValueChange={(value) => handleChooseCategory(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Theo danh mục" />
        </SelectTrigger>

        <SelectContent align="end" popover="auto" className="border-border">
          <SelectItem value={CATEGORY_ALL}>Tất cả danh mục</SelectItem>

          {Object.entries(SERVICE_CATEGORY_CONFIG).map(([category, config]) => (
            <SelectItem key={category} value={category}>
              {config.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filter.status ?? STATUS_ALL}
        onValueChange={(v) =>
          onFilter({
            status: v as ServicesQuery['status'],
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
            sort: v as ServicesQuery['sort'],
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
