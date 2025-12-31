import { Icons } from '@/shared/components/icons';

export const FullscrenSpinner = () => {
  return (
    <div className="bg-background fixed inset-0 z-50 flex items-center justify-center">
      <Icons.ring role="status" aria-label="Loading" className={'size-12 animate-spin'} />
    </div>
  );
};
