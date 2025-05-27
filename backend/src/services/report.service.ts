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

export const getWeeklyDataService = async (startDate?: Date, endDate?: Date) => {
  const today = new Date();
  const weekStart = startDate || startOfWeek(today, { locale: vi });
  const weekEnd = endDate || endOfWeek(today, { locale: vi });
  
  // Lấy dữ liệu lịch hẹn và doanh thu theo ngày trong tuần
  const [weeklyAppointments, weeklyRevenue] = await Promise.all([
    // Lịch hẹn theo ngày trong tuần
    AppointmentModel.aggregate([
      {
        $match: {
          scheduledDate: { 
            $gte: weekStart, 
            $lte: weekEnd 
          }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: '$scheduledDate' }, // 1 = Chủ nhật, 2 = Thứ 2, ..., 7 = Thứ 7
          count: { $sum: 1 },
          amount: { 
            $sum: '$totalAmount'
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]),
    
    // Doanh thu theo ngày trong tuần
    PaymentModel.aggregate([
      {
        $match: {
          createdAt: { 
            $gte: weekStart, 
            $lte: weekEnd 
          },
          status: PaymentStatusEnum.COMPLETED
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: '$scheduledDate' },
          amount: { $sum: '$amount' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ])
  ]);

  // Ánh xạ từ số thứ tự ngày trong tuần sang tên ngày
  const dayMapping = {
    1: 'T2', 2: 'T3', 3: 'T4', 4: 'T5', 5: 'T6', 6: 'T7', 7: 'CN'
  };
  
  // Tạo mảng kết quả chứa dữ liệu cho tất cả các ngày trong tuần
  const weeklyData = Array.from({ length: 7 }, (_, i) => ({
    day: dayMapping[i + 1 as keyof typeof dayMapping],
    count: 0,
    amount: 0
  }));
  
  // Điền dữ liệu từ kết quả truy vấn
  weeklyAppointments.forEach(day => {
    const index = day._id - 1;
    if (index >= 0 && index < 7) {
      weeklyData[index].count = day.count;
      // Nếu amount từ appointment không có trong query, giữ nguyên giá trị 0
      if (day.amount) {
        weeklyData[index].amount = day.amount;
      }
    }
  });

  // Cập nhật doanh thu từ payments (ưu tiên data này vì chính xác hơn)
  weeklyRevenue.forEach(day => {
    const index = day._id - 1;
    if (index >= 0 && index < 7) {
      weeklyData[index].amount = day.amount;
    }
  });
  
  return { weeklyData };
};

/**
 * Lấy dữ liệu doanh thu và lịch hẹn theo tháng trong năm
 */
export const getMonthlyTrendService = async (year?: number) => {
  const currentYear = year || new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1); // Tháng 1
  const endOfYear = new Date(currentYear, 11, 31); // Tháng 12
  
  // Lấy dữ liệu lịch hẹn và doanh thu theo tháng
  const [monthlyAppointments, monthlyRevenue] = await Promise.all([
    // Lịch hẹn theo tháng
    AppointmentModel.aggregate([
      {
        $match: {
          scheduledDate: { 
            $gte: startOfYear, 
            $lte: endOfYear 
          }
        }
      },
      {
        $group: {
          _id: { $month: '$scheduledDate' }, // 1 = Tháng 1, 2 = Tháng 2, ...
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]),
    
    // Doanh thu theo tháng
    PaymentModel.aggregate([
      {
        $match: {
          createdAt: { 
            $gte: startOfYear, 
            $lte: endOfYear 
          },
          status: PaymentStatusEnum.COMPLETED
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$amount' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ])
  ]);

  // Tạo mảng kết quả chứa dữ liệu cho tất cả các tháng
  const monthlyTrendData = Array.from({ length: 12 }, (_, i) => {
    // Tạo tên tháng hiển thị (locale vi)
    const date = new Date(currentYear, i, 1);
    const month = date.toLocaleDateString('vi-VN', { month: 'short' });
    
    return {
      month,
      revenue: 0,
      appointments: 0
    };
  });
  
  // Điền dữ liệu từ kết quả truy vấn
  monthlyAppointments.forEach(month => {
    const index = month._id - 1; // Chuyển từ 1-12 sang 0-11 cho index mảng
    if (index >= 0 && index < 12) {
      monthlyTrendData[index].appointments = month.count;
    }
  });
  
  monthlyRevenue.forEach(month => {
    const index = month._id - 1;
    if (index >= 0 && index < 12) {
      monthlyTrendData[index].revenue = month.revenue;
    }
  });
  
  return { monthlyTrendData };
};

// Lấy thống kê tổng quan cho dashboard
export const getDashboardStatisticsService = async () => {
  const today = new Date();
  const thisMonth = startOfMonth(today);
  const lastMonth = startOfMonth(new Date(today.getFullYear(), today.getMonth() - 1));
  
  // Thống kê tháng hiện tại
  const [
    totalAppointments,
    completedAppointments,
    revenueAggregate,
    serviceBreakdown,
    employeePerformance,
    appointmentStatusCounts,
    customerStats,
    weeklyData,
    monthlyTrendData
  ] = await Promise.all([
    // Tổng số lịch hẹn tháng này
    AppointmentModel.countDocuments({
      scheduledDate: { $gte: thisMonth, $lte: today }
    }),
    
    // Số lịch hẹn hoàn thành
    AppointmentModel.countDocuments({
      scheduledDate: { $gte: thisMonth, $lte: today },
      status: AppointmentStatus.COMPLETED
    }),
    
    // Tổng doanh thu tháng này - FIX: Join với appointment để đảm bảo chỉ lấy payment của tháng này
    PaymentModel.aggregate([
      {
        $lookup: {
          from: 'appointments',
          localField: 'appointmentId',
          foreignField: '_id',
          as: 'appointment'
        }
      },
      {
        $unwind: '$appointment'
      },
      {
        $match: {
          'appointment.scheduledDate': { $gte: thisMonth, $lte: today },
          status: PaymentStatusEnum.COMPLETED
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]),
    
    // Phân tích dịch vụ - FIX: Thêm error handling cho lookup
    AppointmentModel.aggregate([
      {
        $match: {
          scheduledDate: { $gte: thisMonth, $lte: today }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: 'serviceId',
          foreignField: '_id',
          as: 'service'
        }
      },
      {
        $addFields: {
          service: {
            $cond: {
              if: { $eq: [{ $size: '$service' }, 0] },
              then: { name: 'Unknown Service' },
              else: { $arrayElemAt: ['$service', 0] }
            }
          }
        }
      },
      {
        $group: {
          _id: '$serviceId',
          serviceName: { $first: '$service.name' },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
          completedCount: {
            $sum: {
              $cond: [{ $eq: ['$status', AppointmentStatus.COMPLETED] }, 1, 0]
            }
          },
          cancelledCount: {
            $sum: {
              $cond: [{ $eq: ['$status', AppointmentStatus.CANCELLED] }, 1, 0]
            }
          },
          pendingCount: {
            $sum: {
              $cond: [{ $eq: ['$status', AppointmentStatus.PENDING] }, 1, 0]
            }
          },
          confirmedCount: {
            $sum: {
              $cond: [{ $eq: ['$status', AppointmentStatus.CONFIRMED] }, 1, 0]
            }
          },
          inProgressCount: {
            $sum: {
              $cond: [{ $eq: ['$status', AppointmentStatus.IN_PROGRESS] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          serviceId: '$_id',
          serviceName: 1,
          count: 1,
          revenue: 1,
          completedCount: 1,
          cancelledCount: 1,
          pendingCount: 1,
          confirmedCount: 1,
          inProgressCount: 1,
          completionRate: {
            $cond: {
              if: { $eq: ['$count', 0] },
              then: 0,
              else: { $multiply: [{ $divide: ['$completedCount', '$count'] }, 100] }
            }
          }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]),
    
    // Hiệu suất nhân viên - FIX: Thêm error handling cho lookup
    AppointmentModel.aggregate([
      {
        $match: {
          scheduledDate: { $gte: thisMonth, $lte: today },
          employeeId: { $exists: true, $ne: null }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee'
        }
      },
      {
        $addFields: {
          employee: {
            $cond: {
              if: { $eq: [{ $size: '$employee' }, 0] },
              then: { fullName: 'Unknown Employee' },
              else: { $arrayElemAt: ['$employee', 0] }
            }
          }
        }
      },
      {
        $group: {
          _id: '$employeeId',
          employeeName: { $first: '$employee.fullName' },
          totalAppointments: { $sum: 1 },
          completedAppointments: {
            $sum: {
              $cond: [{ $eq: ['$status', AppointmentStatus.COMPLETED] }, 1, 0]
            }
          },
          cancelledAppointments: {
            $sum: {
              $cond: [{ $eq: ['$status', AppointmentStatus.CANCELLED] }, 1, 0]
            }
          },
          pendingAppointments: {
            $sum: {
              $cond: [{ $eq: ['$status', AppointmentStatus.PENDING] }, 1, 0]
            }
          },
          revenue: {
            $sum: {
              $cond: [{ $eq: ['$status', AppointmentStatus.COMPLETED] }, '$totalAmount', 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          employeeId: '$_id',
          employeeName: 1,
          totalAppointments: 1,
          completedAppointments: 1,
          cancelledAppointments: 1,
          pendingAppointments: 1,
          revenue: 1,
          completionRate: {
            $cond: {
              if: { $eq: ['$totalAppointments', 0] },
              then: 0,
              else: { $multiply: [{ $divide: ['$completedAppointments', '$totalAppointments'] }, 100] }
            }
          }
        }
      },
      {
        $sort: { totalAppointments: -1 }
      }
    ]),
    
    // Số lượng theo trạng thái lịch hẹn - FIX: Đảm bảo có đầy đủ các status
    AppointmentModel.aggregate([
      {
        $match: {
          scheduledDate: { $gte: thisMonth, $lte: today }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]),
    
    // Thống kê khách hàng - FIX: Sử dụng cách gọi đúng
    (async () => {
      const [totalCustomers, newCustomers, recurringCustomersResult] = await Promise.all([
        // Tổng số khách hàng
        UserModel.countDocuments({
          role: Roles.CUSTOMER,
          createdAt: { $lte: today }
        }),
        // Khách hàng mới
        UserModel.countDocuments({
          role: Roles.CUSTOMER,
          createdAt: { $gte: thisMonth, $lte: today }
        }),
        // Khách hàng quay lại (có nhiều hơn 1 lịch hẹn)
        AppointmentModel.aggregate([
          {
            $match: {
              scheduledDate: { $gte: thisMonth, $lte: today }
            }
          },
          {
            $group: {
              _id: '$customerId',
              count: { $sum: 1 }
            }
          },
          {
            $match: {
              count: { $gt: 1 }
            }
          },
          {
            $count: 'recurring'
          }
        ])
      ]);
      
      return {
        total: totalCustomers,
        new: newCustomers,
        recurring: recurringCustomersResult.length > 0 ? recurringCustomersResult[0].recurring : 0
      };
    })(),
    
    // Dữ liệu theo tuần
    getWeeklyDataService().then(result => result.weeklyData).catch(() => []),
    
    // Dữ liệu xu hướng theo tháng
    getMonthlyTrendService().then(result => result.monthlyTrendData).catch(() => [])
  ]);
  
  // Thống kê tháng trước để so sánh - FIX: Cải thiện query cho payment
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
    
    // Tổng doanh thu tháng trước - FIX: Join với appointment
    PaymentModel.aggregate([
      {
        $lookup: {
          from: 'appointments',
          localField: 'appointmentId',
          foreignField: '_id',
          as: 'appointment'
        }
      },
      {
        $unwind: '$appointment'
      },
      {
        $match: {
          'appointment.scheduledDate': { $gte: lastMonth, $lt: thisMonth },
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
  
  // FIX: Xử lý dữ liệu lịch hẹn theo trạng thái một cách đúng đắn
  const statusCounts = {
    total: totalAppointments,
    completed: completedAppointments,
    cancelled: 0,
    pending: 0,
    confirmed: 0,
    inProgress: 0
  };
  
  // Map tất cả các status từ aggregate result
  appointmentStatusCounts.forEach(statusCount => {
    const status = statusCount._id;
    switch(status) {
      case AppointmentStatus.COMPLETED:
        statusCounts.completed = statusCount.count;
        break;
      case AppointmentStatus.CANCELLED:
        statusCounts.cancelled = statusCount.count;
        break;
      case AppointmentStatus.PENDING:
        statusCounts.pending = statusCount.count;
        break;
      case AppointmentStatus.CONFIRMED:
        statusCounts.confirmed = statusCount.count;
        break;
      case AppointmentStatus.IN_PROGRESS:
        statusCounts.inProgress = statusCount.count;
        break;
    }
  });
  
  // FIX: customerStats đã được xử lý trong Promise.all ở trên
  const customers = customerStats;
  
  // Helper function để tính toán phần trăm thay đổi
  const calculatePercentChange = (oldValue: number, newValue: number): number => {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / oldValue * 100);
  };
  
  // Tạo đối tượng phản hồi
  return {
    currentMonth: {
      totalAppointments,
      completedAppointments,
      revenue: revenueAggregate.length > 0 ? revenueAggregate[0].total : 0,
      appointments: statusCounts,
      serviceBreakdown: serviceBreakdown || [],
      employeePerformance: employeePerformance || [],
      customers,
      weeklyData: weeklyData || [], 
      monthlyTrendData: monthlyTrendData || [],
      period: {
        start: thisMonth,
        end: today
      }
    },
    previousMonth: {
      totalAppointments: previousMonthStats[0],
      completedAppointments: previousMonthStats[1],
      revenue: previousMonthStats[2].length > 0 ? previousMonthStats[2][0].total : 0
    },
    changes: {
      appointmentsGrowth: calculatePercentChange(
        previousMonthStats[0],
        totalAppointments
      ),
      completionRateChange: calculatePercentChange(
        previousMonthStats[1] / (previousMonthStats[0] || 1),
        completedAppointments / (totalAppointments || 1)
      ),
      revenueGrowth: calculatePercentChange(
        previousMonthStats[2].length > 0 ? previousMonthStats[2][0].total : 0,
        revenueAggregate.length > 0 ? revenueAggregate[0].total : 0
      )
    }
  };
};

// Helper để tính phần trăm thay đổi
function calculatePercentChange(previous: number, current: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}