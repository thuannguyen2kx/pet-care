import type { TServiceQueryPayload } from '@/features/service/api/types';
import type { TServiceFilterForm } from '@/features/service/components/admin-service-list/service-filter-form.type';

export function mapServiceFilterToQuery(form: TServiceFilterForm): TServiceQueryPayload {
  const payload: TServiceQueryPayload = {};

  if (form.search?.trim()) {
    payload.search = form.search.trim();
  }

  if (form.category) {
    payload.category = form.category;
  }

  // status → isActive
  if (form.status === 'active') payload.isActive = true;
  if (form.status === 'inactive') payload.isActive = false;
  // all → undefined (don't send)

  // sort mapping
  switch (form.sort) {
    case 'price_asc':
      payload.sortBy = 'price';
      payload.sortOrder = 'asc';
      break;
    case 'price_desc':
      payload.sortBy = 'price';
      payload.sortOrder = 'desc';
      break;
    default:
      payload.sortBy = 'updatedAt';
      payload.sortOrder = 'desc';
  }

  payload.page = form.page ?? 1;
  payload.limit = form.limit ?? 10;

  return payload;
}
