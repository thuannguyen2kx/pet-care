import { useSearchParams } from 'react-router';

import { useGetServices } from '@/features/service/api/get-services';
import { CustomerServiceView } from '@/features/service/precenters/customer-service-precenter';
import { customerFilterServiceSchema } from '@/features/service/schemas';

export default function CustomerServiceContainer() {
  const [params] = useSearchParams();
  const filter = customerFilterServiceSchema.parse(Object.fromEntries(params));

  const serviceQuery = useGetServices({
    filter,
  });

  console.log(filter);
  return (
    <CustomerServiceView
      isLoading={serviceQuery.isLoading}
      services={serviceQuery.data?.data.services ?? []}
      filter={filter}
      totalPages={serviceQuery.data?.data.pagination.totalPages ?? 1}
    />
  );
}
