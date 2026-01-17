import { Router } from "express";

import { Roles } from "../enums/role.enum";
import { authorizeRoles } from "../middlewares/auth.middleware";
import {
  getAdminDashboardStatsController,
  getReportOverviewController,
  getRevenueChartController,
  getServiceReportController,
  getTopEmployeesController,
} from "../controllers/report.controller";

const reportRoutes = Router();
reportRoutes.use(authorizeRoles([Roles.ADMIN]));

reportRoutes.get("/overview", getReportOverviewController);
reportRoutes.get("/dashboard/stats", getAdminDashboardStatsController);
reportRoutes.get("/employees/top", getTopEmployeesController);
reportRoutes.get("/revenue-chart", getRevenueChartController);
reportRoutes.get("/services", getServiceReportController);
export default reportRoutes;
