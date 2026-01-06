import type { TServiceFilterForm } from '@/features/service/components/admin-service-list/service-filter-form.type';

export function mapSearchParamsToServiceFilter(searchParams: URLSearchParams): TServiceFilterForm {
  const form: TServiceFilterForm = {};

  // search
  const search = searchParams.get('search');
  if (search) {
    form.search = search;
  }

  // category
  const category = searchParams.get('category');
  if (category) {
    form.category = category;
  }

  // status (from isActive)
  const isActive = searchParams.get('isActive');
  if (isActive === 'true') form.status = 'active';
  else if (isActive === 'false') form.status = 'inactive';
  else form.status = 'all';

  // sort
  const sortBy = searchParams.get('sortBy');
  const sortOrder = searchParams.get('sortOrder');

  if (sortBy === 'price' && sortOrder === 'asc') {
    form.sort = 'price_asc';
  } else if (sortBy === 'price' && sortOrder === 'desc') {
    form.sort = 'price_desc';
  } else {
    form.sort = 'updated_desc';
  }

  // page
  const page = Number(searchParams.get('page'));
  form.page = Number.isNaN(page) || page <= 0 ? 1 : page;

  // limit
  const limit = Number(searchParams.get('limit'));
  form.limit = Number.isNaN(limit) || limit <= 0 ? 10 : limit;

  return form;
}
