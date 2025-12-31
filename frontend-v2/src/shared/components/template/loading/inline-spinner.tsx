import { Icons } from '@/shared/components/icons';

export function InlineSpinner() {
  return <Icons.ring role="status" aria-label="Loading" className={'size-4 animate-spin'} />;
}
