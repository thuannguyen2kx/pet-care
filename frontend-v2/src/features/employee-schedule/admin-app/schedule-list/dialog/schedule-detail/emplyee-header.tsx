import type { TEmployeeDetail } from '@/features/employee/types';
import { getInitials } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

export function EmployeeHeader({ employee }: { employee: TEmployeeDetail }) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-16">
        <AvatarImage src={employee.profilePicture?.url ?? undefined} />
        <AvatarFallback className="bg-primary/10 text-primary text-sm">
          {getInitials(employee.fullName)}
        </AvatarFallback>
      </Avatar>

      <div>
        <h3 className="h5-medium">{employee.fullName}</h3>
        <p className="text-muted-foreground text-sm">{employee.email}</p>
      </div>
    </div>
  );
}
