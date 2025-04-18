import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { vi } from 'date-fns/locale';
import ReportModel, { IEmployeePerformance, IReportMetrics, IServiceBreakdown } from "../models/report.model";
import AppointmentModel, { AppointmentStatus, ServiceType } from "../models/appointment.model";
import UserModel from "../models/user.model";
import PaymentModel from "../models/payment.model";
import { PaymentStatusEnum } from "../enums/payment.enum";
import { NotFoundException, BadRequestException } from "../utils/app-error";
import { Types } from "mongoose";
import { Roles } from '../enums/role.enum';

// Interface for report filters
interface ReportFilters {
  reportType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

// Get all reports with filtering
export const getReportsService = async (filters: ReportFilters) => {
  const { 
    reportType, 
    startDate, 
    endDate, 
    page = 1, 
    limit = 10 
  } = filters;

  const query: any = {};
  
  if (reportType) {
    query.reportType = reportType;
  }
  
  if (startDate || endDate) {
    query.period = {};
    
    if (startDate) {
      query.period.start = { $gte: startDate };
    }
    
    if (endDate) {
      query.period.end = { $lte: endDate };
    }
  }

  const skip = (page - 1) * limit;
  
  const [reports, totalCount] = await Promise.all([
    ReportModel.find(query)
      .sort({ 'period.start': -1 })
      .skip(skip)
      .limit(limit),
    ReportModel.countDocuments(query)
  ]);

  return { reports, totalCount, pagination: {
    total: totalCount,
    page,
    limit,
    pages: Math.ceil(totalCount / limit)
  } };
};

// Get report by ID
export const getReportByIdService = async (reportId: string) => {
  const report = await ReportModel.findById(reportId);
  
  if (!report) {
    throw new NotFoundException("Không tìm thấy báo cáo");
  }
  
  return { report };
};

// Helper function to calculate metrics for a given time period
const calculateMetrics = async (startDate: Date, endDate: Date): Promise<IReportMetrics> => {
  // Get all appointments in the date range with populated fields
  const appointments = await AppointmentModel.find({
    scheduledDate: { $gte: startDate, $lte: endDate }
  })
    .populate<{ 
      serviceId: { 
        _id: Types.ObjectId; 
        name: string; 
        price: number 
      } 
    }>('serviceId', 'name price')
    .populate<{ 
      employeeId: { 
        _id: Types.ObjectId; 
        fullName: string; 
        employeeInfo: any 
      } | null 
    }>('employeeId', 'fullName employeeInfo')
    .populate<{ 
      customerId: { 
        _id: Types.ObjectId; 
        fullName: string; 
        email: string 
      } 
    }>('customerId', 'fullName email');

  if (!appointments.length) {
    throw new BadRequestException("Không tìm thấy lịch hẹn nào trong khoảng thời gian đã chọn");
  }

  // Get all payments in the date range
  const payments = await PaymentModel.find({
    createdAt: { $gte: startDate, $lte: endDate }
  });

  // Calculate basic metrics
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === AppointmentStatus.COMPLETED).length;
  const cancelledAppointments = appointments.filter(a => a.status === AppointmentStatus.CANCELLED).length;
  const pendingAppointments = appointments.filter(a => a.status === AppointmentStatus.PENDING).length;
  const confirmedAppointments = appointments.filter(a => a.status === AppointmentStatus.CONFIRMED).length;
  const inProgressAppointments = appointments.filter(a => a.status === AppointmentStatus.IN_PROGRESS).length;
  
  // Calculate total revenue from payments
  const totalRevenue = payments
    .filter(p => p.status === PaymentStatusEnum.COMPLETED)
    .reduce((sum, p) => sum + p.amount, 0);

  // Calculate average amount per appointment
  const avgAppointmentValue = completedAppointments > 0 
    ? totalRevenue / completedAppointments 
    : 0;

  // Calculate payment status distribution
  const paymentStatusCount = {
    pending: payments.filter(p => p.status === PaymentStatusEnum.PENDING).length,
    completed: payments.filter(p => p.status === PaymentStatusEnum.COMPLETED).length,
    failed: payments.filter(p => p.status === PaymentStatusEnum.FAILED).length,
    refunded: payments.filter(p => p.status === PaymentStatusEnum.REFUNDED).length,
  };

  // Calculate service breakdown
  const serviceMap = new Map<string, IServiceBreakdown>();
  
