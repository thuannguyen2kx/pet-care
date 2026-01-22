import { Search } from 'lucide-react';

import { CreateEmployeeDialog } from '@/features/employee/admin-app/employee-list/dialog/create-employee';
import { EMPLOYEE_SPECIALTIES_CONFIG } from '@/features/employee/config';
import type { EmployeesQuery } from '@/features/employee/domain/employee-state';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

type Props = {
  filter: EmployeesQuery;
  setFilters: (next: Partial<EmployeesQuery>) => void;
};

const EMPLOYEE_SPECIALTY_ALL = 'all';

const EMPLOYEE_BOOKING_ALL = 'all';
const EMPLOYEE_BOOKING_ACCEPTING = 'accepting';
const EMPLOYEE_BOOKING_NOT_ACCEPTING = 'not-accepting';

export function EmployeesListToolbar({ filter, setFilters }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input disabled placeholder="Tìm kiếm nhân viên..." className="pl-9" />
      </div>
      <Select
        value={filter.specialty || EMPLOYEE_SPECIALTY_ALL}
        onValueChange={(value) => {
          setFilters({ specialty: value as EmployeesQuery['specialty'], page: 1 });
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Lọc theo chuyên môn" />
        </SelectTrigger>
        <SelectContent align="end" popover="auto" className="border-border">
          <SelectItem value={EMPLOYEE_SPECIALTY_ALL}>Tất cả chuyên môn</SelectItem>
          {Object.entries(EMPLOYEE_SPECIALTIES_CONFIG).map(([specialty, config]) => (
            <SelectItem key={specialty} value={specialty}>
              {config.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filter.acceptBooking || EMPLOYEE_BOOKING_ALL}
        onValueChange={(value) => {
          setFilters({ acceptBooking: value as EmployeesQuery['acceptBooking'], page: 1 });
        }}
      >
        <SelectTrigger className="w-60">
          <SelectValue placeholder="Trạng thái booking" />
        </SelectTrigger>

        <SelectContent align="end" className="border-border">
          <SelectItem value={EMPLOYEE_BOOKING_ALL}>Tất cả</SelectItem>
          <SelectItem value={EMPLOYEE_BOOKING_ACCEPTING}>Đang nhận booking</SelectItem>
          <SelectItem value={EMPLOYEE_BOOKING_NOT_ACCEPTING}>Tạm ngưng booking</SelectItem>
        </SelectContent>
      </Select>
      <CreateEmployeeDialog />
    </div>
  );
}
