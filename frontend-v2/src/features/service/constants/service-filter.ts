export const STATUS_ALL = 'all' as const;
export const STATUS_OPTIONS = [
  { value: STATUS_ALL, label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'inactive', label: 'Ngưng hoạt động' },
] as const;

export const SORT_OPTIONS = [
  { value: 'updated_desc', label: 'Mới cập nhật' },
  { value: 'price_asc', label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
] as const;
