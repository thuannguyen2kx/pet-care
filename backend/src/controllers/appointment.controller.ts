import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import {
  getUserAppointmentsService,
  getAppointmentByIdService,
  createAppointmentService,
  updateAppointmentStatusService,
  cancelAppointmentService,
  getAvailableTimeSlotsService,
  getAllAppointmentsService
} from "../services/appointment.service";
import {
  appointmentIdSchema,
  createAppointmentSchema,
  updateAppointmentStatusSchema,
  getTimeSlotsSchema
} from "../validation/appointment.validation";

// Lấy tất cả cuộc hẹn của người dùng đã đăng nhập
export const getUserAppointmentsController = asyncHandler(
  async (req: Request, res: Response) => {
    const { appointments } = await getUserAppointmentsService(req.user?._id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy danh sách cuộc hẹn thành công",
      appointments
    });
  }
);

// Lấy chi tiết cuộc hẹn theo ID
export const getAppointmentByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const appointmentId = appointmentIdSchema.parse(req.params.id);
    const { appointment } = await getAppointmentByIdService(
      appointmentId,
      req.user?._id,
      req.user?.role!
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy thông tin cuộc hẹn thành công",
      appointment
    });
  }
);

// Tạo cuộc hẹn mới
export const createAppointmentController = asyncHandler(
  async (req: Request, res: Response) => {
    const appointmentData = createAppointmentSchema.parse(req.body);
    
    const result = await createAppointmentService(
      appointmentData,
      req.user?._id,
      req.user?.email!
    );

    return res.status(HTTPSTATUS.CREATED).json({
      message: result.message,
      appointment: result.appointment
    });
  }
);

// Cập nhật trạng thái cuộc hẹn
export const updateAppointmentStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const appointmentId = appointmentIdSchema.parse(req.params.id);
    const updateData = updateAppointmentStatusSchema.parse(req.body);
    
    const { updatedAppointment } = await updateAppointmentStatusService(
      appointmentId,
      updateData,
      req.user?.role!
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật trạng thái cuộc hẹn thành công",
      appointment: updatedAppointment
    });
  }
);

// Hủy cuộc hẹn
export const cancelAppointmentController = asyncHandler(
  async (req: Request, res: Response) => {
    const appointmentId = appointmentIdSchema.parse(req.params.id);
    
    const result = await cancelAppointmentService(
      appointmentId,
      req.user?._id,
      req.user?.role!
    );

    return res.status(HTTPSTATUS.OK).json({
      message: result.message,
      appointment: result.appointment
    });
  }
);

// Lấy khung giờ có sẵn
export const getAvailableTimeSlotsController = asyncHandler(
  async (req: Request, res: Response) => {
    const queryParams = getTimeSlotsSchema.parse(req.query);
    
    const { timeSlot } = await getAvailableTimeSlotsService(queryParams);

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy danh sách khung giờ trống thành công",
      timeSlot
    });
  }
);

// Lấy tất cả cuộc hẹn (cho admin)
export const getAllAppointmentsController = asyncHandler(
  async (req: Request, res: Response) => {
    const { appointments } = await getAllAppointmentsService(req.query);

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy danh sách tất cả cuộc hẹn thành công",
      appointments
    });
  }
);