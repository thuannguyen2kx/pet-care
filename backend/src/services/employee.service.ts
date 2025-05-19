import { SpecialtyType } from "../enums/employee.enum";
import { Roles } from "../enums/role.enum";
import { StatusUser, StatusUserType } from "../enums/status-user.enum";
import UserModel from "../models/user.model";
import AppointmentModel, {
  AppointmentStatus,
  ServiceType,
} from "../models/appointment.model";
import ServiceModel from "../models/service.model";
import PetModel from "../models/pet.model";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import emailService from "../utils/send-email";
import { deleteFile } from "../utils/file-uploade";
import { hashValue } from "../utils/bcrypt";
import mongoose from "mongoose";
import ServicePackageModel from "../models/service-package.model";
import { dateUtils } from "../utils/date-fns";
import TimeSlotModel from "../models/time-slot.model";
import AccountModel from "../models/account.model";
import { ProviderEnum } from "../enums/account-provider.enum";
import EmployeeScheduleModel, { EmployeeScheduleDocument } from "../models/employee-schedule.model";

// Get all employees with optional filtering
export const getAllEmployeesService = async (filters: {
  status?: StatusUserType;
  specialty?: string[];
}) => {
  const { status, specialty } = filters;

  const filter: any = {
    role: Roles.EMPLOYEE,
  };

  if (status) {
    filter.status = status;
  }

  if (specialty) {
    filter["employeeInfo.specialties"] = { $in: specialty };
  }

  const employees = await UserModel.find(filter)
    .select("-password")
    .sort({ fullName: -1 });

  return { employees };
};

// Get employee by ID
export const getEmployeeByIdService = async (employeeId: string) => {
  const employee = await UserModel.findOne({
    _id: employeeId,
    role: Roles.EMPLOYEE,
  }).select("-password");

  if (!employee) {
    throw new NotFoundException("Không tìm thấy nhân viên");
  }

  return { employee };
};
interface AvailableEmployeesParams {
  serviceId: string;
  serviceType: ServiceType;
  timeSlot?: string;
  date?: string;
}

export const getAvailableEmployeesForServiceService = async ({
  serviceId,
  serviceType,
  timeSlot,
  date,
}: AvailableEmployeesParams) => {
  // Biến để lưu trữ các specialties cần thiết cho dịch vụ
  let requiredSpecialties: string[] = [];

  // Lấy thông tin dịch vụ và các specialties cần thiết
  if (serviceType === ServiceType.SINGLE) {
    const service = await ServiceModel.findById(serviceId);
    if (!service) {
      throw new NotFoundException("Không tìm thấy dịch vụ");
    }

    if (service.category) {
      requiredSpecialties.push(service.category);
    }
  } else if (serviceType === ServiceType.PACKAGE) {
    const servicePackage = await ServicePackageModel.findById(serviceId);
    if (!servicePackage) {
      throw new NotFoundException("Không tìm thấy gói dịch vụ");
    }

    if (servicePackage.specialties && servicePackage.specialties.length > 0) {
      requiredSpecialties = servicePackage.specialties;
    }
  } else {
    throw new BadRequestException("Loại dịch vụ không hợp lệ");
  }

  // Truy vấn cơ bản để lấy nhân viên có chuyên môn phù hợp và đang hoạt động
  let query: any = {
    role: Roles.EMPLOYEE,
    status: StatusUser.ACTIVE,
  };

  // Chỉ lọc theo chuyên môn nếu có yêu cầu chuyên môn
  if (requiredSpecialties.length > 0) {
    query = {
      ...query,
      "employeeInfo.specialties": { $in: requiredSpecialties },
    };
  }

  // Mảng chứa id của các nhân viên khả dụng (khi lọc theo timeSlot)
  let availableEmployeeIds: string[] = [];

  // Nếu có tham số timeSlot và date, kiểm tra nhân viên có rảnh trong khung giờ đó không
  if (timeSlot && date) {
    const [startTime, endTime] = timeSlot.split("-");

    if (!startTime || !endTime) {
      throw new BadRequestException(
        'Định dạng timeSlot không hợp lệ, phải là "HH:MM-HH:MM"'
      );
    }

    // Lấy ngày bắt đầu và kết thúc
    const selectedDate = dateUtils.parseDate(date);
    const selectedStartDay = dateUtils.getStartOfDay(selectedDate);
    const selectedEndDay = dateUtils.getEndOfDay(selectedDate);

    // Tìm timeSlot document cho ngày đã chọn
    const timeSlotDoc = await TimeSlotModel.findOne({
      date: {
        $gte: selectedStartDay,
        $lt: selectedEndDay,
      },
    });

    if (timeSlotDoc) {
      // Tìm tất cả slot phù hợp với khung giờ đã chọn
      const matchingSlots = timeSlotDoc.slots.filter(
        (slot) =>
          slot.startTime === startTime &&
          slot.endTime === endTime &&
          slot.isAvailable
      );

      // Lấy danh sách id của các nhân viên có thể thực hiện dịch vụ trong khung giờ này
      if (matchingSlots.length > 0) {
        matchingSlots.forEach((slot) => {
          if (slot.employeeAvailability) {
            // Lọc danh sách nhân viên khả dụng
            const availableEmps = slot.employeeAvailability
              .filter((emp) => emp.isAvailable)
              .map((emp) => emp.employeeId.toString());

            availableEmployeeIds = [...availableEmployeeIds, ...availableEmps];
          }
        });

        // Loại bỏ các id trùng lặp
        availableEmployeeIds = [...new Set(availableEmployeeIds)];

        if (availableEmployeeIds.length > 0) {
          // Thêm điều kiện lọc theo employeeId
          query = {
            ...query,
            _id: { $in: availableEmployeeIds },
          };
        }
      }

      // Nếu không tìm thấy slot phù hợp hoặc không có nhân viên khả dụng
      if (matchingSlots.length === 0 || availableEmployeeIds.length === 0) {
        // Kiểm tra xem ngày đã chọn có phải là ngày làm việc của nhân viên không
        const dayOfWeek = selectedDate
          .toLocaleDateString("en-US", { weekday: "long" })
          .toLowerCase();

        // Thêm điều kiện lọc theo ngày làm việc
        query = {
          ...query,
          "employeeInfo.schedule.workDays": dayOfWeek,
        };

        // Kiểm tra xem nhân viên có trạng thái nghỉ phép trong ngày đã chọn không
        query = {
          ...query,
          $or: [
            { "employeeInfo.schedule.vacation": { $exists: false } },
            { "employeeInfo.schedule.vacation": { $size: 0 } },
            {
              "employeeInfo.schedule.vacation": {
                $not: {
                  $elemMatch: {
                    start: { $lte: selectedEndDay },
                    end: { $gte: selectedStartDay },
                  },
                },
              },
            },
          ],
        };

        // Kiểm tra xem nhân viên có cuộc hẹn khác vào thời gian này không
        const conflictingEmployeeIds = await AppointmentModel.distinct(
          "employeeId",
          {
            scheduledDate: {
              $gte: selectedStartDay,
              $lt: selectedEndDay,
            },
            "scheduledTimeSlot.start": startTime,
            status: { $nin: [AppointmentStatus.CANCELLED] },
          }
        );

        if (conflictingEmployeeIds.length > 0) {
          // Loại trừ nhân viên có lịch trùng
          query = {
            ...query,
            _id: { $nin: conflictingEmployeeIds },
          };
        }
      }
    } else {
      // Nếu không tìm thấy timeSlot cho ngày đã chọn, kiểm tra theo lịch làm việc thông thường
      const dayOfWeek = selectedDate
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();

      // Thêm điều kiện lọc theo ngày làm việc
      query = {
        ...query,
        "employeeInfo.schedule.workDays": dayOfWeek,
      };

      // Kiểm tra xem nhân viên có trạng thái nghỉ phép trong ngày đã chọn không
      query = {
        ...query,
        $or: [
          { "employeeInfo.schedule.vacation": { $exists: false } },
          { "employeeInfo.schedule.vacation": { $size: 0 } },
          {
            "employeeInfo.schedule.vacation": {
              $not: {
                $elemMatch: {
                  start: { $lte: selectedEndDay },
                  end: { $gte: selectedStartDay },
                },
              },
            },
          },
        ],
      };
    }
  }

  // Lấy danh sách nhân viên theo các điều kiện đã xác định
  const employees = await UserModel.find(query)
    .select("_id fullName profilePicture employeeInfo")
    .sort({ "employeeInfo.performance.rating": -1 }); // Sắp xếp theo đánh giá cao nhất

  return { employees };
};

