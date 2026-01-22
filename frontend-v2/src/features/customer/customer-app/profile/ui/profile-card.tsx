import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Award, Gift } from 'lucide-react';

import type { Customer } from '@/features/customer/domain/customer-entity';
import { ProfileAvatarDialog } from '@/features/user/components/profile-avatar';
import { Card, CardContent } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

type Props = {
  data: Customer;
  totalPet: number;
};
export function CustomerProfileCard({ data, totalPet }: Props) {
  return (
    <>
      <Card className="overflow-hidden rounded-none border-none pb-6 shadow-none">
        <div className="from-primary/20 to-primary/10 relative h-24 bg-linear-to-r">
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <ProfileAvatarDialog
              avatarUrl={data.profilePicture.url ?? undefined}
              fullName={data.fullName}
            />
          </div>
        </div>

        <CardContent className="pt-16 text-center">
          <h2 className="text-foreground text-xl font-semibold">{data.fullName}</h2>
          <p className="text-muted-foreground text-sm">{data.email}</p>

          <div className="bg-primary/10 mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2">
            <Award className="text-primary h-5 w-5" />
            <span className="text-primary font-semibold">
              {data.customerInfo.loyaltyPoints.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-sm">điểm tích lũy</span>
          </div>

          <div className="text-muted-foreground mt-4 flex items-center justify-center gap-2 text-sm">
            <Gift className="h-4 w-4" />
            <span>
              Thành viên từ {format(data.customerInfo.memberSince, 'dd/MM/yyyy', { locale: vi })}
            </span>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-foreground text-2xl font-bold">{totalPet}</p>
              <p className="text-muted-foreground text-xs">Thú cưng</p>
            </div>
            <div>
              <p className="text-foreground text-2xl font-bold">
                {data.customerInfo.stats.totalBookings}
              </p>
              <p className="text-muted-foreground text-xs">Lượt đặt</p>
            </div>
            <div>
              <p className="text-primary text-2xl font-bold">
                {data.customerInfo.stats.completedBookings}
              </p>
              <p className="text-muted-foreground text-xs">Hoàn thành</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
