import { useServiceListController } from '@/features/service/customer-app/service-list/application/use-service-list-filter';
import { CustomerServiceView } from '@/features/service/customer-app/service-list/ui/service-list-view';

export default function ServiceListPage() {
  const servicesController = useServiceListController();

  return (
    <CustomerServiceView
      isLoading={servicesController.isLoading}
      services={servicesController.data}
      filter={servicesController.filter}
      totalPages={servicesController.pagination?.totalPages ?? 1}
      setFilters={servicesController.setFilter}
    />
  );
}
