import { ImageIcon, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

import { usePetImageUpload } from './use-pet-image-upload';

type Props = {
  initialUrl?: string;
  value?: File;
  onChange: (file?: File) => void;
};
export function PetImageUpload({ initialUrl, value, onChange }: Props) {
  const { previewUrl, handleDrop } = usePetImageUpload(initialUrl, value);

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
          {previewUrl ? (
            <div className="size-42">
              <img src={previewUrl} className="size-full object-cover" />
            </div>
          ) : (
            <div className="border-border bg-muted flex size-42 items-center justify-center gap-2 overflow-hidden rounded-full border-2 border-dashed transition-all">
              <ImageIcon className="mb-2 size-6" />
              <span className="text-xs">Chọn ảnh</span>
            </div>
          )}
        </div>
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 transition hover:opacity-100">
          <Upload className="size-5 text-white" />
        </div>
      </div>
    </div>
  );
}
