import { useState } from 'react';
import { toast } from 'sonner';

import { useCreateService } from '@/features/service/api/create-service';
import { useServiceListController } from '@/features/service/hooks/use-service-list-controller';

export type CreateAction = {
  open: boolean;
  setOpen: (open: boolean) => void;
  isLoading: boolean;
  submit: (form: FormData) => void;
};
export function useAdminServiceController() {
  const list = useServiceListController();
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

  return {
    list,
    actions: {
      create: {
        open: openCreate,
        setOpen: setOpenCreate,
        submit: createService.mutate,
        isLoading: createService.isPending,
      },
    },
  };
}
