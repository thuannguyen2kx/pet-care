import {
  CustomerServiceListContent,
  type ServiceListState,
} from '@/features/service/components/customer-service-list/customer-service-list-content';
import { CustomerServiceListPagination } from '@/features/service/components/customer-service-list/customer-service-list-pagination';
import { CustomerServiceListToolbar } from '@/features/service/components/customer-service-list/customer-service-toolbar';
import type { TService } from '@/features/service/domain/service.entity';
import type { TCustomerServiceFilter } from '@/features/service/schemas';

type Props = {
  filter: TCustomerServiceFilter;
  isLoading: boolean;
  services: TService[];
  totalPages: number;
};
export function CustomerServiceView({ isLoading, services, filter, totalPages }: Props) {
  const listState: ServiceListState = (() => {
    if (isLoading) {
      return { type: 'loading' };
    }
    if (services.length === 0) {
      return { type: 'empty' };
    }
    return {
      type: 'data',
      services,
    };
  })();

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-foreground text-3xl font-bold">Dịch vụ của chúng tôi</h1>
          <p className="text-muted-foreground mt-2">
            Khám phá các dịch vụ chăm sóc thú cưng chuyên nghiệp và tận tâm
          </p>
        </div>

        <CustomerServiceListToolbar filter={filter} />
        <CustomerServiceListContent state={listState} />
        <CustomerServiceListPagination filter={filter} totalPages={totalPages} />
      </div>
    </div>
  );
}
