import { Image, XIcon } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import type { MediaField } from '@/features/post/domain/post.state';
import { Button } from '@/shared/ui/button';

type MediaUploaderProps = {
  value: MediaField;
  onChange: (value: MediaField) => void;
  error?: string;
  multiple?: boolean;
};

export function MediaUploader({ value, onChange, error, multiple = true }: MediaUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const added = acceptedFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      onChange({
        ...value,
        added: [...value.added, ...added],
      });
    },
    [value, onChange],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
  });

  const removeExisting = (id: string) => {
    onChange({
      ...value,
      existing: value.existing.filter((img) => img.id !== id),
    });
  };

  const removeAdded = (previewUrl: string) => {
    onChange({
      ...value,
      added: value.added.filter((img) => img.previewUrl !== previewUrl),
    });
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className="border-muted-foreground cursor-pointer rounded-xl border border-dashed p-6"
      >
        <input {...getInputProps()} />

        <label htmlFor="media-upload">
          <div className="text-center">
            <Image className="text-muted-foreground mx-auto mb-2 h-6 w-6" />
            <p className="muted-foreground text-sm"> Tải lên hoặc kéo hình ảnh vào đây</p>
            <p className="text-muted-foreground/90 mt-1 text-xs">PNG, JPG, MP4 tối đa 5MB</p>
          </div>
        </label>
      </div>

      {error && <p className="text-destructive mt-1 text-sm">{error}</p>}

      <div className="mt-4 grid grid-cols-3 gap-4">
        {value.existing.map((img) => (
          <MediaUploadItem key={img.id} src={img.url} onRemove={() => removeExisting(img.id)} />
        ))}

        {value.added.map((img) => (
          <MediaUploadItem
            key={img.previewUrl}
            src={img.previewUrl}
            onRemove={() => removeAdded(img.previewUrl)}
          />
        ))}
      </div>
    </div>
  );
}

function MediaUploadItem({ src, onRemove }: { src: string; onRemove: () => void }) {
  return (
    <div className="group border-border relative flex aspect-square items-center justify-center rounded-lg border">
      <img src={src} className="h-full w-full rounded-lg object-contain" />
      <div className="absolute -top-4 -right-4 hidden transition-all group-hover:block">
        <Button type="button" variant="ghost" size="icon" className="bg-accent" onClick={onRemove}>
          <XIcon className="text-foreground h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
