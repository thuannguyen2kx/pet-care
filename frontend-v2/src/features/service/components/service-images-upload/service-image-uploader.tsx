import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { ServiceImageUploadItem } from '@/features/service/components/service-images-upload/service-image-upload-item';
import type { ImageFieldValue } from '@/features/service/components/service-images-upload/service-image-upload.type';

type FileUploaderProps = {
  value: ImageFieldValue;
  onChange: (value: ImageFieldValue) => void;
  error?: string;
  multiple?: boolean;
};

export function ServiceImageUploader({
  value,
  onChange,
  error,
  multiple = true,
}: FileUploaderProps) {
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
      <div {...getRootProps()} className="cursor-pointer rounded-xl border border-dashed p-6">
        <input {...getInputProps()} />

        <p className="text-muted-foreground text-center text-sm">
          Tải lên hoặc kéo hình ảnh vào đây
        </p>
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      <div className="mt-4 grid grid-cols-3 gap-4">
        {value.existing.map((img) => (
          <ServiceImageUploadItem
            key={img.id}
            src={img.url}
            onRemove={() => removeExisting(img.id)}
          />
        ))}

        {value.added.map((img) => (
          <ServiceImageUploadItem
            key={img.previewUrl}
            src={img.previewUrl}
            onRemove={() => removeAdded(img.previewUrl)}
          />
        ))}
      </div>
    </div>
  );
}
