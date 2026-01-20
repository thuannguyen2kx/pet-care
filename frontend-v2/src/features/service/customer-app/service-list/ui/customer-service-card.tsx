import { ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router';

import { getServiceCategoryConfig } from '@/features/service/config/service-category.config';
import type { Service } from '@/features/service/domain/service.entity';
import { paths } from '@/shared/config/paths';
import { formatCurrency } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';

interface Props {
  service: Service;
}

export function ServiceCard({ service }: Props) {
  const formatDuration = (minutes: number) => {
    if (minutes >= 1440) return `${Math.floor(minutes / 1440)} ngày`;
    if (minutes >= 60)
      return `${Math.floor(minutes / 60)}h${minutes % 60 > 0 ? ` ${minutes % 60}p` : ''}`;
    return `${minutes} phút`;
  };

  const { label: categoryLabel, color: categoryColors } = getServiceCategoryConfig(
    service.category,
  );

  return (
    <Card className="group border-border/50 hover:border-primary/30 overflow-hidden rounded-none shadow-none transition-all">
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          src={service.images[0].url || '/placeholder.svg'}
          alt={service.name}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        <Badge className={`absolute top-3 left-3 ${categoryColors}`}>{categoryLabel}</Badge>
        <Badge className="bg-accent text-accent-foreground absolute right-3 bottom-3 flex items-center gap-1 text-xs opacity-80">
          <Clock className="h-3.5 w-3.5" />
          {formatDuration(service.duration)}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="text-foreground mb-1 text-lg font-semibold">{service.name}</h3>
        <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">{service.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-primary text-lg font-bold">{formatCurrency(service.price)}</span>
          </div>

          <Button size="sm" asChild>
            <Link to={paths.customer.createBooking.getHref(service.id)}>
              Đặt ngay
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
