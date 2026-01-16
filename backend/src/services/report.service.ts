// services/admin-dashboard.service.ts
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns";
import UserModel from "../models/user.model";
import { Roles } from "../enums/role.enum";
import { BookingModel } from "../models/booking.model";
import ServiceModel from "../models/service.model";
import { UserStatus } from "../enums/status-user.enum";

const TOP_EMPLOYEE_SORT_MAP = {
  rating: { "employeeInfo.stats.rating": -1 },
  revenue: { "employeeInfo.stats.totalRevenue": -1 },
  completed: { "employeeInfo.stats.completedBookings": -1 },
} as const;

class ReportService {
  async getDashboardStats() {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const currentMonthStart = startOfMonth(new Date());
    const currentMonthEnd = endOfMonth(new Date());

    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

    const [
      activeEmployees,
      totalEmployees,
      todayBookings,
      activeServices,
      totalServices,
      currentMonthRevenue,
      lastMonthRevenue,
    ] = await Promise.all([
      UserModel.countDocuments({ role: Roles.EMPLOYEE, isActive: true }),
      UserModel.countDocuments({ role: Roles.EMPLOYEE }),

      BookingModel.countDocuments({
        scheduledDate: { $gte: todayStart, $lte: todayEnd },
      }),

      ServiceModel.countDocuments({ status: UserStatus.ACTIVE }),
      ServiceModel.countDocuments(),

      BookingModel.aggregate([
        {
          $match: {
            status: "completed",
            completedAt: {
              $gte: currentMonthStart,
              $lte: currentMonthEnd,
            },
          },
        },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),

      BookingModel.aggregate([
        {
          $match: {
            status: "completed",
            completedAt: {
              $gte: lastMonthStart,
              $lte: lastMonthEnd,
            },
          },
        },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
    ]);

    const currentRevenue = currentMonthRevenue[0]?.total ?? 0;
    const previousRevenue = lastMonthRevenue[0]?.total ?? 0;

    const revenueGrowthPercent =
      previousRevenue === 0
        ? null
        : Math.round(
            ((currentRevenue - previousRevenue) / previousRevenue) * 100
          );

    return {
      employees: {
        active: activeEmployees,
        total: totalEmployees,
      },

      bookings: {
        today: todayBookings,
      },

      services: {
        active: activeServices,
        total: totalServices,
      },

      revenue: {
        thisMonth: currentRevenue,
        currency: "VND",
        growthPercent: revenueGrowthPercent,
      },
    };
  }

  async getTopEmployees(params: {
    limit?: number;
    sortBy?: "rating" | "revenue" | "completed";
  }) {
    const { limit = 5, sortBy = "rating" } = params;

    return UserModel.aggregate([
      {
        $match: {
          role: Roles.EMPLOYEE,
          status: UserStatus.ACTIVE,
          employeeInfo: { $exists: true },
        },
      },
      {
        $project: {
          fullName: 1,
          profilePicture: 1,
          stats: {
            rating: "$employeeInfo.stats.rating",
            completedBookings: "$employeeInfo.stats.completedBookings",
            totalRevenue: "$employeeInfo.stats.totalRevenue",
          },
        },
      },
      {
        $sort: TOP_EMPLOYEE_SORT_MAP[sortBy],
      },
      {
        $limit: limit,
      },
    ]);
  }
}

export const reportService = new ReportService();
