import type {
  CreateEmployee,
  EmployeesQuery,
  UpdateEmployee,
} from '@/features/employee/domain/employee-state';
import type {
  CreateEmployeeDto,
  EmployeeDashboardStatDto,
  EmployeeDto,
  EmployeeInfoDto,
  EmployeeListItemDto,
  EmployeesQueryDto,
  UpdateEmployeeDto,
} from '@/features/employee/domain/employee.dto';
import type {
  Employee,
  EmployeeDashboardStart,
  EmployeeInfo,
  EmployeeListItem,
} from '@/features/employee/domain/employee.entity';

// =======================
// DTO to Entity
// =======================
export const mapEmployeeDashboardStatDtoToEntity = (
  dto: EmployeeDashboardStatDto,
): EmployeeDashboardStart => {
  return {
    rating: {
      average: dto.rating.average,
      totalReviews: dto.rating.totalReviews,
    },
    todayBookings: {
      total: dto.todayBookings.total,
      pending: dto.todayBookings.pending,
    },
    completedServices: {
      total: dto.completedServices.total,
      thisMonth: dto.completedServices.thisMonth,
    },
    revenue: {
      thisMonth: dto.revenue.thisMonth,
      currency: dto.revenue.currency,
    },
  };
};

export const mapEmployeeInfoToEnitty = (state: EmployeeInfoDto): EmployeeInfo => {
  return {
    specialties: state.specialties,
    certifications: state.certifications,
    experience: state.experience,

    hourlyRate: state.hourlyRate,
    commissionRate: state.commissionRate,

    defaultSchedule: {
      workDays: state.defaultSchedule.workDays,
      workHours: {
        start: state.defaultSchedule.workHours.start,
        end: state.defaultSchedule.workHours.end,
      },
    },

    stats: {
      rating: state.stats.rating,
      totalBookings: state.stats.totalBookings,
      completedBookings: state.stats.completedBookings,
      cancelledBookings: state.stats.cancelledBookings,
      noShowRate: state.stats.noShowRate,
      totalRevenue: state.stats.totalBookings,
      averageServiceTime: state.stats.averageServiceTime,
    },

    hireDate: state.hireDate,
    employeeId: state.employeeId,
    department: state.department,

    isAcceptingBookings: state.isAcceptingBookings,
    maxDailyBookings: state.maxDailyBookings,
    vacationMode: state.vacationMode,
  };
};
export const mapEmployeeDtoToEntity = (state: EmployeeDto): Employee => {
  return {
    id: state._id,
    fullName: state.fullName,
    phoneNumber: state.phoneNumber,
    dateOfBirth: state.dateOfBirth,
    address: state.address,
    profilePicture: state.profilePicture.url,
    email: state.email,
    role: state.role,
    status: state.status,
    employeeInfo: mapEmployeeInfoToEnitty(state.employeeInfo),

    createdAt: new Date(state.createdAt),
    updatedAt: new Date(state.updatedAt),
  };
};
export const mapEmployeeListItemDtoToEntity = (state: EmployeeListItemDto): EmployeeListItem => {
  return {
    id: state._id,
    fullName: state.fullName,
    phoneNumber: state.phoneNumber,
    dateOfBirth: state.dateOfBirth,
    address: state.address,
    profilePicture: state.profilePicture.url,
    email: state.email,
    role: state.role,
    status: state.status,
    employeeInfo: {
      specialties: state.employeeInfo.specialties,
      hourlyRate: state.employeeInfo.hourlyRate,
      commissionRate: state.employeeInfo.commissionRate,
      stats: state.employeeInfo.stats,
      isAcceptingBookings: state.employeeInfo.isAcceptingBookings,
      vacationMode: state.employeeInfo.vacationMode,
      maxDailyBookings: state.employeeInfo.maxDailyBookings,
    },

    createdAt: new Date(state.createdAt),
  };
};

export const mapEmployeeListItemsToEntities = (
  state: EmployeeListItemDto[],
): EmployeeListItem[] => {
  return state.map(mapEmployeeListItemDtoToEntity);
};
// ===================
// State => Dto
// ===================
export const mapEmployeesQueryToDto = (state: EmployeesQuery): EmployeesQueryDto => {
  const query = {
    specialty: state.specialty,
    page: state.page,
    limit: state.limit,
  };
  switch (state.acceptBooking) {
    case 'all':
      return query;
    case 'accepting':
      return { ...query, isAcceptingBookings: true };
    case 'not-accepting':
      return { ...query, isAcceptingBookings: false };
  }
  return query;
};

export const mapCreatEmployeeToDto = (state: CreateEmployee): CreateEmployeeDto => {
  return {
    fullName: state.fullName,
    email: state.email,
    phoneNumber: state.phoneNumber,
    specialties: state.specialties,
    hourlyRate: state.hourlyRate,
    department: state.department,
  };
};
export const mapUpdateEmployeeToDto = (state: UpdateEmployee): UpdateEmployeeDto => {
  return {
    fullName: state.fullName,
    phoneNumber: state.phoneNumber,
    specialties: state.specialties,
    hourlyRate: state.hourlyRate,
    commissionRate: state.commissionRate,
    department: state.department,
    vacationMode: state.vacationMode,
    isAcceptingBookings: state.isAcceptingBookings,
    maxDailyBookings: state.maxDailyBookings,
  };
};
