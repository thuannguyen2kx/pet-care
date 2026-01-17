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
import mongoose from "mongoose";

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
            ((currentRevenue - previousRevenue) / previousRevenue) * 100,
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

  async getOverviewStats(from: Date, to: Date) {
    const [bookingStats, ratingStats] = await Promise.all([
      BookingModel.aggregate([
        {
          $match: {
            createdAt: { $gte: from, $lte: to },
          },
        },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            completedBookings: {
              $sum: {
                $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
              },
            },
            totalRevenue: {
              $sum: {
                $cond: [{ $eq: ["$status", "completed"] }, "$totalPrice", 0],
              },
            },
          },
        },
      ]),
      UserModel.aggregate([
        {
          $match: {
            role: "EMPLOYEE",
            status: "ACTIVE",
            "employeeInfo.stats.rating": { $gt: 0 },
          },
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$employeeInfo.stats.rating" },
          },
        },
      ]),
    ]);

    const totalBookings = bookingStats[0]?.totalBookings ?? 0;
    const completedBookings = bookingStats[0]?.completedBookings ?? 0;
    const totalRevenue = bookingStats[0]?.totalRevenue ?? 0;

    const completionRate =
      totalBookings === 0
        ? 0
        : Number(((completedBookings / totalBookings) * 100).toFixed(1));

    return {
      totalRevenue,
      totalBookings,
      completedBookings,
      completionRate,
      averageRating: Number((ratingStats[0]?.averageRating ?? 0).toFixed(1)),
    };
  }

  async getRevenueChart({
    from,
    to,
    groupBy,
    employeeId,
  }: {
    from: Date;
    to: Date;
    groupBy: "day" | "week" | "month";
    employeeId?: string;
  }) {
    const match: any = {
      status: "completed",
      scheduledDate: {
        $gte: from,
        $lte: to,
      },
    };

    if (employeeId) {
      match.employeeId = new mongoose.Types.ObjectId(employeeId);
    }

    const dateFormatMap = {
      day: "%Y-%m-%d",
      month: "%Y-%m",
    };

    const groupStage =
      groupBy === "week"
        ? {
            $group: {
              _id: {
                year: { $isoWeekYear: "$scheduledDate" },
                week: { $isoWeek: "$scheduledDate" },
              },
              revenue: { $sum: "$totalPrice" },
              bookingCount: { $sum: 1 },
            },
          }
        : {
            $group: {
              _id: {
                $dateToString: {
                  format: dateFormatMap[groupBy],
                  date: "$scheduledDate",
                },
              },
              revenue: { $sum: "$totalPrice" },
              bookingCount: { $sum: 1 },
            },
          };

    const projectStage =
      groupBy === "week"
        ? {
            $project: {
              _id: 0,
              label: {
                $concat: [
                  { $toString: "$_id.year" },
                  "-W",
                  { $toString: "$_id.week" },
                ],
              },
              revenue: 1,
              bookingCount: 1,
            },
          }
        : {
            $project: {
              _id: 0,
              label: "$_id",
              revenue: 1,
              bookingCount: 1,
            },
          };

    const data = await BookingModel.aggregate([
      { $match: match },
      groupStage,
      { $sort: { _id: 1 } },
      projectStage,
    ]);

    const totalRevenue = data.reduce((sum, i) => sum + i.revenue, 0);

    return {
      data,
      summary: {
        totalRevenue,
      },
    };
  }

  async getServiceStats(params: {
    from: Date;
    to: Date;
    limit: number;
    employeeId?: string;
    sortBy?: "bookingCount" | "revenue";
  }) {
    const { from, to, employeeId, sortBy = "bookingCount", limit } = params;
    const sortField = sortBy === "bookingCount" ? "bookingCount" : "revenue";

    const match: any = {
      status: "completed",
      scheduledDate: {
        $gte: from,
        $lte: to,
      },
    };

    if (employeeId) {
      match.employeeId = new mongoose.Types.ObjectId(employeeId);
    }

    return BookingModel.aggregate([
      { $match: match },

      {
        $lookup: {
          from: "services",
          localField: "serviceId",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$service" },

      {
        $group: {
          _id: "$service._id",
          name: { $first: "$service.name" },
          category: { $first: "$service.category" },
          bookingCount: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },

      { $sort: { [sortField]: -1 } },
      { $limit: params.limit },
    ]);
  }

  async getCustomerStats(params: { from: Date; to: Date; limit?: number }) {
    const { from, to, limit = 5 } = params;

    /** ---------- OVERVIEW ---------- */
    const overviewAgg = await UserModel.aggregate([
      { $match: { role: Roles.CUSTOMER } },
      {
        $facet: {
          totalCustomers: [{ $count: "count" }],

          activeCustomers: [
            { $match: { status: UserStatus.ACTIVE } },
            { $count: "count" },
          ],

          newCustomers: [
            {
              $match: {
                createdAt: { $gte: from, $lte: to },
              },
            },
            { $count: "count" },
          ],

          returningCustomers: [
            {
              $match: {
                "customerInfo.stats.completedBookings": { $gte: 2 },
              },
            },
            { $count: "count" },
          ],

          behavior: [
            {
              $group: {
                _id: null,
                totalBookings: {
                  $sum: "$customerInfo.stats.totalBookings",
                },
                completedBookings: {
                  $sum: "$customerInfo.stats.completedBookings",
                },
                totalSpent: {
                  $sum: "$customerInfo.stats.totalSpent",
                },
                avgRating: {
                  $avg: "$customerInfo.stats.averageRating",
                },
              },
            },
          ],
        },
      },
    ]);

    const overviewRaw = overviewAgg[0];

    /** ---------- TOP CUSTOMERS ---------- */
    const topCustomers = await UserModel.aggregate([
      { $match: { role: "CUSTOMER" } },
      {
        $project: {
          fullName: 1,
          profilePicture: 1,
          stats: "$customerInfo.stats",
        },
      },
      {
        $facet: {
          bySpent: [{ $sort: { "stats.totalSpent": -1 } }, { $limit: limit }],
          byBookings: [
            { $sort: { "stats.completedBookings": -1 } },
            { $limit: limit },
          ],
        },
      },
    ]);

    return {
      overview: {
        totalCustomers: overviewRaw.totalCustomers[0]?.count ?? 0,
        activeCustomers: overviewRaw.activeCustomers[0]?.count ?? 0,
        newCustomers: overviewRaw.newCustomers[0]?.count ?? 0,
        returningCustomers: overviewRaw.returningCustomers[0]?.count ?? 0,

        totalBookings: overviewRaw.behavior[0]?.totalBookings ?? 0,
        completedBookings: overviewRaw.behavior[0]?.completedBookings ?? 0,
        completionRate:
          overviewRaw.behavior[0]?.totalBookings > 0
            ? overviewRaw.behavior[0].completedBookings /
              overviewRaw.behavior[0].totalBookings
            : 0,
        totalSpent: overviewRaw.behavior[0]?.totalSpent ?? 0,
        averageRating: overviewRaw.behavior[0]?.avgRating ?? 0,
      },

      topCustomers: topCustomers[0],
    };
  }
}

export const reportService = new ReportService();
