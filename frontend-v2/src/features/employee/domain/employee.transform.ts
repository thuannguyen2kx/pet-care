import type {
  EmployeeDashboardStatDto,
  EmployeeScheduleDto,
} from '@/features/employee/domain/employee.dto';
import type {
  EmployeeDashboardStart,
  EmployeeSchedule,
} from '@/features/employee/domain/employee.entity';

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

export const mapEmployeeScheduleDtoToEntity = (dto: EmployeeScheduleDto): EmployeeSchedule => {
  return {
    date: dto.date,
    dayOfWeek: dto.dayOfWeek,
    isWorking: dto.isWorking,
    startTime: dto.startTime,
    endTime: dto.endTime,
    breaks: dto.breaks,
    overwrite: dto.overwrite,
    reason: dto.reason,
  };
};

export const mapEmployeeSchedulesDtoToEntities = (
  dto: EmployeeScheduleDto[],
): EmployeeSchedule[] => {
  return dto.map((schedule) => mapEmployeeScheduleDtoToEntity(schedule));
};
