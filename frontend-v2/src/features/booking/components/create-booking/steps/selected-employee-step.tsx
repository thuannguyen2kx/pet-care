import { Check, Shield, Star, User } from 'lucide-react';

import type { TAvailableEmployee } from '@/features/booking/api/types';
import { cn, getInitials } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';

type Props = {
  employees: TAvailableEmployee[];
  isLoading: boolean;
  selectedEmployee: string | null;
  setSelectEmployee: (id: string) => void;
};
export function SelectedEmployeeStep({
  isLoading,
  employees,
  selectedEmployee,
  setSelectEmployee,
}: Props) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="mb-2 h-7 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <EmployeeCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-foreground text-xl font-semibold">Chọn chuyên viên</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Đội ngũ chuyên viên giàu kinh nghiệm sẵn sàng phục vụ
        </p>
      </div>

      {employees.length > 0 ? (
        <div className="space-y-4">
          {employees.map((emp) => {
            const isSelected = selectedEmployee === emp._id;

            return (
              <button
                key={emp._id}
                onClick={() => setSelectEmployee(emp._id)}
                className={cn(
                  'group relative w-full overflow-hidden rounded-2xl border-2 p-0 text-left transition-all duration-300',
                  isSelected
                    ? 'border-primary ring-primary/20 ring-2'
                    : 'border-border hover:border-primary/50 hover:shadow-lg',
                )}
              >
                <div className="flex flex-col px-4 sm:flex-row sm:items-center">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={emp.avatar} />
                    <AvatarFallback>{getInitials(emp.fullName)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 p-4 sm:p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-foreground font-semibold">{emp.fullName}</h3>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm font-medium">{emp.rating}</span>
                          </div>
                          <span className="text-muted-foreground text-sm">
                            ({emp.completedServices} dịch vụ)
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {emp.specialties.map((spec) => (
                        <Badge key={spec} variant="secondary" className="gap-1">
                          <Shield className="h-3 w-3" />
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="border-border flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center">
          <User className="text-muted-foreground/50 h-12 w-12" />
          <p className="text-muted-foreground mt-4 font-medium">Không có chuyên viên phù hợp</p>
          <p className="text-muted-foreground/70 mt-1 text-sm">
            Vui lòng chọn dịch vụ khác hoặc liên hệ với chúng tôi
          </p>
        </div>
      )}
    </div>
  );
}

function EmployeeCardSkeleton() {
  return (
    <div className="border-border relative w-full overflow-hidden rounded-2xl border-2 p-0">
      <div className="flex flex-col px-4 sm:flex-row sm:items-center">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1 space-y-3 p-4 sm:p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
