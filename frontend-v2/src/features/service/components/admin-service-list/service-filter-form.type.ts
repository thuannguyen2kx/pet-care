export type TServiceFilterForm = {
  search?: string;
  category?: string;
  status?: 'all' | 'active' | 'inactive';
  sort?: 'updated_desc' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
};
