import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';


interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  subtitle?: string;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, subtitle }) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">
              {value}
            </h3>
            {change !== undefined && (
              <div className="flex items-center mt-1">
                {change >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={change >= 0 ? "text-green-500" : "text-red-500"}>
                  {change >= 0 ? "+" : ""}
                  {change.toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground ml-1">{subtitle || 'so với tháng trước'}</span>
              </div>
            )}
          </div>
          <div className="bg-primary/10 p-3 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};