// Create a new employee
interface CreateEmployeeData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  specialties: SpecialtyType[];
  workDays: string[];
  workHoursStart?: string;
  workHoursEnd?: string;
}

export const createEmployeeService = async (
  employeeData: CreateEmployeeData
) => {
  const {
    email,
    password,
    fullName,
    phoneNumber,
    specialties,
    workDays,
    workHoursStart,
    workHoursEnd,
  } = employeeData;

  // Check if employee already exists
  const employeeExists = await UserModel.findOne({ email });
  if (employeeExists) {
    throw new BadRequestException("Người dùng này đã là nhân viên");
  }

  // Create employee
  const employee = await UserModel.create({
    email,
    password,
    phoneNumber,
    fullName,
    role: Roles.EMPLOYEE,
    status: StatusUser.ACTIVE,
    employeeInfo: {
      specialties: specialties || [],
      schedule: {
        workDays: workDays || [],
        workHours: {
          start: workHoursStart || "09:00",
          end: workHoursEnd || "17:00",
        },
      },
      performance: {
        rating: 0,
        completedServices: 0,
      },
    },
  });
  const account = new AccountModel({
    userId: employee._id,
    provider: ProviderEnum.EMAIL,
    providerId: email,
  });
  await account.save();

  // Send welcome email
  if (employee) {
    try {
      await emailService.sendEmail({
        to: email,
        subject: "Chào mừng đến với Đội ngũ Pet Care Services",
        html: `
          <h1>Chào mừng đến với Đội ngũ, ${fullName}!</h1>
          <p>Chúng tôi rất vui mừng khi bạn tham gia vào đội ngũ dịch vụ chăm sóc thú cưng của chúng tôi.</p>
          <p>Tài khoản của bạn đã được tạo với các thông tin sau:</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mật khẩu:</strong> ${password}</p>
          <p>Vui lòng đăng nhập vào tài khoản của bạn và thay đổi mật khẩu.</p>
        `,
      });
    } catch (emailError) {
      console.error("Không thể gửi email chào mừng:", emailError);
    }
  }

  return { employee };
};

