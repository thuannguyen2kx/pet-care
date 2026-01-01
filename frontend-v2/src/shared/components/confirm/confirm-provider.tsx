// shared/ui/confirm/confirm-provider.tsx
import React, { createContext, useCallback, useRef, useState } from 'react';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';

export type ConfirmOptions = {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
};

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

// eslint-disable-next-line react-refresh/only-export-components
export const ConfirmContext = createContext<ConfirmFn | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<(value: boolean) => void>(undefined);

  const confirm = useCallback<ConfirmFn>((opts) => {
    // Prevent stacking confirms
    if (resolverRef.current) {
      return Promise.resolve(false);
    }

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setOptions(opts);
    });
  }, []);

  const close = (result: boolean) => {
    resolverRef.current?.(result);
    resolverRef.current = undefined;
    setOptions(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      <Dialog open={!!options} onOpenChange={() => close(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{options?.title}</DialogTitle>
            {options?.message && <DialogDescription>{options.message}</DialogDescription>}
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => close(false)}>
              {options?.cancelText ?? 'Huỷ'}
            </Button>
            <Button onClick={() => close(true)}>{options?.confirmText ?? 'Xác nhận'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  );
}
