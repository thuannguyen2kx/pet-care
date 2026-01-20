import { useAdminServiceController } from '@/features/service/admin-app/service-list/application/use-admin-service-controller';
import { CreateServiceDialog } from '@/features/service/admin-app/service-list/dialog/create-service/create-service-dialog';
import { AdminServiceDetailDrawer } from '@/features/service/admin-app/service-list/dialog/service-detail/admin-service-detail-drawer';
import { UpdateServiceDialog } from '@/features/service/admin-app/service-list/dialog/update-service/update-service-dialog';
import { AdminServiceListView } from '@/features/service/admin-app/service-list/ui/service-list-view';

export default function AdminServiceList() {
  const controller = useAdminServiceController();

  const { actions } = controller;
  const { create, detail, update } = actions;

  return (
    <>
      <AdminServiceListView
        data={controller.data}
        handlers={controller.handlers}
        actions={controller.actions}
      />
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
