import { Icons } from '@/shared/components/icons';

export function SectionSpinner() {
  return (
    <div className="flex w-full justify-center py-10">
      <Icons.ring role="status" aria-label="Loading" className={'size-10 animate-spin'} />
    </div>
  );
}
