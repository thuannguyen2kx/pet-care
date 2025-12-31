import { Calendar, DollarSign, Mail, Phone, Star } from 'lucide-react';

import type { TEmployeeListItem } from '@/features/employee/types';
import { getInitials } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';
type Props = {
  employee: TEmployeeListItem;
  statusUI: {
    label: string;
    className: string;
  };
  actionMenu: React.ReactNode;
};

export function EmployeeCardView({ employee, statusUI, actionMenu }: Props) {
  return (
    <Card className="border-0 py-4 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarImage src={employee.profilePicture?.url || '/placeholder.svg'} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {getInitials(employee.fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-foreground font-semibold">{employee.fullName}</h3>
              <Badge variant="outline" className={statusUI.className}>
                {statusUI.label}
              </Badge>
            </div>
          </div>
          {actionMenu}
        </div>

        <div className="space-y-2 text-sm">
          <div className="text-muted-foreground flex items-center gap-2">
            <Mail className="size-4" />
            <span className="truncate">{employee.email}</span>
          </div>
          {employee.phoneNumber && (
            <div className="text-muted-foreground flex items-center gap-2">
              <Phone className="size-4" />
              <span>{employee.phoneNumber}</span>
            </div>
          )}
        </div>

        {employee.employeeInfo && (
          <>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {employee.employeeInfo.specialties.map((spec) => (
                <Badge key={spec} variant="secondary" className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>

            <div className="border-border mt-4 grid grid-cols-3 gap-2 border-t pt-4">
              <div className="text-center">
                <div className="text-warning mb-1 flex items-center justify-center gap-1">
                  <Star className="size-3.5 fill-current" />
                  <span className="text-foreground font-semibold">
                    {employee.employeeInfo.stats.rating}
                  </span>
                </div>
                <span className="text-muted-foreground text-xs">Đánh giá</span>
              </div>

              <div className="text-center">
                <div className="mb-1 flex items-center justify-center gap-1">
                  <Calendar className="text-primary h-3.5 w-3.5" />
                  <span className="text-foreground font-semibold">
                    {employee.employeeInfo.stats.completedBookings}
                  </span>
                </div>
                <span className="text-muted-foreground text-xs">Dịch vụ</span>
              </div>
              <div className="text-center">
                <div className="mb-1 flex items-center justify-center gap-1">
                  <DollarSign className="text-success h-3.5 w-3.5" />
                  <span className="text-foreground font-semibold">
                    {employee.employeeInfo.stats.totalBookings}
                  </span>
                </div>
                <span className="text-muted-foreground text-xs">Lượt đặt</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
