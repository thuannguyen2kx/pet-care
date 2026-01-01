import { ImageIcon, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

import { useAvatarUpload } from '@/features/user/components/profile-action/profile-avatar/use-avatar-upload';
import { getInitials } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

type Props = {
  initialUrl?: string;
  fullName: string;
  value?: File;
  onChange: (file?: File) => void;
};
export function ProfileAvatarUpload({ initialUrl, fullName, value, onChange }: Props) {
  const { previewUrl, handleDrop } = useAvatarUpload(initialUrl, value);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: (files) => handleDrop(files, onChange),
    multiple: false,
    noClick: true,
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg'],
    },
  });

  return (
    <div className="flex justify-center" onClick={open}>
      <div className="relative" {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="flex overflow-hidden rounded-full">
          <Avatar className="h-32 w-32">
            <AvatarImage src={previewUrl} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 transition hover:opacity-100">
          <Upload className="size-5 text-white" />
        </div>
      </div>
    </div>
  );
}
