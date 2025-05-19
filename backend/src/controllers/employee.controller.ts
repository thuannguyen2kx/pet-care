import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import {
  getAllEmployeesService,
  getEmployeeByIdService,
  createEmployeeService,
  updateEmployeeService,
  deleteEmployeeService,
  uploadEmployeeProfilePictureService,
  resetEmployeePasswordService,
  getEmployeePerformanceService,
  getEmployeeScheduleService,
  updateEmployeeAvailabilityService,
  assignAppointmentToEmployeeService,
  getAvailableEmployeesForServiceService,
  setEmployeeScheduleService,
  getEmployeeScheduleRangeService,
  deleteEmployeeScheduleService,
  getEmployeeAvailabilityForDateService,
} from "../services/employee.service";
import { HTTPSTATUS } from "../config/http.config";
import { uploadProfilePicture } from "../utils/file-uploade";
import {
  createEmployeeSchema,
  employeeIdSchema,
  updateEmployeeSchema,
  resetPasswordSchema,
  availabilitySchema,
  appointmentIdSchema,
  getEmployeesSchema,
  getAvailableEmployeesSchema,
  setScheduleSchema,
  dateSchema,
  scheduleIdSchema,
  scheduleRangeSchema,
} from "../validation/employee.validation";
import AppointmentModel, { AppointmentStatus } from "../models/appointment.model";
import EmployeeScheduleModel from "../models/employee-schedule.model";
import UserModel from "../models/user.model";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { Roles } from "../enums/role.enum";

// Get all employees with optional filtering
export const getAllEmployeesController = asyncHandler(
  async (req: Request, res: Response) => {
    const query = getEmployeesSchema.parse(req.query);
    const filters = {
      status: query.status,
      specialty: query.specialty ? query.specialty.split(",") : undefined,
    };
    const { employees } = await getAllEmployeesService(filters);

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy danh sách nhân viên thành công",
      employees,
    });
  }
);
export const getAvailableEmployeesController = asyncHandler(
  async (req: Request, res: Response) => {
    const query = getAvailableEmployeesSchema.parse(req.query);
    
    const { employees } = await getAvailableEmployeesForServiceService({
      serviceId: query.serviceId,
      serviceType: query.serviceType,
      timeSlot: query.timeSlot,
      date: query.date,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy danh sách nhân viên khả dụng thành công",
      employees,
    });
  }
);
// Get employee by ID
export const getEmployeeByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = employeeIdSchema.parse(req.params.id);
    const { employee } = await getEmployeeByIdService(employeeId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy thông tin nhân viên thành công",
      employee,
    });
  }
);

// Create a new employee
export const createEmployeeController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeData = createEmployeeSchema.parse({ ...req.body });
    const { employee } = await createEmployeeService(employeeData);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Tạo nhân viên mới thành công",
      employee,
    });
  }
);

// Update an employee
export const updateEmployeeController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = employeeIdSchema.parse(req.params.id);
    const updateData = updateEmployeeSchema.parse({ ...req.body });

    const { employee } = await updateEmployeeService({
      employeeId,
      employeeData: updateData,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật thông tin nhân viên thành công",
      employee,
    });
  }
);

// Delete an employee
export const deleteEmployeeController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = employeeIdSchema.parse(req.params.id);
    const { employee } = await deleteEmployeeService(employeeId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Xóa nhân viên thành công",
      employee,
    });
  }
);

// Upload employee profile picture
export const uploadEmployeeProfilePictureController = [
  uploadProfilePicture.single("profilePicture"),
  asyncHandler(async (req: Request, res: Response) => {
    const employeeId = employeeIdSchema.parse(req.params.id);

    const result = await uploadEmployeeProfilePictureService({
      employeeId,
      file: req.file,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật ảnh đại diện thành công",
      employee: result.employee,
    });
  }),
];

// Reset employee password
export const resetEmployeePasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = employeeIdSchema.parse(req.params.id);
    const { newPassword } = resetPasswordSchema.parse(req.body);

    await resetEmployeePasswordService({
      employeeId,
      newPassword,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Đặt lại mật khẩu thành công",
    });
  }
);

// Get employee performance metrics
export const getEmployeePerformanceController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = employeeIdSchema.parse(req.params.id);
    const performanceData = await getEmployeePerformanceService(employeeId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy thông tin hiệu suất thành công",
      ...performanceData,
    });
  }
);

/**
 * Get employee schedule statistics
 */
