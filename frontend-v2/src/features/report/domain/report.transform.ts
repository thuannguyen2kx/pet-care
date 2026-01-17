import {
  endOfDay,
  format,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  subDays,
} from 'date-fns';

import type {
  AdminDashboardStat,
  ReportCustomerStat,
  ReportOverview,
  ReportServiceStat,
  RevenueChart,
  RevenueChartPoint,
  TopEmployee,
} from '@/features/report/domain/report-entity';
import type {
  ReportCustomerResponseDto,
  RevenueChartResponseDto,
} from '@/features/report/domain/report-http-schema';
import type {
  ReportCustomersQuery,
  ReportOverviewQuery,
  ReportServicesQuery,
  RevenueChartQuery,
  TopEmployeeQuery,
} from '@/features/report/domain/report-state';
import type {
  AdminDashboardStatDto,
  ReportCustomerQueryDto,
  ReportCustomerStatDto,
  ReportOverviewDto,
  ReportOverviewQueryDto,
  ReportServicesQueryDto,
  ReportServiceStatDto,
  RevenueChartItemDto,
  RevenueChartQueryDto,
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
export const mapReportOverviewDtoToEntity = (dto: ReportOverviewDto): ReportOverview => {
  return {
    totalBookings: dto.totalBookings,
    totalRevenue: dto.totalRevenue,
    completedBookings: dto.completedBookings,
    completionRate: dto.completionRate,
    averageRating: dto.averageRating,
    changes: {
      revenue: dto.changes.revenue,
      bookings: dto.changes.bookings,
      completionRate: dto.changes.completionRate,
      averageRating: dto.changes.averageRating,
    },
  };
};
const mapRevenueChartItemDtoToEntity = (dto: RevenueChartItemDto): RevenueChartPoint => ({
  label: dto.label,
  revenue: dto.revenue,
  bookingCount: dto.bookingCount,
});

export const mapRevenueChartDtoToEntity = (dto: RevenueChartResponseDto): RevenueChart => {
  return {
    range: {
      from: new Date(dto.range.from),
      to: new Date(dto.range.to),
      groupBy: dto.range.groupBy,
    },
    points: dto.data.map(mapRevenueChartItemDtoToEntity),
    summary: {
      totalRevenue: dto.summary.totalRevenue,
    },
  };
};

export const mapReportServiceDtoToEntity = (dto: ReportServiceStatDto): ReportServiceStat => {
  return {
    id: dto._id,
    name: dto.name,
    category: dto.category,
    bookingCount: dto.bookingCount,
    revenue: dto.revenue,
    revenueInMillion: dto.revenue / 1_000_000,
  };
};

export const mapReportServicesDtoToEntities = (
  dtos: ReportServiceStatDto[],
): ReportServiceStat[] => {
  return dtos.map(mapReportServiceDtoToEntity);
};

export const mapCustomerStatDtoToEntity = (dto: ReportCustomerStatDto): ReportCustomerStat => {
  return {
    id: dto._id,
    fullName: dto.fullName,
    avatar: dto.profilePicture?.url ?? null,
    totalSpent: dto.stats.totalSpent,
    totalBookings: dto.stats.completedBookings,
    averageRating: dto.stats.averageRating,
  };
};
export const mapCustomerReportResponseDtoToEnity = (dto: ReportCustomerResponseDto) => {
  return {
    range: dto.range,
    overview: dto.data.overview,
    topCustomers: {
      bySpent: dto.data.topCustomers.bySpent.map(mapCustomerStatDtoToEntity),
      byBookings: dto.data.topCustomers.byBookings.map(mapCustomerStatDtoToEntity),
    },
  };
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
export const mapReportOverviewQueryToDto = (state: ReportOverviewQuery): ReportOverviewQueryDto => {
  return {
    timeRange: state.timeRange,
  };
};
export function mapPresetToDateRange(preset: string) {
  const now = new Date();

  switch (preset) {
    case '7d': {
      return {
        from: format(startOfDay(subDays(now, 6)), 'yyyy-MM-dd'),
        to: format(endOfDay(now), 'yyyy-MM-dd'),
      };
    }

    case '30d': {
      return {
        from: format(startOfDay(subDays(now, 29)), 'yyyy-MM-dd'),
        to: format(endOfDay(now), 'yyyy-MM-dd'),
      };
    }

    case 'quarter': {
      return {
        from: format(startOfQuarter(now), 'yyyy-MM-dd'),
        to: format(endOfDay(now), 'yyyy-MM-dd'),
      };
    }

    case 'year': {
      return {
        from: format(startOfYear(now), 'yyyy-MM-dd'),
        to: format(endOfDay(now), 'yyyy-MM-dd'),
      };
    }

    default: {
      return {
        from: format(startOfMonth(now), 'yyyy-MM-dd'),
        to: format(endOfDay(now), 'yyyy-MM-dd'),
      };
    }
  }
}
export const mapRevenueChartQueryToDto = (state: RevenueChartQuery): RevenueChartQueryDto => {
  return {
    ...mapPresetToDateRange(state.preset),
    groupBy: state.groupBy,
    employeeId: state.employeeId,
  };
};

export const mapReportServiceQueryToDto = (state: ReportServicesQuery): ReportServicesQueryDto => {
  return {
    ...mapPresetToDateRange(state.preset),
    limit: state.limit,
    employeeId: state.employeeId,
    sortBy: state.sortBy,
  };
};

export const mapReportCustomerQueryToDto = (
  state: ReportCustomersQuery,
): ReportCustomerQueryDto => {
  return {
    ...mapPresetToDateRange(state.preset),
    limit: state.limit,
  };
};
