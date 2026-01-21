import type {
  EmployeeDashboardStatDto,
  EmployeeDto,
  EmployeeInfoDto,
} from '@/features/employee/domain/employee.dto';
import type {
  Employee,
  EmployeeDashboardStart,
  EmployeeInfo,
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
      workdays: state.defaultSchedule.workdays,
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
    gender: state.gender,
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