const getEmployeeScheduleStats = async (
  employeeId: string, 
  startDate: Date, 
  endDate: Date
) => {
  // Get all schedule entries for this period
  const schedules = await EmployeeScheduleModel.find({
    employeeId,
    date: { $gte: startDate, $lte: endDate }
  });

  // Calculate working days percentage
  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const workingDays = schedules.filter(schedule => schedule.isWorking).length;
  const workingDaysPercentage = (workingDays / totalDays) * 100;

  // Calculate total working hours
  let totalWorkingHours = 0;
  
  for (const schedule of schedules) {
    if (!schedule.isWorking) continue;
    
    for (const workHour of schedule.workHours) {
      const [startHour, startMinute] = workHour.start.split(':').map(Number);
      const [endHour, endMinute] = workHour.end.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;
      
      totalWorkingHours += (endMinutes - startMinutes) / 60;
    }
  }

  // Calculate average hours per working day
  const averageHoursPerWorkingDay = workingDays > 0 ? totalWorkingHours / workingDays : 0;

  // Calculate utilization rate (appointments / working hours)
  const appointmentsCount = await AppointmentModel.countDocuments({
    employeeId,
    scheduledDate: { $gte: startDate, $lte: endDate },
    status: { $ne: AppointmentStatus.CANCELLED }
  });

  const utilizationRate = totalWorkingHours > 0 ? (appointmentsCount / totalWorkingHours) * 100 : 0;

  return {
    workingDays,
    totalDays,
    workingDaysPercentage,
    totalWorkingHours,
    averageHoursPerWorkingDay,
    appointmentsPerWorkingHour: totalWorkingHours > 0 ? appointmentsCount / totalWorkingHours : 0,
    utilizationRate
  };
};
/**
 * Update employee performance ratings
 */
export const updateEmployeePerformanceController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = employeeIdSchema.parse(req.params.id);
    
    // Validate required fields
    const { rating } = req.body;
    if (typeof rating !== 'number' || rating < 0 || rating > 5) {
      throw new BadRequestException("Rating phải là số từ 0 đến 5");
    }
    
    // Find employee
    const employee = await UserModel.findOne({
      _id: employeeId,
      role: Roles.EMPLOYEE,
    });
    
    if (!employee) {
      throw new NotFoundException("Không tìm thấy nhân viên");
    }
    
    // Get the completed services count
    const completedServices = await AppointmentModel.countDocuments({
      employeeId: employee._id,
      status: AppointmentStatus.COMPLETED
    });
    
    // Update employee performance data
    await UserModel.updateOne(
      { _id: employeeId },
      { 
        $set: { 
          "employeeInfo.performance.rating": rating,
          "employeeInfo.performance.completedServices": completedServices
        } 
      }
    );
    
    return res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật hiệu suất nhân viên thành công",
      rating,
      completedServices
    });
  }
);

// Get employee schedule
export const getEmployeeScheduleController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = employeeIdSchema.parse(req.params.id);
    const { startDate, endDate } = req.query;

    const scheduleData = await getEmployeeScheduleService({
      employeeId,
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy lịch trình thành công",
      ...scheduleData,
    });
  }
);

// Update employee availability
export const updateEmployeeAvailabilityController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = employeeIdSchema.parse(req.params.id);
    const availabilityData = availabilitySchema.parse(req.body);

    const result = await updateEmployeeAvailabilityService({
      employeeId,
      availabilityData,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật lịch làm việc thành công",
      schedule: result.schedule,
    });
  }
);

// Assign appointment to employee
export const assignAppointmentToEmployeeController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = employeeIdSchema.parse(req.params.id);
    const appointmentId = appointmentIdSchema.parse(req.params.appointmentId);

    const result = await assignAppointmentToEmployeeService({
      employeeId,
      appointmentId,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Gán cuộc hẹn cho nhân viên thành công",
      appointment: result.appointment,
    });
  }
);

// Controller to set employee schedule for specific dates
export const setEmployeeScheduleController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = employeeIdSchema.parse(req.params.id);
    const { schedules } = setScheduleSchema.parse(req.body);

    const result = await setEmployeeScheduleService({
      employeeId,
      schedules
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật lịch làm việc thành công",
      schedules: result.schedules
    });
  }
);

// Controller to get employee schedule for a date range
export const getEmployeeScheduleRangeController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = employeeIdSchema.parse(req.params.id);
    const { startDate, endDate } = scheduleRangeSchema.parse(req.query);

    const result = await getEmployeeScheduleRangeService({
      employeeId,
      startDate,
      endDate
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy lịch làm việc thành công",
      schedules: result.schedules,
      appointments: result.appointments
    });
  }
);

// Controller to delete a specific schedule entry
export const deleteEmployeeScheduleController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = employeeIdSchema.parse(req.params.id);
    const scheduleId = scheduleIdSchema.parse(req.params.scheduleId);

    const result = await deleteEmployeeScheduleService({
      employeeId,
      scheduleId
    });

    return res.status(HTTPSTATUS.OK).json({
      message: result.message,
      success: result.success
    });
  }
);

// Controller to get employee availability for a specific date
export const getEmployeeAvailabilityForDateController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = employeeIdSchema.parse(req.params.id);
    const { date } = dateSchema.parse(req.query);

    const result = await getEmployeeAvailabilityForDateService({
      employeeId,
      date
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy thông tin khả dụng thành công",
      availability: result
    });
  }
);
