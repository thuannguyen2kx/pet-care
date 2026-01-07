import { cn } from '@/shared/lib/utils';

type Props = {
  className?: string;
  textClassName?: string;
};
export const Logo = ({ className, textClassName }: Props) => {
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <img src="/logo.svg" alt="logo" className="h-10 w-10" />
      <span className={cn('text-foreground text-2xl font-semibold', textClassName)}>PetCare</span>
    </div>
  );
};
