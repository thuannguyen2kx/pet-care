import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { reportService } from "../services/report.service";
import {
  calcChange,
  parseDateOnly,
  resolveDateRange,
} from "../utils/format-date";
import { BadRequestException } from "../utils/app-error";

export const getAdminDashboardStatsController = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await reportService.getDashboardStats();

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy thống kê dashboard admin thành công",
      data: stats,
    });
  },
);

export const getTopEmployeesController = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 4;
    const sortBy =
      (req.query.sortBy as "rating" | "revenue" | "completed") || "rating";

    const employees = await reportService.getTopEmployees({
      limit,
      sortBy,
    });

    res.json({
      data: employees,
    });
  },
);

export const getReportOverviewController = asyncHandler(
  async (req: Request, res: Response) => {
    const timeRange = String(req.query.timeRange || "month");

    const { from, to } = resolveDateRange(timeRange);

    const diffMs = to.getTime() - from.getTime();
    const prevFrom = new Date(from.getTime() - diffMs);
    const prevTo = from;

    const [current, previous] = await Promise.all([
      reportService.getOverviewStats(from, to),
      reportService.getOverviewStats(prevFrom, prevTo),
    ]);

    res.status(HTTPSTATUS.OK).json({
      data: {
        ...current,
        changes: {
          revenue: calcChange(current.totalRevenue, previous.totalRevenue),
          bookings: calcChange(current.totalBookings, previous.totalBookings),
          completionRate: calcChange(
            current.completionRate,
            previous.completionRate,
          ),
          averageRating: current.averageRating - previous.averageRating,
        },
      },
    });
  },
);
export const getRevenueChartController = asyncHandler(
  async (req: Request, res: Response) => {
    const { from, to, groupBy = "day", employeeId } = req.query as any;

    const result = await reportService.getRevenueChart({
      from: parseDateOnly(from),
      to: parseDateOnly(to),
      groupBy,
      employeeId,
    });

    res.json({
      range: { from, to, groupBy },
      ...result,
    });
  },
);

export const getServiceReportController = asyncHandler(
  async (req: Request, res: Response) => {
    const { from, to, limit = 5, employeeId, sortBy } = req.query;

    if (!from || !to) {
      throw new BadRequestException("from & to are required");
    }

    const data = await reportService.getServiceStats({
      from: parseDateOnly(String(from)),
      to: parseDateOnly(String(to)),
      limit: Number(limit),
      employeeId: employeeId ? String(employeeId) : undefined,
      sortBy: sortBy as "bookingCount" | "revenue",
    });

    res.status(HTTPSTATUS.OK).json({
      range: { from, to },
      data,
    });
  },
);

export const getCustomerReportController = asyncHandler(
  async (req: Request, res: Response) => {
    const { from, to, limit } = req.query;

    const fromDate = parseDateOnly(from as string);
    const toDate = parseDateOnly(to as string);

    const data = await reportService.getCustomerStats({
      from: fromDate,
      to: toDate,
      limit: Number(limit) || 5,
    });

    res.json({
      range: { from, to },
      data,
    });
  },
);
