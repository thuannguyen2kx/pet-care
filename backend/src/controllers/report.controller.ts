// import { Request, Response } from "express";
// import { asyncHandler } from "../middlewares/asyncHandler.middleware";
// import {
//   getReportsService,
//   getReportByIdService,
//   generateDailyReportService,
//   generateWeeklyReportService,
//   generateMonthlyReportService,
//   generateYearlyReportService,
//   getDashboardStatisticsService,
// } from "../services/report.service";
// import { HTTPSTATUS } from "../config/http.config";
// import {
//   getReportParamsSchema,
//   reportIdSchema,
//   generateReportSchema,
//   dateRangeSchema,
// } from "../validation/report.validation";

// // Get all reports with filtering
// export const getReportsController = asyncHandler(
//   async (req: Request, res: Response) => {
//     const filters = getReportParamsSchema.parse(req.query);
//     const { reports, totalCount, pagination } = await getReportsService(
//       filters
//     );

//     return res.status(HTTPSTATUS.OK).json({
//       message: "Lấy danh sách báo cáo thành công",
//       reports,
//       meta: {
//         total: totalCount,
//         pagination,
//       },
//     });
//   }
// );

// // Get report by ID
// export const getReportByIdController = asyncHandler(
//   async (req: Request, res: Response) => {
//     const reportId = reportIdSchema.parse(req.params.id);
//     const { report } = await getReportByIdService(reportId);

//     return res.status(HTTPSTATUS.OK).json({
//       message: "Lấy báo cáo thành công",
//       report,
//     });
//   }
// );

// // Generate daily report
// export const generateDailyReportController = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { date } = generateReportSchema.parse(req.body);
//     const { report } = await generateDailyReportService(date);

//     return res.status(HTTPSTATUS.CREATED).json({
//       message: "Tạo báo cáo ngày thành công",
//       report,
//     });
//   }
// );

// // Generate weekly report
// export const generateWeeklyReportController = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { date } = generateReportSchema.parse(req.body);
//     const { report } = await generateWeeklyReportService(date);

//     return res.status(HTTPSTATUS.CREATED).json({
//       message: "Tạo báo cáo tuần thành công",
//       report,
//     });
//   }
// );

// // Generate monthly report
// export const generateMonthlyReportController = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { date } = generateReportSchema.parse(req.body);
//     const { report } = await generateMonthlyReportService(date);

//     return res.status(HTTPSTATUS.CREATED).json({
//       message: "Tạo báo cáo tháng thành công",
//       report,
//     });
//   }
// );

// // Generate yearly report
// export const generateYearlyReportController = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { date } = generateReportSchema.parse(req.body);
//     const { report } = await generateYearlyReportService(date);

//     return res.status(HTTPSTATUS.CREATED).json({
//       message: "Tạo báo cáo năm thành công",
//       report,
//     });
//   }
// );

// // Get dashboard statistics for overview
// export const getDashboardStatisticsController = asyncHandler(
//   async (req: Request, res: Response) => {
//     const statistics = await getDashboardStatisticsService();

//     return res.status(HTTPSTATUS.OK).json({
//       message: "Lấy thống kê tổng quan thành công",
//       statistics,
//     });
//   }
// );