// Update an employee
interface UpdateEmployeeData {
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  specialties?: SpecialtyType[];
  workDays?: string[];
  workHoursStart?: string;
  workHoursEnd?: string;
  status?: StatusUserType;
}

export const updateEmployeeService = async ({
  employeeId,
  employeeData,
}: {
  employeeId: string;
  employeeData: UpdateEmployeeData;
}) => {
  const employee = await UserModel.findOne({
    _id: employeeId,
    role: Roles.EMPLOYEE,
  });

  if (!employee) {
    throw new NotFoundException("Không tìm thấy nhân viên");
  }

  const {
    email,
    fullName,
    phoneNumber,
    specialties,
    workDays,
    workHoursStart,
    workHoursEnd,
    status,
  } = employeeData;

  // Update basic info
  if (email) employee.email = email;
  if (fullName) employee.fullName = fullName;
  if (phoneNumber) employee.phoneNumber = phoneNumber;
  if (status) employee.status = status;

  // Initialize employee info if it doesn't exist
  if (!employee.employeeInfo) {
    employee.employeeInfo = {
      specialties: [],
      schedule: {
        workDays: [],
        workHours: {
          start: "09:00",
          end: "17:00",
        },
      },
      performance: {
        rating: 0,
        completedServices: 0,
      },
    };
  }

  // Update specialties if provided
  if (specialties) {
    employee.employeeInfo.specialties = specialties;
  }

  // Update work schedule if provided
  if (employee.employeeInfo.schedule && workDays) {
    employee.employeeInfo.schedule.workDays = workDays;
  }

  if (employee.employeeInfo.schedule && workHoursStart) {
    employee.employeeInfo.schedule.workHours.start = workHoursStart;
  }

  if (employee.employeeInfo.schedule && workHoursEnd) {
    employee.employeeInfo.schedule.workHours.end = workHoursEnd;
  }

  const updatedEmployee = await employee.save();
  return { employee: updatedEmployee };
};

// Delete an employee
export const deleteEmployeeService = async (employeeId: string) => {
  const employee = await UserModel.findOne({
    _id: employeeId,
    role: Roles.EMPLOYEE,
  });

  if (!employee) {
    throw new NotFoundException("Không tìm thấy nhân viên");
  }

  // Check if employee has assigned appointments
  const assignedAppointments = await AppointmentModel.countDocuments({
    employeeId: employee._id,
    status: { $in: ["pending", "confirmed", "in-progress"] },
  });

  if (assignedAppointments > 0) {
    throw new BadRequestException(
      "Không thể xóa nhân viên có lịch hẹn đã được gán. Vui lòng gán lại hoặc hủy các lịch hẹn trước."
    );
  }

  // If employee has a profile picture, delete it
  if (employee.profilePicture && employee.profilePicture.publicId) {
    try {
      await deleteFile(employee.profilePicture.publicId);
    } catch (error) {
      console.error("Lỗi khi xóa ảnh hồ sơ:", error);
    }
  }

  // Perform soft delete
  employee.status = StatusUser.INACTIVE;
  await employee.save();

  return { employee };
};

// Upload employee profile picture
interface ProfilePictureUpload {
  employeeId: string;
  file?: Express.Multer.File;
}

export const uploadEmployeeProfilePictureService = async ({
  employeeId,
  file,
}: ProfilePictureUpload) => {
  const employee = await UserModel.findOne({
    _id: employeeId,
    role: Roles.EMPLOYEE,
  });

  if (!employee) {
    throw new NotFoundException("Không tìm thấy nhân viên");
  }

  if (!file) {
    throw new BadRequestException("Không có tệp tin được tải lên");
  }

  // Delete old profile picture if exists
  if (employee.profilePicture && employee.profilePicture.publicId) {
    try {
      await deleteFile(employee.profilePicture.publicId);
    } catch (error) {
      console.error("Không thể xóa ảnh hồ sơ cũ:", error);
    }
  }

  // Update with new profile picture
  employee.profilePicture = {
    url: file.path,
    publicId: file.filename,
  };

  const updatedEmployee = await employee.save();
  return { employee: updatedEmployee };
};

// Reset employee password
interface PasswordReset {
  employeeId: string;
  newPassword: string;
}

export const resetEmployeePasswordService = async ({
  employeeId,
  newPassword,
}: PasswordReset) => {
  const employee = await UserModel.findOne({
    _id: employeeId,
    role: Roles.EMPLOYEE,
  });

  if (!employee) {
    throw new NotFoundException("Không tìm thấy nhân viên");
  }

  // Hash new password
  employee.password = newPassword;
  await employee.save();

  // Send password reset email
  try {
    await emailService.sendEmail({
      to: employee.email,
      subject: "Mật khẩu của bạn đã được đặt lại",
      html: `
        <h1>Đặt lại mật khẩu</h1>
        <p>Mật khẩu của bạn đã được đặt lại bởi quản trị viên.</p>
        <p>Mật khẩu mới của bạn là: <strong>${newPassword}</strong></p>
        <p>Vui lòng đăng nhập và thay đổi mật khẩu của bạn ngay lập tức vì lý do bảo mật.</p>
      `,
    });
  } catch (emailError) {
    console.error("Không thể gửi email đặt lại mật khẩu:", emailError);
  }

  return { success: true };
};

