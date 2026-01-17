import { TrendingDown, TrendingUp } from 'lucide-react';

import { Card, CardContent } from '@/shared/ui/card';

type StatCardProps = {
  title: string;
  value: React.ReactNode;
  change?: number;
  icon: React.ReactNode;
  iconBgClass: string;
};

export function StatCard({ title, value, change, icon, iconBgClass }: StatCardProps) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <Card className="rounded-none border-none p-4 shadow-none">
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">{title}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>

            {typeof change === 'number' && (
              <div
                className={`mt-1 flex items-center gap-1 text-sm ${
                  isPositive ? 'text-success' : 'text-destructive'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{Math.abs(change)}%</span>
              </div>
            )}
          </div>

          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBgClass}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
