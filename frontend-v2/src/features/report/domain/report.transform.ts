import type { AdminDashboardStat, TopEmployee } from '@/features/report/domain/report-entity';
import type { TopEmployeeQuery } from '@/features/report/domain/report-state';
import type {
  AdminDashboardStatDto,
  TopEmployeeDto,
  TopEmployeeQueryDto,
} from '@/features/report/domain/report.dto';

export const mapAdminDashboardStatDtoToEntity = (
  dto: AdminDashboardStatDto,
): AdminDashboardStat => {
  return {
    employees: {
      active: dto.employees.active,
      total: dto.employees.total,
    },
    bookings: {
      today: dto.bookings.today,
    },
    services: {
      total: dto.services.total,
      active: dto.services.active,
    },
    revenue: {
      thisMonth: dto.revenue.thisMonth,
      currency: dto.revenue.currency,
      growthPercent: dto.revenue.growthPercent,
    },
  };
};

export const mapTopEmployeeDtoToEntity = (dto: TopEmployeeDto): TopEmployee => {
  return {
    id: dto._id,
    fullName: dto.fullName,
    profilePicture: dto.profilePicture.url ?? undefined,
    stats: {
      rating: dto.stats.rating,
      completedBookings: dto.stats.completedBookings,
      totalRevenue: dto.stats.totalRevenue,
    },
  };
};

export const mapTopEmployeesDtoToEntities = (dtos: TopEmployeeDto[]): TopEmployee[] => {
  return dtos.map(mapTopEmployeeDtoToEntity);
};

//=========================
// State => DTO
//=========================
export const mapTopEmoloyeesQueryToDto = (state: TopEmployeeQuery): TopEmployeeQueryDto => {
  return {
    limit: state.limit,
    sortBy: state.sortBy,
  };
};
