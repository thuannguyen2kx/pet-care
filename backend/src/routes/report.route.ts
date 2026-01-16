import { Router } from "express";

import { Roles } from "../enums/role.enum";
import { authorizeRoles } from "../middlewares/auth.middleware";
import {
  getAdminDashboardStatsController,
  getTopEmployeesController,
} from "../controllers/report.controller";

const reportRoutes = Router();
reportRoutes.use(authorizeRoles([Roles.ADMIN]));

reportRoutes.get("/dashboard/stats", getAdminDashboardStatsController);
reportRoutes.get("/employees/top", getTopEmployeesController);
export default reportRoutes;
