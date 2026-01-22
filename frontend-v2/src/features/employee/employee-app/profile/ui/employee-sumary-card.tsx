import { Mail, Phone } from 'lucide-react';

import type { Employee } from '@/features/employee/domain/employee.entity';
import { EmployeeStatsGrid } from '@/features/employee/employee-app/profile/ui/employee-stats-grid';
import { ProfileAvatarDialog } from '@/features/user/components/profile-avatar';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

type Props = {
  employee: Employee;
};
export function EmployeeSumaryCard({ employee }: Props) {
  const { profilePicture, fullName, phoneNumber, email } = employee;
  return (
    <Card className="rounded-none border-none shadow-none">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <ProfileAvatarDialog avatarUrl={profilePicture ?? undefined} fullName={fullName} />
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
