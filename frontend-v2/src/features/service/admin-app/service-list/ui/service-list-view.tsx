import type {
  CreateAction,
  DetailAction,
  RemoveAction,
  ToggleStatusAction,
  UpdateAction,
  useAdminServiceController,
} from '@/features/service/admin-app/service-list/application/use-admin-service-controller';
import { AdminServiceListPagination } from '@/features/service/admin-app/service-list/ui/admin-service-list-pagination';
import {
  AdminServiceTableContent,
  type AdminServiceTableState,
} from '@/features/service/admin-app/service-list/ui/admin-service-table-content';
import { ServiceFilterToolbar } from '@/features/service/admin-app/service-list/ui/service-filter-toolbar';

type Props = {
  data: ReturnType<typeof useAdminServiceController>['data'];
  handlers: ReturnType<typeof useAdminServiceController>['handlers'];
  actions: {
    create: CreateAction;
    detail: DetailAction;
    remove: RemoveAction;
    toggleStatus: ToggleStatusAction;
    update: UpdateAction;
  };
};

export function AdminServiceListView({ data, handlers, actions }: Props) {
  const { isLoading, services, filter, page, totalPages } = data;
  const { onFilterChange } = handlers;

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
  const { create, detail, remove, toggleStatus, update } = actions;
  return (
    <>
      <ServiceFilterToolbar filter={filter} onFilter={onFilterChange} onCreate={create.openModal} />
      <AdminServiceTableContent
        state={listState}
        onDetail={detail.openWithId}
        onRemove={remove.execute}
        onToggleStatus={toggleStatus.execute}
        onUpdate={update.openWithService}
      />
      <AdminServiceListPagination
        page={page}
        totalPages={totalPages}
        onChange={(page) => onFilterChange({ page })}
      />
    </>
  );
}
