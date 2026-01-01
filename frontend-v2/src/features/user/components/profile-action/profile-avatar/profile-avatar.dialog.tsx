import { Camera } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { ProfileAvatarForm } from '@/features/user/components/profile-action/profile-avatar/profile-avatar.form';
import { useUpdateProfileAvatar } from '@/features/user/components/profile-action/profile-avatar/use-update-profile-avatar';
import { getInitials } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';

type Props = {
  avatarUrl?: string;
  fullName: string;
};
export function ProfileAvatarDialog({ avatarUrl, fullName }: Props) {
  const [open, setOpen] = useState(false);
  const { submit, form, isSubmitting, remove } = useUpdateProfileAvatar({
    onSuccess: () => {
      toast.success('Cập nhật ảnh thành công');
      setOpen(false);
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative mb-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl || '/placeholder.svg'} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="secondary"
            className="absolute right-0 bottom-0 h-8 w-8 rounded-full"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật ảnh đại diện</DialogTitle>
          <DialogDescription>Tải lên ảnh mới để hồ sơ trông chuyên nghiệp hơn.</DialogDescription>
        </DialogHeader>
        <ProfileAvatarForm initialUrl={avatarUrl} fullName={fullName} form={form} />
        <DialogFooter>
          {avatarUrl && (
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              onClick={remove}
              disabled={isSubmitting}
            >
              Xoá ảnh
            </Button>
          )}
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Huỷ
            </Button>
          </DialogClose>
          <Button onClick={submit} disabled={isSubmitting}>
            Cập nhật
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
