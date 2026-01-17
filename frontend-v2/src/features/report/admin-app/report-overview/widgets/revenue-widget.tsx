import { TrendingDown, TrendingUp } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useRevenueChartController } from '@/features/report/admin-app/report-overview/application/use-revenue-chart-controller';
import { RevenueChartFilter } from '@/features/report/admin-app/report-overview/ui/revenue-chart-filter';
import { formatCurrency } from '@/shared/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

export function RevenueWidget() {
  const controller = useRevenueChartController();
  return (
    <div className="space-y-6">
      <RevenueChartFilter />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="rounded-none border-none p-4 shadow-none lg:col-span-2">
          <CardHeader>
            <CardTitle>Biểu đồ doanh thu</CardTitle>
            <CardDescription>Doanh thu theo thời gian</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart data={controller.points} isLoading={controller.isLoading} />
          </CardContent>
        </Card>

        <Card className="rounded-none border-none p-4 shadow-none">
          <CardHeader>
            <CardTitle>Doanh thu theo ngày</CardTitle>
            <CardDescription>7 ngày gần nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueDailyList data={controller.dailyRevenue} isLoading={controller.isLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type RevenueChartProps = {
  data: {
    label: string;
    revenue: number;
  }[];
  isLoading?: boolean;
};

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  if (isLoading) {
    return <RevenueChartSkeleton />;
  }

  if (!data.length) {
    return (
      <div className="text-muted-foreground flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-sm">Không có dữ liệu doanh thu</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(31, 41, 55)" stopOpacity={0.15} />
            <stop offset="100%" stopColor="rgb(31, 41, 55)" stopOpacity={0.01} />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: '#6B7280' }}
          axisLine={{ stroke: '#E5E7EB' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6B7280' }}
          tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
          axisLine={false}
          tickLine={false}
          width={45}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
                <p className="mb-1 text-xs text-gray-500">{payload[0].payload.label}</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(payload[0].value as number)}
                </p>
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="rgb(31, 41, 55)"
          strokeWidth={2}
          fill="url(#revenueGradient)"
          dot={false}
          activeDot={{ r: 4, fill: 'rgb(31, 41, 55)', stroke: 'white', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

type DailyRevenueItem = {
  label: string;
  revenue: number;
  change?: number;
};

type RevenueDailyListProps = {
  data: DailyRevenueItem[];
  isLoading: boolean;
};

function RevenueDailyList({ data, isLoading }: RevenueDailyListProps) {
  if (isLoading) {
    return <RevenueDailyListSkeleton />;
  }
  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const positive = (item.change ?? 0) >= 0;
        const isToday = index === 0;

        return (
          <div
            key={item.label}
            className={`flex items-center justify-between py-2.5 ${
              isToday ? '-mx-4 rounded-lg bg-gray-50 px-4' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`text-sm ${isToday ? 'font-medium text-gray-900' : 'text-gray-600'}`}
              >
                {item.label}
              </span>
            </div>

            <div className="text-right">
              <p className={`font-semibold ${isToday ? 'text-gray-900' : 'text-gray-700'}`}>
                {(item.revenue / 1_000_000).toFixed(1)}M
              </p>
              {item.change !== undefined && (
                <div className="mt-0.5 flex items-center justify-end gap-1">
                  {positive ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <p
                    className={`text-xs font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {positive ? '+' : ''}
                    {item.change.toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
function RevenueChartSkeleton() {
  return (
    <div className="flex h-70 w-full items-end justify-between gap-3 px-4 pb-8">
      <div className="flex h-full w-10 flex-col justify-between py-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-3 w-8" />
        ))}
      </div>

      <div className="flex h-full flex-1 items-end justify-between gap-2">
        {[45, 65, 55, 80, 70, 60, 75].map((height, i) => (
          <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <Skeleton className="w-full rounded-t-lg" style={{ height: `${height}%` }} />
            <Skeleton className="h-3 w-6" />
          </div>
        ))}
      </div>
    </div>
  );
}
function RevenueDailyListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div key={i} className={`flex items-center justify-between py-2.5`}>
          <Skeleton className="h-4 w-24" />
          <div className="space-y-1 text-right">
            <Skeleton className="ml-auto h-5 w-16" />
            <Skeleton className="ml-auto h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}