// Get employee performance metrics
export const getEmployeePerformanceService = async (employeeId: string) => {
  // Validate and find employee
  const employee = await UserModel.findOne({
    _id: employeeId,
    role: Roles.EMPLOYEE,
  }).select("-password");
  
  if (!employee) {
    throw new NotFoundException("Không tìm thấy nhân viên");
  }
  
  // Get current date information for time-based queries
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  
  // Get current month start and end dates for monthly metrics
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  
  // Get all appointments for this employee
  const allAppointments = await AppointmentModel.find({
    employeeId: employee._id,
    scheduledDate: { $gte: sixMonthsAgo }
  }).populate("serviceId petId customerId");
  
  // Get current month appointments
  const currentMonthAppointments = allAppointments.filter(app => 
    app.scheduledDate >= currentMonthStart && app.scheduledDate <= currentMonthEnd
  );
  
  // Calculate completion rate
  const completedAppointments = allAppointments.filter(app => app.status === AppointmentStatus.COMPLETED);
  const completionRate = allAppointments.length > 0 
    ? (completedAppointments.length / allAppointments.length * 100).toFixed(2) 
    : 0;
  
  // Calculate cancellation rate
  const cancelledAppointments = allAppointments.filter(app => app.status === AppointmentStatus.CANCELLED);
  const cancellationRate = allAppointments.length > 0 
    ? (cancelledAppointments.length / allAppointments.length * 100).toFixed(2) 
    : 0;
  
  // Calculate service breakdown
  const serviceBreakdown: Record<string, { count: number, name: string }> = {};
  for (const appointment of completedAppointments) {
    const service = appointment.serviceId as any;
    const serviceId = service._id.toString();
    
    if (!serviceBreakdown[serviceId]) {
      serviceBreakdown[serviceId] = {
        count: 0,
        name: service.name || 'Unknown Service'
      };
    }
    serviceBreakdown[serviceId].count += 1;
  }
  
  // Get monthly appointment statistics by status for last 6 months
  const monthlyStats = await AppointmentModel.aggregate([
    {
      $match: {
        employeeId: new mongoose.Types.ObjectId(employeeId),
        scheduledDate: { $gte: sixMonthsAgo, $lte: now }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$scheduledDate" },
          month: { $month: "$scheduledDate" },
          status: "$status"
        },
        count: { $sum: 1 },
        revenue: { $sum: "$totalAmount" }
      }
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1
      }
    }
  ]);
  
  // Process monthly stats into a more usable format
  const monthlyPerformance = [];
  const months = new Set(monthlyStats.map(item => `${item._id.year}-${item._id.month}`));
  
  for (const monthKey of months) {
    const [year, month] = monthKey.split('-').map(Number);
    const monthData = {
      year,
      month,
      total: 0,
      completed: 0,
      pending: 0,
      cancelled: 0,
      inProgress: 0,
      revenue: 0
    };
    
    // Fill in the counts for each status
    monthlyStats
      .filter(item => item._id.year === year && item._id.month === month)
      .forEach(item => {
        monthData.total += item.count;
        monthData.revenue += item.revenue;
        
        switch (item._id.status) {
          case AppointmentStatus.COMPLETED:
            monthData.completed = item.count;
            break;
          case AppointmentStatus.PENDING:
            monthData.pending = item.count;
            break;
          case AppointmentStatus.CANCELLED:
            monthData.cancelled = item.count;
            break;
          case AppointmentStatus.IN_PROGRESS:
            monthData.inProgress = item.count;
            break;
        }
      });
    
    monthlyPerformance.push(monthData);
  }
  
  // Calculate average service duration
  const serviceDurations = await ServiceModel.find({
    _id: { $in: completedAppointments.map(app => (app.serviceId as any)._id) }
  }).select('duration');
  
  const averageServiceDuration = serviceDurations.length > 0 
    ? serviceDurations.reduce((sum, service) => sum + service.duration, 0) / serviceDurations.length 
    : 0;
  
  // Calculate busy days and hours
  const appointmentDays = completedAppointments.map(app => {
    const date = new Date(app.scheduledDate);
    return date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  });
  
  const dayCount = [0, 0, 0, 0, 0, 0, 0]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
  appointmentDays.forEach(day => {
    dayCount[day]++;
  });
  
  const busiestDay = dayCount.indexOf(Math.max(...dayCount));
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Get upcoming appointments
  const upcomingAppointments = allAppointments.filter(app => 
    app.scheduledDate > now && 
    app.status !== AppointmentStatus.CANCELLED && 
    app.status !== AppointmentStatus.COMPLETED
  );
  
  // Current month status breakdown
  const currentMonthStatusBreakdown = {
    total: currentMonthAppointments.length,
    completed: currentMonthAppointments.filter(app => app.status === AppointmentStatus.COMPLETED).length,
    pending: currentMonthAppointments.filter(app => app.status === AppointmentStatus.PENDING).length,
    inProgress: currentMonthAppointments.filter(app => app.status === AppointmentStatus.IN_PROGRESS).length,
    cancelled: currentMonthAppointments.filter(app => app.status === AppointmentStatus.CANCELLED).length
  };
  
  // Calculate revenue statistics
  const totalRevenue = completedAppointments.reduce((sum, app) => sum + app.totalAmount, 0);
  const currentMonthRevenue = currentMonthAppointments
    .filter(app => app.status === AppointmentStatus.COMPLETED)
    .reduce((sum, app) => sum + app.totalAmount, 0);
  
  return {
    // Basic metrics
    totalAppointments: allAppointments.length,
    completedAppointments: completedAppointments.length,
    cancelledAppointments: cancelledAppointments.length,
    upcomingAppointments: upcomingAppointments.length,
    
    // Performance metrics
    completionRate: parseFloat(completionRate as string),
    cancellationRate: parseFloat(cancellationRate as string),
    averageServiceDuration,
    
    // Current ratings from database
    rating: employee.employeeInfo?.performance?.rating || 0,
    completedServices: employee.employeeInfo?.performance?.completedServices || 0,
    
    // Time-based metrics
    busiestDay: {
      day: daysOfWeek[busiestDay],
      count: dayCount[busiestDay]
    },
    
    // Financial metrics
    totalRevenue,
    currentMonthRevenue,
    
    // Detailed breakdowns
    serviceBreakdown,
    monthlyPerformance,
    currentMonthStatusBreakdown,
    
    // Employee details
    employeeDetails: {
      id: employee._id,
      name: employee.fullName,
      specialties: employee.employeeInfo?.specialties || [],
      profilePicture: employee.profilePicture?.url || null
    }
  };
};

