import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';

type Props = {
  to: string;
  label: string;
};
export function BackLink({ to, label }: Props) {
  return (
    <Link
      to={to}
      className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm transition-colors"
    >
      <ChevronLeft className="size-4" />
      {label}{' '}
    </Link>
  );
}
