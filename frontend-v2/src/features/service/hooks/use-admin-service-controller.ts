import { useState } from 'react';
import { toast } from 'sonner';

import { useCreateService } from '@/features/service/api/create-service';
import { useDeleteService } from '@/features/service/api/delete-service';
import { useGetService } from '@/features/service/api/get-service';
import { useToggleServiceStatus } from '@/features/service/api/toggle-service-status';
import { useUpdateService } from '@/features/service/api/update-service';
import type { TService } from '@/features/service/domain/service.entity';
import { useServiceListController } from '@/features/service/hooks/use-service-list-controller';
import { useConfirmDialog } from '@/shared/components/confirm';

export type CreateAction = {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
  submit: (payload: FormData) => void;
  isSubmitting: boolean;
};
export type DetailAction = {
  open: boolean;
  openWithId: (id: string) => void;
  closeModal: () => void;

  data?: TService;
  isLoading: boolean;
};
export type UpdateAction = {
  open: boolean;
  service: TService;
  openWithService: (service: TService) => void;
  closeModal: () => void;
  submit: (formData: FormData) => void;
  isSubmitting: boolean;
};
export type ToggleStatusAction = {
  execute: (serviceId: string, status: boolean) => void;
};
export type RemoveAction = {
  execute: (serviceId: string) => void;
};

export function useAdminServiceController() {
  const list = useServiceListController();
  // CREATE
  const [openCreate, setOpenCreate] = useState(false);

  const createService = useCreateService({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Tạo dịch vụ thành công');
        setOpenCreate(false);
        list.refetch();
      },
    },
  });
  const createAction = {
    open: openCreate,
    openModal: () => setOpenCreate(true),
    closeModal: () => setOpenCreate(false),
    submit: createService.mutate,
    isSubmitting: createService.isPending,
  };

  // DETAIL
  const [detailId, setDetailId] = useState<string | null>(null);
  const openDetail = Boolean(detailId);

  const serviceDetailQuery = useGetService({
    serviceId: detailId!,
    queryConfig: { enabled: openDetail },
  });
  const detailAction = {
    open: openDetail,
    openWithId: (id: string) => setDetailId(id),
    closeModal: () => setDetailId(null),

    data: serviceDetailQuery?.data?.data.service,
    isLoading: serviceDetailQuery?.isLoading,
  };

  // UPDATE
  const [serviceToUpdate, setServiceToUpdate] = useState<TService | null>(null);
  const openUpdate = Boolean(serviceToUpdate);

  const updateService = useUpdateService({
    mutationConfig: {
      onSuccess: () => {
        {
          toast.success('Đã cập nhật dịch vụ');
          setServiceToUpdate(null);
        }
      },
    },
  });
  const handleUpdate = (formData: FormData) => {
    if (!serviceToUpdate) return;

    updateService.mutate({
      serviceId: serviceToUpdate._id,
      formData,
    });
  };

  const updateAction = {
    open: openUpdate,
    service: serviceToUpdate,
    openWithService: (service: TService) => setServiceToUpdate(service),
    closeModal: () => setServiceToUpdate(null),
    submit: handleUpdate,
    isSubmitting: updateService.isPending,
  };

  //  TOGGLE STATUS
  const confirmToggleServiceStatus = useConfirmDialog();
  const toggleServiceStatus = useToggleServiceStatus();
  const handleToggleServiceStatus = async (serviceId: string, status: boolean) => {
    const ok = await confirmToggleServiceStatus({
      title: 'Xác nhận thành công',
      message: `Bạn cô muốn ${status ? 'ngưng dịch vụ' : 'kích hoạt dịch vụ'}`,
    });
    if (!ok) return;
    toggleServiceStatus.mutate(serviceId, {
      onSuccess: () => {
        toast.success(`Đã ${status ? 'ngưng dịch vụ' : 'kích hoạt dịch vụ'}`);
      },
    });
  };
  const toggleStatusAction = {
    execute: handleToggleServiceStatus,
  };
  // DELETE
  const confirmDelete = useConfirmDialog();

  const removeService = useDeleteService();
  const handleDelete = async (serviceId: string) => {
    const ok = await confirmDelete({
      title: 'Xác nhận xoá dịch vụ',
      message: 'Dịch vụ không thể khôi phục lại sau khi xoá. Bạn có muốn tiếp tục',
      confirmText: 'Xoá dịch vụ',
    });
    if (!ok) return;
    removeService.mutate(serviceId, {
      onSuccess: () => {
        toast.success('Đã xoá dịch vụ thành công');
      },
    });
  };
  const removeAction = {
    execute: handleDelete,
  };
  return {
    data: {
      services: list.services,
      isLoading: list.isLoading,
      filter: list.filter,
      page: list.pagination?.currentPage ?? 1,
      totalPages: list.pagination?.totalPages ?? 1,
    },

    handlers: {
      onFilterChange: list.setFilter,
      onPageChange: list.setPage,
    },
    actions: {
      create: createAction,
      detail: detailAction,
      remove: removeAction,
      toggleStatus: toggleStatusAction,
      update: updateAction,
    },
  };
}