// Get employee schedule
interface ScheduleQuery {
  employeeId: string;
  startDate?: string;
  endDate?: string;
}

export const getEmployeeScheduleService = async ({
  employeeId,
  startDate,
  endDate,
}: ScheduleQuery) => {
  const employee = await UserModel.findOne({
    _id: employeeId,
    role: Roles.EMPLOYEE,
  }).select("-password");

  if (!employee) {
    throw new NotFoundException("Không tìm thấy nhân viên");
  }

  // Parse date range or use default (current week)
  const start = startDate ? new Date(startDate) : new Date();
  const end = endDate ? new Date(endDate) : new Date();

  // If no specific dates provided, set to current week
  if (!startDate) {
    start.setDate(start.getDate() - start.getDay()); // Start of week (Sunday)
  }

  if (!endDate) {
    end.setDate(start.getDate() + 6); // End of week (Saturday)
  }

  // Set hours to get full days
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  // Get all appointments for the employee in the date range
  const appointments = await AppointmentModel.find({
    employeeId: employee._id,
    scheduledDate: { $gte: start, $lte: end },
    status: { $nin: ["cancelled"] },
  })
    .populate("petId", "name species breed profilePicture")
    .populate({
      path: "employeeId",
      select: "fullName profilePicture",
    })
    .populate("customerId", "fullName email phoneNumber")
    .populate({
      path: "serviceId",
      select: "name description price duration",
    })
    .sort({ scheduledDate: -1 });

  return {
    workDays: employee.employeeInfo?.schedule?.workDays || [],
    workHours: employee.employeeInfo?.schedule?.workHours || {
      start: "09:00",
      end: "17:00",
    },
    appointments
  };
};

// Update employee availability
interface AvailabilityUpdate {
  employeeId: string;
  availabilityData: {
    workDays?: string[];
    workHoursStart?: string;
    workHoursEnd?: string;
    vacationStart?: string;
    vacationEnd?: string;
  };
}

export const updateEmployeeAvailabilityService = async ({
  employeeId,
  availabilityData,
}: AvailabilityUpdate) => {
  const employee = await UserModel.findOne({
    _id: employeeId,
    role: Roles.EMPLOYEE,
  });

  if (!employee) {
    throw new NotFoundException("Không tìm thấy nhân viên");
  }

  const { workDays, workHoursStart, workHoursEnd, vacationStart, vacationEnd } =
    availabilityData;

  // Create employee info if it doesn't exist
  if (!employee.employeeInfo) {
    employee.employeeInfo = {
      specialties: [],
      schedule: {
        workDays: [],
        workHours: {
          start: "09:00",
          end: "17:00",
        },
      },
      performance: {
        rating: 0,
        completedServices: 0,
      },
    };
  }

  // Update work days if provided
  if (workDays && workDays.length > 0 && employee.employeeInfo.schedule) {
    employee.employeeInfo.schedule.workDays = workDays;
  }

  // Update work hours if provided
  if (workHoursStart) {
    if (employee.employeeInfo.schedule) {
      employee.employeeInfo.schedule.workHours.start = workHoursStart;
    }
  }

  if (workHoursEnd) {
    if (employee.employeeInfo.schedule) {
      employee.employeeInfo.schedule.workHours.end = workHoursEnd;
    }
  }

  // Update vacation period if applicable
  if (vacationStart && vacationEnd && employee.employeeInfo.schedule) {
    if (!employee.employeeInfo.schedule.vacation) {
      employee.employeeInfo.schedule.vacation = [];
    }

    employee.employeeInfo.schedule.vacation.push({
      start: new Date(vacationStart),
      end: new Date(vacationEnd),
    });
  }

  await employee.save();

  return {
    schedule: employee.employeeInfo.schedule,
  };
};

// Assign appointment to employee
interface AppointmentAssignment {
  employeeId: string;
  appointmentId: string;
}

