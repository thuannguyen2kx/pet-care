import { ArrowRight, Ban, Crown, Gift, Mail, MoreVertical, Phone, Users } from 'lucide-react';

import type { CustomerListItem } from '@/features/customer/domain/customer-entity';
import {
  getMembershipTierConfig,
  MEMBER_SHIP_TIER,
  USER_STATUS,
} from '@/features/user/domain/user-status';
import { cn, getInitials } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Skeleton } from '@/shared/ui/skeleton';

type Props = {
  isLoading: boolean;
  customers: CustomerListItem[];
};

export function CustomerListContent({ customers, isLoading }: Props) {
  if (isLoading) {
    return <CustomerListSkeleton />;
  }

  if (customers.length === 0) {
    return (
      <Card className="rounded-none border-none shadow-none">
        <CardContent className="p-12 text-center">
          <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <p className="text-muted-foreground">Không tìm thấy khách hàng nào</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-4">
      {customers.map((customer) => (
        <CustomerListItem key={customer.id} customer={customer} />
      ))}
    </div>
  );
}

function CustomerListItem({ customer }: { customer: CustomerListItem }) {
  const tierConfig = getMembershipTierConfig(customer.customerInfo.membershipTier);
  return (
    <Card
      key={customer.id}
      className={`rounded-none border-0 border-none shadow-none ${customer.status !== USER_STATUS.ACTIVE ? 'opacity-60' : ''}`}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative">
              <Avatar className="h-14 w-14">
                <AvatarImage src={customer.profilePicture ?? undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {getInitials(customer.fullName)}
                </AvatarFallback>
              </Avatar>
              {customer.customerInfo.membershipTier === MEMBER_SHIP_TIER.GOLD && (
                <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500">
                  <tierConfig.icon className={cn('size-5', tierConfig.color.text)} />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-foreground font-semibold">{customer.fullName}</h3>
                {customer.status !== USER_STATUS.ACTIVE && (
                  <Badge variant="outline" className="bg-destructive/10 text-destructive text-xs">
                    Tạm khóa
                  </Badge>
                )}
              </div>
              <div className="text-muted-foreground flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {customer.email}
                </span>
                {customer.phoneNumber && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {customer.phoneNumber}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Badge
            variant="outline"
            className={`${tierConfig.color.bg} ${tierConfig.color.text} ${tierConfig.color.border}`}
          >
            <Crown className="mr-1 h-3 w-3" />
            {tierConfig.label}
          </Badge>

          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <p className="font-semibold">{customer.customerInfo.stats.totalBookings}</p>
              <p className="text-muted-foreground text-xs">Lượt đặt</p>
            </div>
            <div className="text-center">
              <p className="text-primary font-semibold">
                {(customer.customerInfo.stats.totalSpent / 1000000).toFixed(1)}M
              </p>
              <p className="text-muted-foreground text-xs">Chi tiêu</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-yellow-600">{customer.customerInfo.loyaltyPoints}</p>
              <p className="text-muted-foreground text-xs">Điểm</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <ArrowRight className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Gift className="mr-2 h-4 w-4" />
                Tặng điểm thưởng
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={
                  customer.status === USER_STATUS.ACTIVE ? 'text-destructive' : 'text-success'
                }
              >
                <Ban className="mr-2 h-4 w-4" />
                {customer.status === USER_STATUS.ACTIVE
                  ? 'Tạm khóa tài khoản'
                  : 'Mở khóa tài khoản'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
function CustomerListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} className="rounded-none border-none shadow-none">
          <CardContent className="p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="flex flex-1 items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
              </div>

              <Skeleton className="hidden h-6 w-20 rounded-full lg:block" />

              <div className="flex items-center gap-6 lg:gap-8">
                <div className="space-y-1 text-center">
                  <Skeleton className="mx-auto h-5 w-8" />
                  <Skeleton className="mx-auto h-3 w-12" />
                </div>
                <div className="space-y-1 text-center">
                  <Skeleton className="mx-auto h-5 w-12" />
                  <Skeleton className="mx-auto h-3 w-14" />
                </div>
                <div className="space-y-1 text-center">
                  <Skeleton className="mx-auto h-5 w-10" />
                  <Skeleton className="mx-auto h-3 w-10" />
                </div>
              </div>

              <Skeleton className="h-9 w-9 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
