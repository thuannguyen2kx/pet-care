import { Plus, Syringe } from 'lucide-react';

import type { TVaccination } from '@/features/pets/types';
import { formatDateVN } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';

type Props = {
  vaccinations?: TVaccination[];
};
export function PetVaccineTab({ vaccinations }: Props) {
  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Đã tiêm <span className="text-foreground font-medium">{vaccinations?.length}</span> loại
          vaccine
        </p>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm vaccine
        </Button>
      </div>
      <div className="space-y-3">
        {vaccinations?.map((vaccine) => {
          const isDueSoon =
            vaccine.nextDueDate &&
            new Date(vaccine.nextDueDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

          return (
            <Card key={vaccine._id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    isDueSoon ? 'bg-accent' : 'bg-primary/10'
                  }`}
                >
                  <Syringe
                    className={`h-6 w-6 ${isDueSoon ? 'text-accent-foreground' : 'text-primary'}`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-foreground font-medium">{vaccine.name}</h4>
                    {isDueSoon && (
                      <Badge variant="secondary" className="text-xs">
                        Sắp đến hạn
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Đã tiêm: {formatDateVN(new Date(vaccine.date))} • {vaccine.veterinarianName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground text-xs">Tiêm lại</p>
                  <p className="text-foreground text-sm font-medium">
                    {vaccine.nextDueDate
                      ? formatDateVN(new Date(vaccine.nextDueDate))
                      : 'Chưa có lịch tiêm lại'}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