  for (const appointment of appointments) {
    // Kiểm tra dịch vụ có tồn tại
    if (appointment.serviceId) {
      const serviceId = appointment.serviceId._id.toString();
      const serviceName = appointment.serviceId.name || 'Dịch vụ không xác định';
      const serviceAmount = appointment.totalAmount || 0;
      
      if (!serviceMap.has(serviceId)) {
        serviceMap.set(serviceId, {
          serviceId: new Types.ObjectId(serviceId),
          serviceName,
          count: 0,
          revenue: 0,
          completedCount: 0,
          cancelledCount: 0
        });
      }
      
      const service = serviceMap.get(serviceId)!;
      service.count += 1;
      
      // Count by status
      if (appointment.status === AppointmentStatus.COMPLETED) {
        service.completedCount += 1;
        service.revenue += serviceAmount;
      } else if (appointment.status === AppointmentStatus.CANCELLED) {
        service.cancelledCount += 1;
      }
    }
  }
  
  const serviceBreakdown = Array.from(serviceMap.values());

  // Calculate employee performance
  const employeeMap = new Map<string, IEmployeePerformance>();
  
  for (const appointment of appointments) {
    // Kiểm tra xem có nhân viên được phân công không 
    if (appointment.employeeId) {
      const employeeId = appointment.employeeId._id.toString();
      const employeeName = appointment.employeeId.fullName || 'Nhân viên không xác định';
      
      if (!employeeMap.has(employeeId)) {
        employeeMap.set(employeeId, {
          employeeId: new Types.ObjectId(employeeId),
          employeeName,
          totalAppointments: 0,
          completedAppointments: 0,
          cancelledAppointments: 0,
          revenue: 0
        });
      }
      
      const employee = employeeMap.get(employeeId)!;
      employee.totalAppointments += 1;
      
      if (appointment.status === AppointmentStatus.COMPLETED) {
        employee.completedAppointments += 1;
        employee.revenue += appointment.totalAmount || 0;
      } else if (appointment.status === AppointmentStatus.CANCELLED) {
        employee.cancelledAppointments += 1;
      }
    }
  }
  
  const employeePerformance = Array.from(employeeMap.values());

  // Get customer metrics
  const customerIds = [...new Set(appointments.map(a => a.customerId?._id?.toString()))];
  const newCustomersCount = await UserModel.countDocuments({
    _id: { $in: customerIds },
    createdAt: { $gte: startDate, $lte: endDate },
    role: Roles.CUSTOMER
  });