export const assignAppointmentToEmployeeService = async ({
  employeeId,
  appointmentId,
}: AppointmentAssignment) => {
  // Check if employee exists and is active
  const employee = await UserModel.findOne({
    _id: employeeId,
    role: Roles.EMPLOYEE,
    status: StatusUser.ACTIVE,
  });

  if (!employee) {
    throw new NotFoundException(
      "Không tìm thấy nhân viên hoặc nhân viên không hoạt động"
    );
  }

  // Check if appointment exists
  const appointment = await AppointmentModel.findById(appointmentId);

  if (!appointment) {
    throw new NotFoundException("Không tìm thấy lịch hẹn");
  }

  // Check if appointment can be assigned
  if (
    ![AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED].includes(
      appointment.status
    )
  ) {
    throw new BadRequestException(
      `Không thể gán lịch hẹn có trạng thái ${appointment.status}`
    );
  }

  // Check if employee has necessary specialties for the service
  if (appointment.serviceType === ServiceType.SINGLE) {
    const service = await ServiceModel.findById(appointment.serviceId);
    if (
      service &&
      !employee.employeeInfo?.specialties?.includes(service.category)
    ) {
      throw new BadRequestException(
        `Nhân viên không có chuyên môn cần thiết: ${service.category}`
      );
    }
  }

  // Check for schedule conflicts
  const conflictingAppointment = await AppointmentModel.findOne({
    employeeId: employee._id,
    scheduledDate: appointment.scheduledDate,
    "scheduledTimeSlot.start": appointment.scheduledTimeSlot.start,
    status: { $nin: ["cancelled"] },
    _id: { $ne: appointment._id },
  });

  if (conflictingAppointment) {
    throw new BadRequestException(
      "Nhân viên đã có lịch hẹn khác vào thời gian này"
    );
  }

  // Assign employee to appointment

  // Assign employee to appointment
  appointment.employeeId = employee._id as mongoose.Types.ObjectId;

  // If appointment was pending, update to confirmed
  if (appointment.status === AppointmentStatus.PENDING) {
    appointment.status = AppointmentStatus.CONFIRMED;
  }

  await appointment.save();

  // Notify customer about assignment
  const customer = await UserModel.findById(appointment.customerId);
  const pet = await PetModel.findById(appointment.petId);

  if (customer && pet) {
    try {
      await emailService.sendEmail({
        to: customer.email,
        subject: "Thông tin lịch hẹn của bạn đã được cập nhật",
        html: `
          <h1>Cập nhật lịch hẹn</h1>
          <p>Lịch hẹn của bạn cho ${
            pet.name
          } vào ngày ${appointment.scheduledDate.toLocaleDateString()} 
          lúc ${appointment.scheduledTimeSlot.start} đã được gán cho ${
          employee.fullName
        }.</p>
          <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>
        `,
      });
    } catch (emailError) {
      console.error("Không thể gửi email thông báo:", emailError);
    }
  }

  return { appointment };
};

// Interface for setting employee schedule for specific dates

/**
 * Set employee schedule for specific dates
 */
interface TimeRange {
  start: string; // HH:MM format
  end: string; // HH:MM format
}

interface ScheduleInput {
  date: string; // YYYY-MM-DD format
  isWorking: boolean;
  workHours: TimeRange[]; // Modified to be an array of time ranges
  note?: string;
}

/**
 * Set employee schedule for specific dates
 */
