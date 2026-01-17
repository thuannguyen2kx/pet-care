import { useCustomerListController } from '@/features/customer/admin-app/customer-list/application/use-customer-list-controller';
import { CustomerListView } from '@/features/customer/admin-app/customer-list/ui/customer-list-view';
import { AdminOverviewCustomerStats } from '@/features/customer/admin-app/widgets/overview-stats';

export default function AdminCustomerPage() {
  const customerListController = useCustomerListController();

  return (
    <>
      <AdminOverviewCustomerStats />
      <CustomerListView
        filters={customerListController.filter}
        setFilters={customerListController.setFilter}
        isLoading={customerListController.isLoading}
        customers={customerListController.data}
        page={customerListController.pagination?.page ?? 1}
        totalPages={customerListController.pagination?.totalPages ?? 1}
      />
    </>
  );
}