  const customerAppointmentCounts = appointments.reduce((acc, appointment) => {
    const customerId = appointment.customerId?._id?.toString();
    if (customerId) {
      acc[customerId] = (acc[customerId] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const recurringCustomersCount = Object.values(customerAppointmentCounts).filter(count => count > 1).length;

  return {
    period: {
      start: startDate,
      end: endDate
    },
    appointments: {
      total: totalAppointments,
      completed: completedAppointments,
      cancelled: cancelledAppointments,
      pending: pendingAppointments,
      confirmed: confirmedAppointments,
      inProgress: inProgressAppointments
    },
    revenue: {
      total: totalRevenue,
      avgPerAppointment: avgAppointmentValue
    },
    payments: paymentStatusCount,
    serviceBreakdown,
    employeePerformance,
    customers: {
      total: customerIds.length,
      new: newCustomersCount,
      recurring: recurringCustomersCount
    }
  };
};

// Generate daily report
export const generateDailyReportService = async (date: Date) => {
  const start = startOfDay(date);
  const end = endOfDay(date);
  
  // Check if report already exists
  const existingReport = await ReportModel.findOne({
    reportType: 'daily',
    'period.start': start,
    'period.end': end
  });
  
  if (existingReport) {
    return { report: existingReport };
  }
  
  // Calculate metrics
  const metrics = await calculateMetrics(start, end);
  
  // Create new report
  const report = await ReportModel.create({
    reportType: 'daily',
    period: {
      start,
      end
    },
    metrics
  });
  
  return { report };
};

// Generate weekly report
export const generateWeeklyReportService = async (startDate: Date) => {
  const start = startOfWeek(startDate, { locale: vi }); // Monday as start of week
  const end = endOfWeek(startDate, { locale: vi });
  
  // Check if report already exists
  const existingReport = await ReportModel.findOne({
    reportType: 'weekly',
    'period.start': start,
    'period.end': end
  });
  
  if (existingReport) {
    return { report: existingReport };
  }
  
  // Calculate metrics
  const metrics = await calculateMetrics(start, end);
  
  // Create new report
  const report = await ReportModel.create({
    reportType: 'weekly',
    period: {
      start,
      end
    },
    metrics
  });
  
  return { report };
};

// Generate monthly report
export const generateMonthlyReportService = async (startDate: Date) => {
  const start = startOfMonth(startDate);
  const end = endOfMonth(startDate);
  
  // Check if report already exists
  const existingReport = await ReportModel.findOne({
    reportType: 'monthly',
    'period.start': start,
    'period.end': end
  });
  
  if (existingReport) {
    return { report: existingReport };
  }
  
  // Calculate metrics
  const metrics = await calculateMetrics(start, end);
  
  // Create new report
  const report = await ReportModel.create({
    reportType: 'monthly',
    period: {
      start,
      end
    },
    metrics
  });
  
  return { report };
};

// Generate yearly report
export const generateYearlyReportService = async (startDate: Date) => {
  const start = startOfYear(startDate);
  const end = endOfYear(startDate);
  
  // Check if report already exists
  const existingReport = await ReportModel.findOne({
    reportType: 'yearly',
    'period.start': start,
    'period.end': end
  });
  
  if (existingReport) {
    return { report: existingReport };
  }
  
  // Calculate metrics
  const metrics = await calculateMetrics(start, end);
  
  // Create new report
  const report = await ReportModel.create({
    reportType: 'yearly',
    period: {
      start,
      end
    },
    metrics
  });
  
  return { report };
};

// Lấy thống kê tổng quan cho dashboard
export const getDashboardStatisticsService = async () => {
  const today = new Date();
  const thisMonth = startOfMonth(today);
  const lastMonth = startOfMonth(new Date(today.getFullYear(), today.getMonth() - 1));
  
  // Thống kê tháng hiện tại
  const currentMonthStats = await Promise.all([
    // Tổng số lịch hẹn tháng này
    AppointmentModel.countDocuments({
      scheduledDate: { $gte: thisMonth, $lte: today }
    }),
    
    // Số lịch hẹn hoàn thành
    AppointmentModel.countDocuments({
      scheduledDate: { $gte: thisMonth, $lte: today },
      status: AppointmentStatus.COMPLETED
    }),
    
    // Tổng doanh thu tháng này
    PaymentModel.aggregate([
      {
        $match: {
          createdAt: { $gte: thisMonth, $lte: today },
          status: PaymentStatusEnum.COMPLETED
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ])
  ]);
  
  // Thống kê tháng trước để so sánh
  const previousMonthStats = await Promise.all([
    // Tổng số lịch hẹn tháng trước
    AppointmentModel.countDocuments({
      scheduledDate: { $gte: lastMonth, $lt: thisMonth }
    }),
    
    // Số lịch hẹn hoàn thành tháng trước
    AppointmentModel.countDocuments({
      scheduledDate: { $gte: lastMonth, $lt: thisMonth },
      status: AppointmentStatus.COMPLETED
    }),
    
    // Tổng doanh thu tháng trước
    PaymentModel.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonth, $lt: thisMonth },
          status: PaymentStatusEnum.COMPLETED
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ])
  ]);
  
  // Tạo đối tượng phản hồi
  return {
    currentMonth: {
      totalAppointments: currentMonthStats[0],
      completedAppointments: currentMonthStats[1],
      revenue: currentMonthStats[2].length > 0 ? currentMonthStats[2][0].total : 0
    },
    previousMonth: {
      totalAppointments: previousMonthStats[0],
      completedAppointments: previousMonthStats[1],
      revenue: previousMonthStats[2].length > 0 ? previousMonthStats[2][0].total : 0
    },
    changes: {
      appointmentsGrowth: calculatePercentChange(
        previousMonthStats[0],
        currentMonthStats[0]
      ),
      completionRateChange: calculatePercentChange(
        previousMonthStats[1] / (previousMonthStats[0] || 1),
        currentMonthStats[1] / (currentMonthStats[0] || 1)
      ),
      revenueGrowth: calculatePercentChange(
        previousMonthStats[2].length > 0 ? previousMonthStats[2][0].total : 0,
        currentMonthStats[2].length > 0 ? currentMonthStats[2][0].total : 0
      )
    }
  };
};

// Helper để tính phần trăm thay đổi
function calculatePercentChange(previous: number, current: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}