export const setEmployeeScheduleService = async ({
  employeeId,
  schedules
}: {
  employeeId: string;
  schedules: ScheduleInput[];
}) => {
  // Validate employee exists and is active
  const employee = await UserModel.findOne({
    _id: employeeId,
    role: { $in: [Roles.EMPLOYEE, Roles.ADMIN] },
    status: StatusUser.ACTIVE
  });

  if (!employee) {
    throw new NotFoundException("Không tìm thấy nhân viên hoặc nhân viên không hoạt động");
  }

  // Validate time format for all schedules
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  const allTimesValid = schedules.every(schedule => 
    schedule.workHours.every(range => 
      timeRegex.test(range.start) && timeRegex.test(range.end)
    )
  );

  if (!allTimesValid) {
    throw new BadRequestException("Định dạng thời gian không hợp lệ (phải là HH:MM)");
  }

  // Check for time range validity
  const areTimeRangesValid = schedules.every(schedule => 
    !schedule.isWorking || // If not working, no validation needed
    schedule.workHours.every(range => range.start < range.end)
  );

  if (!areTimeRangesValid) {
    throw new BadRequestException("Thời gian kết thúc phải sau thời gian bắt đầu");
  }

  // Check for overlapping time ranges
  const doTimeRangesOverlap = (ranges: TimeRange[]): boolean => {
    if (ranges.length <= 1) return false;
    
    // Sort ranges by start time
    const sortedRanges = [...ranges].sort((a, b) => a.start.localeCompare(b.start));
    
    // Check for overlaps
    for (let i = 0; i < sortedRanges.length - 1; i++) {
      if (sortedRanges[i].end > sortedRanges[i + 1].start) {
        return true;
      }
    }
    return false;
  };

  const hasOverlappingRanges = schedules.some(schedule => 
    schedule.isWorking && doTimeRangesOverlap(schedule.workHours)
  );

  if (hasOverlappingRanges) {
    throw new BadRequestException("Các khoảng thời gian không được chồng chéo nhau");
  }

  // Process each date's schedule
  const results = [];
  for (const schedule of schedules) {
    const scheduleDate = new Date(schedule.date);
    
    // Check for invalid date
    if (isNaN(scheduleDate.getTime())) {
      throw new BadRequestException(`Ngày không hợp lệ: ${schedule.date}. Vui lòng sử dụng định dạng YYYY-MM-DD`);
    }

    // Set time to start of day for consistent date comparison
    scheduleDate.setHours(0, 0, 0, 0);

    // Check if this date's schedule conflicts with any confirmed appointments
    if (!schedule.isWorking) {
      // If marking as not working, check for existing appointments
      const existingAppointments = await AppointmentModel.find({
        employeeId,
        scheduledDate: {
          $gte: scheduleDate,
          $lt: new Date(scheduleDate.getTime() + 24 * 60 * 60 * 1000) // Next day
        },
        status: { $in: [AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING] }
      });

      if (existingAppointments.length > 0) {
        throw new BadRequestException(
          `Không thể đánh dấu ngày ${schedule.date} là không làm việc vì đã có ${existingAppointments.length} cuộc hẹn được xác nhận`
        );
      }
    } else if (schedule.workHours.length > 0) {
      // If working, check if any appointments fall outside of any work hours
      const appointmentsForDay = await AppointmentModel.find({
        employeeId,
        scheduledDate: {
          $gte: scheduleDate,
          $lt: new Date(scheduleDate.getTime() + 24 * 60 * 60 * 1000)
        },
        status: { $in: [AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING] }
      });

      // Check each appointment against all time ranges
      const conflictingAppointments = appointmentsForDay.filter(appointment => {
        const { start: apptStart, end: apptEnd } = appointment.scheduledTimeSlot;
        
        // Appointment conflicts if it falls outside ALL work hour ranges
        return !schedule.workHours.some(range => 
          apptStart >= range.start && apptEnd <= range.end
        );
      });

      if (conflictingAppointments.length > 0) {
        throw new BadRequestException(
          `Không thể thay đổi giờ làm việc cho ngày ${schedule.date} vì có ${conflictingAppointments.length} cuộc hẹn nằm ngoài khung giờ mới`
        );
      }
    }

    // Update or create schedule for this date
    const updatedSchedule = await EmployeeScheduleModel.findOneAndUpdate(
      { employeeId, date: scheduleDate },
      {
        isWorking: schedule.isWorking,
        workHours: schedule.isWorking ? schedule.workHours : [], // Empty array if not working
        note: schedule.note
      },
      { new: true, upsert: true }
    );

    results.push(updatedSchedule);
  }

  return { schedules: results };
};
/**
 * Get employee schedule for a date range
 */
export const getEmployeeScheduleRangeService = async ({
  employeeId,
  startDate,
  endDate
}: {
  employeeId: string;
  startDate: string;
  endDate: string;
}) => {
  // Validate employee exists
  const employee = await UserModel.findOne({
    _id: employeeId,
    role: { $in: [Roles.EMPLOYEE, Roles.ADMIN] }
  });
  if (!employee) {
    throw new NotFoundException("Không tìm thấy nhân viên");
  }
  
  // Parse dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Validate dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new BadRequestException("Ngày không hợp lệ. Vui lòng sử dụng định dạng YYYY-MM-DD");
  }
  
  // Set time to start/end of day for consistent date comparison
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  
  // Get all schedule entries in the date range
  const schedules = await EmployeeScheduleModel.find({
    employeeId,
    date: { $gte: start, $lte: end }
  }).sort({ date: 1 });
  
  // Get all appointments in the date range
  const appointments = await AppointmentModel.find({
    employeeId,
    scheduledDate: { $gte: start, $lte: end },
    status: { $nin: [AppointmentStatus.CANCELLED] }
  })
    .populate("petId", "name species breed profilePicture")
    .populate("customerId", "fullName email phoneNumber")
    .populate({
      path: "serviceId",
      select: "name description price duration"
    })
    .sort({ scheduledDate: 1, "scheduledTimeSlot.start": 1 });
  
  // Get default work hours from employee profile and normalize to array format
  const defaultWorkHours = employee.employeeInfo?.schedule?.workHours;
  const normalizedDefaultWorkHours = Array.isArray(defaultWorkHours) 
    ? defaultWorkHours 
    : [{ start: defaultWorkHours?.start || "09:00", end: defaultWorkHours?.end || "17:00" }];
  
  // Create a map of date to schedule for easy lookup
  const scheduleMap = new Map();
  schedules.forEach(schedule => {
    const dateStr = schedule.date.toISOString().split('T')[0];
    // Ensure workHours is always in array format
    if (schedule.workHours && !Array.isArray(schedule.workHours)) {
      schedule.workHours = [schedule.workHours];
    }
    scheduleMap.set(dateStr, schedule);
  });
  
  // Generate a complete schedule for each day in the range
  const completeSchedule = [];
  const currentDate = new Date(start);
  
  while (currentDate <= end) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const existingSchedule = scheduleMap.get(dateStr);
    
    // If we have a custom schedule for this date, use it
    // Otherwise, create a default entry based on employee's settings
    if (existingSchedule) {
      completeSchedule.push(existingSchedule);
    } else {
      completeSchedule.push({
        date: new Date(currentDate),
        employeeId,
        isWorking: true, // Default to working
        workHours: normalizedDefaultWorkHours, // Always an array now
        isDefault: true // Flag to indicate this is a default entry, not a saved one
      });
    }
    
    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return {
    schedules: completeSchedule,
    appointments
  };
};

/**
 * Delete a specific schedule entry
 */
