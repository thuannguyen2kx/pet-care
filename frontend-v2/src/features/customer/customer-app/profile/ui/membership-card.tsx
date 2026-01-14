import { Crown, Gem, PawPrint, Star } from 'lucide-react';

import type { Customer } from '@/features/customer/domain/customer-entity';
import { Card, CardContent } from '@/shared/ui/card';

const tierConfigs = {
  BRONZE: {
    name: 'PetCare Bronze',
    gradientFrom: 'from-primary',
    gradientTo: 'to-primary/80',
    icon: <Star className="h-8 w-8 opacity-80" />,
    textColor: 'text-amber-50',
  },
  SILVER: {
    name: 'PetCare Silver',
    gradientFrom: 'from-slate-400',
    gradientTo: 'to-slate-300',
    icon: <Star className="h-8 w-8 opacity-80" />,
    textColor: 'text-slate-900',
  },
  GOLD: {
    name: 'PetCare Gold',
    gradientFrom: 'from-yellow-500',
    gradientTo: 'to-yellow-400',
    icon: <Gem className="h-8 w-8 opacity-80" />,
    textColor: 'text-yellow-900',
  },
  PLATINUM: {
    name: 'PetCare Platinum',
    gradientFrom: 'from-slate-900',
    gradientTo: 'to-slate-800',
    icon: <Crown className="h-8 w-8 opacity-80" />,
    textColor: 'text-slate-50',
  },
};

type Props = {
  data: Customer;
};
export function MembershipCard({ data }: Props) {
  const config = tierConfigs[data.customerInfo.membershipTier];
  return (
    <Card
      className={`mt-6 overflow-hidden bg-linear-to-br ${config.gradientFrom} ${config.gradientTo}`}
    >
      <CardContent className="text-primary-foreground p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs opacity-80">Thẻ thành viên</p>
            <p className="mt-1 text-lg font-semibold">{config.name}</p>
          </div>
          {config.icon}
        </div>
        <div className="mt-6">
          <p className="text-xs opacity-80">Số thẻ</p>
          <p className="font-mono text-sm tracking-wider">
            PC-2023-{data.id.slice(-4).toUpperCase()}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs opacity-80">Chủ thẻ</p>
            <p className="text-sm font-medium">{data.fullName}</p>
          </div>
          <PawPrint className="h-10 w-10 opacity-20" />
        </div>
      </CardContent>
    </Card>
  );
}
