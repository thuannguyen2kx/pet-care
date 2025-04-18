// src/routes/report.routes.ts

import { Router } from 'express';
import { 
  getReportsController,
  getReportByIdController,
  generateDailyReportController,
  generateWeeklyReportController,
  generateMonthlyReportController,
  generateYearlyReportController,
  getDashboardStatisticsController
} from '../controllers/report.controller';
import { Roles } from '../enums/role.enum';
import { authorizeRoles } from '../middlewares/auth.middleware';

const reportRoutes = Router();
reportRoutes.use(authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]));
// Routes để lấy danh sách báo cáo và báo cáo chi tiết
reportRoutes.get('/', getReportsController);
reportRoutes.get('/dashboard-statistics', getDashboardStatisticsController);
reportRoutes.get('/:id', getReportByIdController);

// Routes để tạo báo cáo
reportRoutes.post('/daily', generateDailyReportController);
reportRoutes.post('/weekly', generateWeeklyReportController);
reportRoutes.post('/monthly', generateMonthlyReportController);
reportRoutes.post('/yearly', generateYearlyReportController);

export default reportRoutes;