export const deleteEmployeeScheduleService = async ({
  employeeId,
  scheduleId
}: {
  employeeId: string;
  scheduleId: string;
}) => {
  const schedule = await EmployeeScheduleModel.findOne({
    _id: scheduleId,
    employeeId
  });

  if (!schedule) {
    throw new NotFoundException("Không tìm thấy lịch làm việc");
  }

  // Check if there are appointments on this date
  const scheduleDate = new Date(schedule.date);
  const nextDay = new Date(scheduleDate.getTime() + 24 * 60 * 60 * 1000);
  
  const existingAppointments = await AppointmentModel.find({
    employeeId,
    scheduledDate: { $gte: scheduleDate, $lt: nextDay },
    status: { $in: [AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING] }
  });

  if (existingAppointments.length > 0) {
    throw new BadRequestException(
      `Không thể xóa lịch làm việc vì đã có ${existingAppointments.length} cuộc hẹn được xác nhận cho ngày này`
    );
  }

  // Sử dụng deleteOne thay vì remove
  await EmployeeScheduleModel.deleteOne({ _id: scheduleId });
  return { success: true, message: "Đã xóa lịch làm việc thành công" };
};

/**
 * Get employee availability for a specific date
 * This can be used to show available time slots for customers to book
 */
/**
 * Get employee availability for a specific date
 * This can be used to show available time slots for customers to book
 */
export const getEmployeeAvailabilityForDateService = async ({
  employeeId,
  date
}: {
  employeeId: string;
  date: string;
}) => {
  // Validate employee exists and is active
  const employee = await UserModel.findOne({
    _id: employeeId,
    role: { $in: [Roles.EMPLOYEE, Roles.ADMIN] },
    status: StatusUser.ACTIVE
  });

  if (!employee) {
    throw new NotFoundException("Không tìm thấy nhân viên hoặc nhân viên không hoạt động");
  }

  // Parse date
  const scheduleDate = new Date(date);
  if (isNaN(scheduleDate.getTime())) {
    throw new BadRequestException("Ngày không hợp lệ. Vui lòng sử dụng định dạng YYYY-MM-DD");
  }
  
  // Set time to start of day for consistent date comparison
  scheduleDate.setHours(0, 0, 0, 0);
  const nextDay = new Date(scheduleDate.getTime() + 24 * 60 * 60 * 1000);

  // Get the schedule for this specific date
  const schedule = await EmployeeScheduleModel.findOne({
    employeeId,
    date: scheduleDate
  });

  // Default work hours if no specific schedule is found
  let workHours = employee.employeeInfo?.schedule?.workHours 
    ? [{ 
        start: employee.employeeInfo.schedule.workHours.start || "09:00", 
        end: employee.employeeInfo.schedule.workHours.end || "17:00" 
      }]
    : [{ start: "09:00", end: "17:00" }];
  
  let isWorking = true; // Default to working

  // If a specific schedule exists for this date, use it
  if (schedule) {
    isWorking = schedule.isWorking;
    workHours = schedule.workHours;
  }

  // If not working on this day, return empty availability
  if (!isWorking || workHours.length === 0) {
    return {
      date: scheduleDate,
      isWorking: false,
      availableTimeSlots: []
    };
  }

  // Get all appointments for this date
  const appointments = await AppointmentModel.find({
    employeeId,
    scheduledDate: { $gte: scheduleDate, $lt: nextDay },
    status: { $nin: [AppointmentStatus.CANCELLED] }
  }).select("scheduledTimeSlot");

  // Generate all possible time slots during work hours (30-min slots)
  const allTimeSlots = [];
  
  // Helper to format time as HH:MM
  const formatTime = (hour: number, minute: number) => 
    `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  
  // Process each work hour range
  for (const range of workHours) {
    const [startHour, startMinute] = range.start.split(":").map(Number);
    const [endHour, endMinute] = range.end.split(":").map(Number);
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    // Generate all possible time slots for this range
    while (
      currentHour < endHour || 
      (currentHour === endHour && currentMinute < endMinute)
    ) {
      const slotStart = formatTime(currentHour, currentMinute);
      
      // Move 30 minutes forward
      currentMinute += 30;
      if (currentMinute >= 60) {
        currentHour++;
        currentMinute -= 60;
      }
      
      // Skip if we've gone past the end time
      if (
        currentHour > endHour || 
        (currentHour === endHour && currentMinute > endMinute)
      ) {
        break;
      }
      
      const slotEnd = formatTime(currentHour, currentMinute);
      
      // Check if this slot conflicts with any appointments
      const isAvailable = !appointments.some(appointment => {
        const apptStart = appointment.scheduledTimeSlot.start;
        const apptEnd = appointment.scheduledTimeSlot.end;
        
        // Check for overlap
        return (
          (slotStart >= apptStart && slotStart < apptEnd) || // Slot start is during appointment
          (slotEnd > apptStart && slotEnd <= apptEnd) || // Slot end is during appointment
          (slotStart <= apptStart && slotEnd >= apptEnd) // Slot completely contains appointment
        );
      });
      
      allTimeSlots.push({
        start: slotStart,
        end: slotEnd,
        isAvailable
      });
    }
  }
  
  // Sort all time slots by start time
  allTimeSlots.sort((a, b) => a.start.localeCompare(b.start));
  
  return {
    date: scheduleDate,
    isWorking,
    workHours,
    availableTimeSlots: allTimeSlots
  };
};
