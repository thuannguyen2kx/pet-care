import { Controller, type UseFormReturn } from 'react-hook-form';

import { ProfileAvatarUpload } from '@/features/user/components/profile-avatar/profile-avatar-upload';
import type { UpdateProfileAvatar } from '@/features/user/domain/user.state';
import { Field, FieldError } from '@/shared/ui/field';

type Props = {
  initialUrl?: string;
  fullName: string;
  form: UseFormReturn<UpdateProfileAvatar>;
};
export function ProfileAvatarForm({ initialUrl, fullName, form }: Props) {
  return (
    <form>
      <Controller
        name="profilePicture"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <ProfileAvatarUpload
              initialUrl={initialUrl}
              fullName={fullName}
              value={field.value}
              onChange={field.onChange}
            />
            {fieldState.error && <FieldError className="text-center" errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </form>
  );
}
