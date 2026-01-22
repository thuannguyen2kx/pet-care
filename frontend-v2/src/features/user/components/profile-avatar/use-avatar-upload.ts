import { useCallback, useEffect, useState } from 'react';

import { fileToUrl } from '@/shared/lib/utils';

export function useAvatarUpload(initialUrl?: string, value?: File) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialUrl);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(initialUrl);
      return;
    }
    const url = fileToUrl(value);
    setPreviewUrl(url);

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [value, initialUrl]);

  const handleDrop = useCallback((files: File[], onChange: (f?: File) => void) => {
    const file = files[0];
    if (file) onChange(file);
  }, []);

  return {
    previewUrl,
    handleDrop,
  };
}
