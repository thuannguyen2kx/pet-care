import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { bookingService } from "../services/booking.service";
import { Roles } from "../enums/role.enum";
import {
  addRatingSchema,
  cancelBookingSchema,
  createBookingSchema,
  updateBookingSchema,
  updateStatusSchema,
} from "../validation/booking.validation";
/**

@desc    Create new booking
@route   POST /api/bookings
@access  Private (Customer)
*/
export const createBookingController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const data = createBookingSchema.parse(req.body);
    const booking = await bookingService.createBooking({
      customerId: userId,
      ...data,
    });
    return res.status(HTTPSTATUS.CREATED).json({
      message: "Đặt lịch thành công",
      booking,
    });
  }
);

/**

@desc    Get bookings with filters
@route   GET /api/bookings
@access  Private
*/
export const getBookingsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const userRole = req.user?.role;
    const filters: any = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    };
    // Customers can only see their own bookings
    if (userRole === Roles.CUSTOMER) {
      filters.customerId = userId;
    }
    // Employees can see their assigned bookings
    if (userRole === Roles.EMPLOYEE) {
      filters.employeeId = userId;
    }
    // Admin can filter by customerId or employeeId
    if (userRole === Roles.ADMIN) {
      if (req.query.customerId) filters.customerId = req.query.customerId;
      if (req.query.employeeId) filters.employeeId = req.query.employeeId;
    }
    if (req.query.petId) filters.petId = req.query.petId;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.startDate)
      filters.startDate = new Date(req.query.startDate as string);
    if (req.query.endDate)
      filters.endDate = new Date(req.query.endDate as string);
    const result = await bookingService.getBookings(filters);
    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy danh sách lịch đặt thành công",
      ...result,
    });
  }
);

/**

@desc    Get booking by ID
@route   GET /api/bookings/:id
@access  Private
*/
export const getBookingByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const bookingId = req.params.id;
    const userId = req.user!._id;
    const userRole = req.user!.role;
    const booking = await bookingService.getBookingById(
      bookingId,
      userId,
      userRole
    );
    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy thông tin lịch đặt thành công",
      booking,
    });
  }
);

/**

@desc    Update booking (reschedule)
@route   PUT /api/bookings/:id
@access  Private (Customer)
*/
export const updateBookingController = asyncHandler(
  async (req: Request, res: Response) => {
    const bookingId = req.params.id;
    const userId = req.user!._id;
    const data = updateBookingSchema.parse(req.body);
    const booking = await bookingService.updateBooking(bookingId, userId, data);
    return res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật thông tin lịch đặt thành công",
      booking,
    });
  }
);

/**

@desc    Cancel booking
@route   POST /api/bookings/:id/cancel
@access  Private
*/
export const cancelBookingController = asyncHandler(
  async (req: Request, res: Response) => {
    const bookingId = req.params.id;
    const userId = req.user!._id;
    const userRole = req.user!.role;
    const { reason } = cancelBookingSchema.parse(req.body);
    const booking = await bookingService.cancelBooking(
      bookingId,
      userId,
      userRole,
      reason
    );
    return res.status(HTTPSTATUS.OK).json({
      message: "Huỷ lịch đặt thành công",
      booking,
    });
  }
);

/**

@desc    Update booking status
@route   PATCH /api/bookings/:id/status
@access  Private (Employee/Admin)
*/
export const updateStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const bookingId = req.params.id;
    const userId = req.user!._id;
    const userRole = req.user!.role;
    const data = updateStatusSchema.parse(req.body);
    const booking = await bookingService.updateStatus(
      bookingId,
      userId,
      userRole,
      data
    );
    return res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật trạng thái lịch đặt thành công",
      booking,
    });
  }
);

/**

@desc    Add rating to booking
@route   POST /api/bookings/:id/rating
@access  Private (Customer)
*/
export const addRatingController = asyncHandler(
  async (req: Request, res: Response) => {
    const bookingId = req.params.id;
    const userId = req.user!._id;
    const data = addRatingSchema.parse(req.body);
    const booking = await bookingService.addRating(bookingId, userId, data);
    return res.status(HTTPSTATUS.CREATED).json({
      message: "Đã thêm đánh giá lịch đặt",
      booking,
    });
  }
);

/**

@desc    Get booking statistics
@route   GET /api/bookings/stats
@access  Private (Employee/Admin)
*/
export const getStatisticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userRole = req.user?.role;
    const userId = req.user?._id;
    const filters: any = {};
    // Employee can only see their own stats
    if (userRole === Roles.EMPLOYEE) {
      filters.employeeId = userId;
    }
    // Admin can filter by employeeId
    if (userRole === Roles.ADMIN && req.query.employeeId) {
      filters.employeeId = req.query.employeeId;
    }
    if (req.query.startDate) {
      filters.startDate = new Date(req.query.startDate as string);
    }
    if (req.query.endDate) {
      filters.endDate = new Date(req.query.endDate as string);
    }
    const stats = await bookingService.getStatistics(filters);
    return res.status(HTTPSTATUS.OK).json({
      message: "Thống kê được truy xuất thành công",
      stats,
    });
  }
);
