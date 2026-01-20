import {
  CustomerServiceListContent,
  type ServiceListState,
} from '@/features/service/customer-app/service-list/ui/customer-service-list-content';
import { CustomerServiceListPagination } from '@/features/service/customer-app/service-list/ui/customer-service-list-pagination';
import { CustomerServiceListToolbar } from '@/features/service/customer-app/service-list/ui/customer-service-toolbar';
import type { ServicesQuery } from '@/features/service/domain/serivice.state';
import type { Service } from '@/features/service/domain/service.entity';

type Props = {
  filter: ServicesQuery;
  isLoading: boolean;
  services: Service[];
  totalPages: number;
  setFilters: (next: Partial<ServicesQuery>) => void;
};
export function CustomerServiceView({
  isLoading,
  services,
  filter,
  totalPages,
  setFilters,
}: Props) {
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

        <CustomerServiceListToolbar filter={filter} setFilters={setFilters} />
        <CustomerServiceListContent state={listState} />
        <CustomerServiceListPagination filter={filter} totalPages={totalPages} />
      </div>
    </div>
  );
}
