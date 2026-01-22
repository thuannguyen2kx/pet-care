import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useRemoveAvatar } from '@/features/user/api/remove-avatar';
import { useUpdateAvatar } from '@/features/user/api/update-avatar';
import {
  UpdateProfileAvatarSchema,
  type UpdateProfileAvatar,
} from '@/features/user/domain/user.state';

type Props = {
  onSuccess: () => void;
};
export const useUpdateProfileAvatar = ({ onSuccess }: Props) => {
  const form = useForm<UpdateProfileAvatar>({
    resolver: zodResolver(UpdateProfileAvatarSchema),
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
