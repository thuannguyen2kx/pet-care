import { use } from 'react';

import { ConfirmContext } from '@/shared/components/confirm/confirm-provider';

export function useConfirmDialog() {
  const ctx = use(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirmDialog must be used inside ConfirmProvider');
  }
  return ctx;
}
