import { AdminServiceDetailDrawer } from '@/features/service/components/admin-service-detail/admin-service-detail-drawer';
import { AdminServiceListPagination } from '@/features/service/components/admin-service-list/admin-service-list-pagination';
import {
  AdminServiceTableContent,
  type AdminServiceTableState,
} from '@/features/service/components/admin-service-list/admin-service-table-content';
import { ServiceFilterToolbar } from '@/features/service/components/admin-service-list/service-filter-toolbar';
import { CreateServiceDialog } from '@/features/service/components/create-service/create-service-dialog';
import { UpdateServiceDialog } from '@/features/service/components/update-service/update-service-dialog';
import type {
  CreateAction,
  RemoveAction,
  DetailAction,
  useAdminServiceController,
  ToggleStatusAction,
  UpdateAction,
} from '@/features/service/hooks/use-admin-service-controller';

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

export function AdminServicesPrecenter({ data, handlers, actions }: Props) {
  const { isLoading, services, filter, page, totalPages } = data;
  const { onFilterChange, onPageChange } = handlers;

  const { create, detail, remove, toggleStatus, update } = actions;

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
      <ServiceFilterToolbar filter={filter} onFilter={onFilterChange} onCreate={create.openModal} />
      <AdminServiceTableContent
        state={listState}
        onDetail={detail.openWithId}
        onRemove={remove.execute}
        onToggleStatus={toggleStatus.execute}
        onUpdate={update.openWithService}
      />
      <AdminServiceListPagination page={page} totalPages={totalPages} onChange={onPageChange} />
      <AdminServiceDetailDrawer
        open={actions.detail.open}
        onOpenChange={(open) => {
          if (!open) actions.detail.closeModal();
        }}
        service={detail.data}
        isLoading={detail.isLoading}
      />
      <CreateServiceDialog
        open={create.open}
        onOpenChange={(open: boolean) => {
          if (!open) create.closeModal();
        }}
        onSubmit={create.submit}
        isSubmitting={create.isSubmitting}
      />
      {update.service && (
        <UpdateServiceDialog
          open={update.open}
          onOpenChange={(open: boolean) => {
            if (!open) update.closeModal();
          }}
          onSubmit={update.submit}
          isSubmitting={update.isSubmitting}
          initialValue={update.service}
        />
      )}
    </>
  );
}
