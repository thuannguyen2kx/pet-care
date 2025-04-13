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
} from "../validation/employee.validation";

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
