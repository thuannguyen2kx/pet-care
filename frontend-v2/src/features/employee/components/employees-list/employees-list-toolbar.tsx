import { Search } from 'lucide-react';
import { useNavigate } from 'react-router';

import { CreateEmployeeDialog } from '@/features/employee/components/employee-action/create-employee';
import {
  EMPLOYEE_BOOKING_ACCEPTING,
  EMPLOYEE_BOOKING_ALL,
  EMPLOYEE_BOOKING_NOT_ACCEPTING,
  EMPLOYEE_SPECIALTY_ALL,
} from '@/features/employee/constants';
import { specialtiesList } from '@/features/employee/constants/specialties';
import {
  employeeFilterToSearchParams,
  mapBookingDomainToUI,
  mapBookingFilterToDomain,
} from '@/features/employee/mapping';
import { type TEmployeeFilter } from '@/features/employee/shemas';
import type { TBookingFilterValue } from '@/features/employee/types';
import { paths } from '@/shared/config/paths';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

type Props = {
  filter: TEmployeeFilter;
};
export function EmployeesListToolbar({ filter }: Props) {
  const navigate = useNavigate();

  const handleChooseBookingStatus = (value: TBookingFilterValue) => {
    const nextFilter: TEmployeeFilter = {
      ...filter,
      isAcceptingBookings: mapBookingFilterToDomain(value),
      page: 1,
    };

    navigate({
      pathname: paths.admin.employees.path,
      search: employeeFilterToSearchParams(nextFilter).toString(),
    });
  };

  const handleChooseSpecialty = (specialty: string) => {
    const nextFilter: TEmployeeFilter = {
      ...filter,
      specialty: specialty === EMPLOYEE_SPECIALTY_ALL ? undefined : specialty,
      page: 1,
    };
    navigate({
      pathname: paths.admin.employees.path,
      search: employeeFilterToSearchParams(nextFilter).toString(),
    });
  };
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input disabled placeholder="Tìm kiếm nhân viên..." className="pl-9" />
      </div>
      <Select
        value={filter.specialty || EMPLOYEE_SPECIALTY_ALL}
        onValueChange={handleChooseSpecialty}
      >
        <SelectTrigger>
          <SelectValue placeholder="Lọc theo chuyên môn" />
        </SelectTrigger>
        <SelectContent align="end" popover="auto" className="border-border">
          <SelectItem value={EMPLOYEE_SPECIALTY_ALL}>Tất cả chuyên môn</SelectItem>
          {specialtiesList.map((specialty) => (
            <SelectItem key={specialty.value} value={specialty.value}>
              {specialty.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={mapBookingDomainToUI(filter.isAcceptingBookings)}
        onValueChange={handleChooseBookingStatus}
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
