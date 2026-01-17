import type { LucideIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Card, CardContent } from '@/shared/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconBgColor,
  iconColor,
}: StatCardProps) {
  return (
    <Card className="rounded-none border-none p-4 shadow-none">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm font-medium">{title}</p>
            <p className="text-foreground text-2xl font-bold tracking-tight">{value}</p>
            {change && (
              <p
                className={cn(
                  'text-xs font-medium',
                  changeType === 'positive' && 'text-success',
                  changeType === 'negative' && 'text-destructive',
                  changeType === 'neutral' && 'text-muted-foreground',
                )}
              >
                {change}
              </p>
            )}
          </div>
          <div className={cn('rounded-xl p-3', iconBgColor || 'bg-primary/10')}>
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
