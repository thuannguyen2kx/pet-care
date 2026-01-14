import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useCustomerProfile } from '@/features/customer/api/get-profile';
import { useUpdateCustomerProfile } from '@/features/customer/api/update-profile';
import { UpdateProfileSchema, type UpdateProfile } from '@/features/customer/domain/customer-state';

export const useUpdateCustomerProfileController = () => {
  const [isOpen, setIsOpen] = useState(false);

  const updateCustomerProfile = useUpdateCustomerProfile();
  const { data: customer, isLoading } = useCustomerProfile();

  const form = useForm<UpdateProfile>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      dateOfBirth: undefined,
      address: {
        province: '',
        ward: '',
      },
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    if (!customer) return;

    form.reset({
      fullName: customer.fullName,
      phoneNumber: customer.phoneNumber ?? '',
      dateOfBirth: customer.dateOfBirth ? new Date(customer.dateOfBirth) : null,
      address: customer.address ?? {
        province: '',
        ward: '',
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const openDialog = () => setIsOpen(true);

  const closeDialog = () => {
    setIsOpen(false);
    form.reset();
  };

  const submitForm = form.handleSubmit((values) => {
    updateCustomerProfile.mutate(values, {
      onSuccess: () => {
        toast.success('Cập nhật thông tin thành công');
        closeDialog();
      },
    });
  });

  return {
    isOpen,
    openDialog,
    closeDialog,

    form,
    submitForm,

    isLoading,
    isSubmitting: updateCustomerProfile.isPending,
  };
};
