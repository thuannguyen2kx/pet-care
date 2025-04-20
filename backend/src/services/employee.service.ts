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
  const employee = await UserModel.findOne({
    _id: employeeId,
    role: Roles.EMPLOYEE,
  }).select("-password");

  if (!employee) {
    throw new NotFoundException("Không tìm thấy nhân viên");
  }

  // Get completed appointments
  const completedAppointments = await AppointmentModel.find({
    employeeId: employee._id,
    status: "completed",
  }).populate("serviceId");

  // Calculate service breakdown
  const serviceBreakdown: Record<string, number> = {};

  for (const appointment of completedAppointments) {
    const serviceId = appointment.serviceId.toString();
    if (!serviceBreakdown[serviceId]) {
      serviceBreakdown[serviceId] = 0;
    }
    serviceBreakdown[serviceId] += 1;
  }

  // Get monthly appointment count for last 6 months
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  const monthlyAppointments = await AppointmentModel.aggregate([
    {
      $match: {
        employeeId: employee._id,
        status: "completed",
        completedAt: { $gte: sixMonthsAgo, $lte: now },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$completedAt" },
          month: { $month: "$completedAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);

  const monthlyPerformance = monthlyAppointments.map((item) => ({
    year: item._id.year,
    month: item._id.month,
    count: item.count,
  }));

  return {
    totalAppointments: completedAppointments.length,
    serviceBreakdown,
    monthlyPerformance,
    completedServices:
      employee.employeeInfo?.performance?.completedServices || 0,
    rating: employee.employeeInfo?.performance?.rating || 0,
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
    .populate("petId", "name species")
    .populate("customerId", "fullName phoneNumber")
    .populate("serviceId", "name duration");

  return {
    workDays: employee.employeeInfo?.schedule?.workDays || [],
    workHours: employee.employeeInfo?.schedule?.workHours || {
      start: "09:00",
      end: "17:00",
    },
    appointments: appointments.map((appt) => ({
      _id: appt._id,
      date: appt.scheduledDate,
      timeSlot: appt.scheduledTimeSlot,
      status: appt.status,
      service: appt.serviceId,
      customer: appt.customerId,
      pet: appt.petId,
    })),
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
