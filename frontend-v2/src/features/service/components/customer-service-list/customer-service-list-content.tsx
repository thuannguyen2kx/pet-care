import { Filter } from 'lucide-react';

import { ServiceCard } from '@/features/service/components/customer-service-list/customer-service-card';
import type { TService } from '@/features/service/domain/service.entity';
import { EmptyState } from '@/shared/components/template/empty-state';
import { SectionSpinner } from '@/shared/components/template/loading';

export type ServiceListState =
  | { type: 'loading' }
  | { type: 'empty' }
  | { type: 'data'; services: TService[] };

type Props = {
  state: ServiceListState;
};
export const CustomerServiceListContent = ({ state }: Props) => {
  switch (state.type) {
    case 'loading':
      return <SectionSpinner />;
    case 'empty':
      return (
        <EmptyState
          title="Không tìm thấy dịch vụ"
          description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
          icon={Filter}
        />
      );
    case 'data':
      return <CustomerServiceList services={state.services} />;
  }
};

function CustomerServiceList({ services }: { services: TService[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {services.map((service) => (
        <ServiceCard key={service._id} service={service} />
      ))}
    </div>
  );
}
