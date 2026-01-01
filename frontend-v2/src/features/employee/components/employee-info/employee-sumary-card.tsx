import { Mail, Phone } from 'lucide-react';

import { EmployeeStatsGrid } from '@/features/employee/components/employee-info/employee-stats-grid';
import { ProfileAvatarDialog } from '@/features/user/components/profile-action/profile-avatar';
import type { TProfile } from '@/features/user/types';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

type Props = {
  employee: TProfile;
};
export function EmployeeSumaryCard({ employee }: Props) {
  const { profilePicture, fullName, phoneNumber, email } = employee;
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <ProfileAvatarDialog avatarUrl={profilePicture?.url ?? undefined} fullName={fullName} />
          <h2 className="text-foreground mb-1 text-xl font-semibold">{fullName}</h2>
          <Badge variant="secondary" className="mb-4">
            Nhân viên
          </Badge>

          <div className="w-full space-y-3 text-sm">
            <div className="text-muted-foreground flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{email}</span>
            </div>
            {phoneNumber && (
              <div className="text-muted-foreground flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{phoneNumber}</span>
              </div>
            )}
          </div>

          <Separator className="my-4" />

          <EmployeeStatsGrid employeeInfo={employee.employeeInfo} />
        </div>
      </CardContent>
    </Card>
  );
}
