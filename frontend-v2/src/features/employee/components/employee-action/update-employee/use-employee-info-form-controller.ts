import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useUpdateEmployee } from '@/features/employee/api/update-employee';
import { updateEmployeeInputSchema, type TUpdateEmployeeInput } from '@/features/employee/shemas';
import { useConfirmDialog } from '@/shared/components/confirm';
import { removeUndefined } from '@/shared/lib/utils';

type Props = {
  employeeId: string;
  formValues: TUpdateEmployeeInput;
  onSuccess?: () => void;
};
type ExitReason = 'cancel' | 'navigate';

export const useEmployeeInfoFormController = ({ formValues, employeeId, onSuccess }: Props) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const form = useForm<TUpdateEmployeeInput>({
    defaultValues: formValues,
    resolver: zodResolver(updateEmployeeInputSchema),
  });
  const updateEmployee = useUpdateEmployee({
    mutationConfig: {
      onSuccess: () => {
        setMode('view');
        onSuccess?.();
      },
    },
  });
  const isDirty = form.formState.isDirty;

  const confirm = useConfirmDialog();
  const confirmExit = useExitConfirm(isDirty, confirm);

  const submit = form.handleSubmit((values) => {
    updateEmployee.mutate({
      employeeId,
      data: removeUndefined(values),
    });
  });

  const startEdit = () => setMode('edit');
  const cancelEdit = () => {
    form.reset(formValues);
    setMode('view');
  };

  const requestExit = async (reason: ExitReason) => {
    const ok = await confirmExit(reason);
    if (ok) cancelEdit();
    return ok;
  };

  return {
    form,
    mode,
    isEditing: mode === 'edit',
    startEdit,
    cancelEdit,
    submit,
    requestExit,
    isSubmitting: updateEmployee.isPending,
  };
};

const useExitConfirm = (isDirty: boolean, confirm: ReturnType<typeof useConfirmDialog>) => {
  return async (reason: ExitReason) => {
    if (!isDirty) return true;

    return confirm({
      title: 'Chưa lưu thay đổi',
      message:
        reason === 'cancel'
          ? 'Bạn có thay đổi chưa được lưu. Bạn có chắc muốn huỷ?'
          : 'Bạn có thay đổi chưa được lưu. Bạn có chắc muốn rời trang?',
      confirmText: 'Rời đi',
      cancelText: 'Tiếp tục chỉnh sửa',
    });
  };
};
