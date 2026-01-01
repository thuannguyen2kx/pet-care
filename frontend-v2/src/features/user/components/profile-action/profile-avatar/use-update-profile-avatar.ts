import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useRemoveAvatar } from '@/features/user/api/remove-avatar';
import { useUpdateAvatar } from '@/features/user/api/update-avatar';
import { updateProfileAvatar, type TUpdateProfileAvatar } from '@/features/user/schemas';

type Props = {
  onSuccess: () => void;
};
export const useUpdateProfileAvatar = ({ onSuccess }: Props) => {
  const form = useForm<TUpdateProfileAvatar>({
    resolver: zodResolver(updateProfileAvatar),
    defaultValues: {
      profilePicture: undefined,
    },
  });

  const updateAvatar = useUpdateAvatar({
    mutaionConfig: {
      onSuccess: () => {
        form.reset();
        onSuccess();
      },
    },
  });
  const removeAvatar = useRemoveAvatar();

  const submit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append('profilePicture', data.profilePicture);

    updateAvatar.mutate(formData);
  });

  const remove = () => {
    removeAvatar.mutate();
  };

  return {
    submit,
    isSubmitting: updateAvatar.isPending,
    form,
    remove,
  };
};
