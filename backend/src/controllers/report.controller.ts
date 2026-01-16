import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { reportService } from "../services/report.service";

export const getAdminDashboardStatsController = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await reportService.getDashboardStats();

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy thống kê dashboard admin thành công",
      data: stats,
    });
  }
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
  }
);
