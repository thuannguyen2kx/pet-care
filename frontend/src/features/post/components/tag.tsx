import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  onClose?: () => void;
}

export const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({ className, variant = 'default', children, onClose, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
          variant === 'default' && 'bg-primary/10 text-primary hover:bg-primary/20',
          variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          variant === 'outline' && 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
          variant === 'destructive' && 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
          className
        )}
        {...props}
      >
        {children}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-1 -mr-1 h-3.5 w-3.5 rounded-full hover:bg-gray-300/20 inline-flex items-center justify-center"
          >
            <X size={12} />
            <span className="sr-only">Remove tag</span>
          </button>
        )}
      </div>
    );
  }
);