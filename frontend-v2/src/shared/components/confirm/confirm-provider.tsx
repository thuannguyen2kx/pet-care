import React, { useState } from 'react';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';

type ConfirmOptions = {
  title: string;
  message?: string;
  confirmText?: string;
};

export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;
// eslint-disable-next-line react-refresh/only-export-components
export const ConfirmContext = React.createContext<ConfirmFn | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm: ConfirmFn = (options) =>
    new Promise((resolve) => {
      setState({ options, resolve });
    });

  const handleClose = () => setState(null);

  const handleConfirm = () => {
    state?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    state?.resolve(false);
    handleClose();
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      <Dialog open={!!state}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{state?.options.title}</DialogTitle>
            <DialogDescription>{state?.options.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Huỷ
            </Button>
            <Button onClick={handleConfirm}>{state?.options.confirmText || 'Xác nhận'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  );
}
