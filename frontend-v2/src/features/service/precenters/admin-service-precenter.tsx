import { AdminServiceListPagination } from '@/features/service/components/admin-service-list/admin-service-list-pagination';
import {
  AdminServiceTableContent,
  type AdminServiceTableState,
} from '@/features/service/components/admin-service-list/admin-service-table-content';
import { ServiceFilterToolbar } from '@/features/service/components/admin-service-list/service-filter-toolbar';
import { CreateServiceDialog } from '@/features/service/components/create-service/create-service-dialog';
import type { CreateAction } from '@/features/service/hooks/use-admin-service-controller';
import type { useServiceListController } from '@/features/service/hooks/use-service-list-controller';

type Props = {
  list: ReturnType<typeof useServiceListController>;
  actions: {
    create: CreateAction;
  };
};

export function AdminServicesPrecenter({ list, actions }: Props) {
  const {
    isLoading,
    services,
    filter,
    pagination,
    setFilter: onFilter,
    setPage: onPageChange,
  } = list;
  const listState: AdminServiceTableState = (() => {
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
    <>
      <ServiceFilterToolbar
        filter={filter}
        onFilter={onFilter}
        onCreate={() => actions.create.setOpen(true)}
      />
      <AdminServiceTableContent state={listState} />
      <AdminServiceListPagination
        page={pagination?.currentPage ?? 1}
        totalPages={pagination?.totalPages ?? 1}
        onChange={onPageChange}
      />
      <CreateServiceDialog
        open={actions.create.open}
        onOpenChange={actions.create.setOpen}
        onSubmit={actions.create.submit}
        isSubmitting={actions.create.isLoading}
      />
    </>
  );
}
