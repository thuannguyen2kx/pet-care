import { Icons } from '@/shared/components/icons';

export function OverlaySpinner() {
  return (
    <div className="bg-background/60 absolute inset-0 flex items-center justify-center backdrop-blur-sm">
      <Icons.ring role="status" aria-label="Loading" className={'size-10 animate-spin'} />
    </div>
  );
}
