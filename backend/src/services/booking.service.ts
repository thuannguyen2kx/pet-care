import mongoose, { Types } from "mongoose";
import {
  BookingModel,
  BookingStatus,
  PaymentStatus,
} from "../models/booking.model";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "../utils/app-error";
import { AvailabilityCalculator } from "./availability.service";
import ServiceModel from "../models/service.model";
import { Roles } from "../enums/role.enum";
import { UserStatus } from "../enums/status-user.enum";

class BookingService {
  /**
   * Create a new booking with availability validation
   */
  async createBooking(data: {
    customerId: Types.ObjectId;
    petId: string;
    serviceId: string;
    employeeId?: string;
    scheduledDate: string;
    startTime: string;
    customerNotes?: string;
  }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Validate pet belongs to customer
      const Pet = mongoose.model("Pet");
      const pet = await Pet.findOne({
        _id: data.petId,
        ownerId: data.customerId,
        isActive: true,
      });

      if (!pet) {
        throw new Error(
          "Không tìm thấy thú cưng hoặc thú cưng đó không thuộc về bạn."
        );
      }

      // 2. Get service details
      const service = await ServiceModel.findOne({
        _id: data.serviceId,
        isActive: true,
      });

      if (!service) {
        throw new Error("Không tìm thấy dịch vụ hoặc dịch vụ không hoạt động.");
      }

      // 3. Auto-assign employee if not provided
      let employeeId = data.employeeId;
      if (!employeeId) {
        employeeId =
          (await this.findAvailableEmployee(
            data.serviceId,
            data.scheduledDate,
            data.startTime
          )) ?? undefined;

        if (!employeeId) {
          throw new Error(
            "Hiện không có nhân viên nào phù hợp với khung giờ này."
          );
        }
      }

      // 4. Validate employee has required specialty
      const User = mongoose.model("User");
      const employee = await User.findOne({
        _id: employeeId,
        role: { $in: [Roles.EMPLOYEE] },
        status: UserStatus.ACTIVE,
        "employeeInfo.isAcceptingBookings": true,
        "employeeInfo.vacationMode": false,
      });

      if (!employee) {
        throw new BadRequestException(
          "Không tìm thấy nhân viên hoặc nhân viên không nhận đặt chỗ."
        );
      }

      if (service.requiredSpecialties) {
        const hasSpecialty = service.requiredSpecialties.some((required) =>
          employee.employeeInfo?.specialties?.includes(required)
        );
        if (!hasSpecialty) {
          throw new BadRequestException(
            ` Nhân viên không có chuyên môn cần thiết:${service.requiredSpecialties}`
          );
        }
      }

      // 5. Calculate availability and validate time slot
      const calculator = new AvailabilityCalculator();
      const slots = await calculator.getAvailableSlots({
        employeeId: employeeId,
        date: new Date(data.scheduledDate),
        serviceId: data.serviceId,
      });

      const requestedSlot = slots.find((s) => s.startTime === data.startTime);
      if (!requestedSlot || !requestedSlot.available) {
        throw new BadRequestException("Khung giờ đã chọn không khả dụng");
      }

      // 6. Calculate end time
      const totalDuration = service.duration;
      const endTime = this.calculateEndTime(data.startTime, totalDuration);

      // 7. Check for no-show history (optional - business rule)
      const recentNoShows = await BookingModel.countDocuments({
        customerId: data.customerId,
        status: BookingStatus.NO_SHOW,
        scheduledDate: {
          $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        },
      });

      if (recentNoShows >= 3) {
        throw new BadRequestException(
          "Quá nhiều lần không đến. Vui lòng liên hệ với chúng tôi để khôi phục quyền đặt phòng."
        );
      }

      // 8. Create booking
      const booking = await BookingModel.create(
        [
          {
            customerId: data.customerId,
            petId: data.petId,
            employeeId: employeeId,
            serviceId: data.serviceId,
            scheduledDate: new Date(data.scheduledDate),
            startTime: data.startTime,
            endTime: endTime,
            duration: service.duration,
            serviceSnapshot: {
              name: service.name,
              price: service.price,
              duration: service.duration,
              category: service.category,
            },
            totalAmount: service.price,
            paidAmount: 0,
            status: BookingStatus.PENDING,
            paymentStatus: PaymentStatus.PENDING,
            customerNotes: data.customerNotes,
            statusHistory: [
              {
                status: BookingStatus.PENDING,
                changedAt: new Date(),
                changedBy: new mongoose.Types.ObjectId(data.customerId),
              },
            ],
          },
        ],
        { session }
      );

      // 9. Update customer stats
      await User.findByIdAndUpdate(
        data.customerId,
        {
          $inc: { "customerInfo.stats.totalBookings": 1 },
        },
        { session }
      );

      await session.commitTransaction();

      // 10. Send confirmation (outside transaction)
      //   this.sendBookingConfirmation(booking[0]._id.toString());

      return booking[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get bookings with filters
   */
  async getBookings(filters: {
    customerId?: string;
    employeeId?: string;
    petId?: string;
    status?: BookingStatus | BookingStatus[];
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const query: any = {};

    if (filters.customerId) query.customerId = filters.customerId;
    if (filters.employeeId) query.employeeId = filters.employeeId;
    if (filters.petId) query.petId = filters.petId;

    if (filters.status) {
      query.status = Array.isArray(filters.status)
        ? { $in: filters.status }
        : filters.status;
    }

    if (filters.startDate || filters.endDate) {
      query.scheduledDate = {};
      if (filters.startDate) query.scheduledDate.$gte = filters.startDate;
      if (filters.endDate) query.scheduledDate.$lte = filters.endDate;
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      BookingModel.find(query)
        .populate("customerId", "fullName email phoneNumber profilePicture")
        .populate("petId", "name type breed image")
        .populate(
          "employeeId",
          "fullName profilePicture employeeInfo.specialties"
        )
        .populate("serviceId", "name category duration price")
        .sort({ scheduledDate: -1, startTime: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BookingModel.countDocuments(query),
    ]);

    return {
      bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single booking by ID
   */
  async getBookingById(
    bookingId: string,
    userId: Types.ObjectId,
    userRole: string
  ) {
    const booking = await BookingModel.findById(bookingId)
      .populate("customerId", "fullName email phoneNumber profilePicture")
      .populate("petId", "name type breed age weight image vaccinations")
      .populate("employeeId", "fullName profilePicture employeeInfo")
      .populate("serviceId", "name description category duration price");

    if (!booking) {
      throw new NotFoundException("Không tìm thấy lịch đặt");
    }

    // Authorization check
    const isCustomer = booking.customerId._id.toString() === userId.toString();
    const isEmployee = booking.employeeId._id.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (!isCustomer && !isEmployee && !isAdmin) {
      throw new ForbiddenException(
        "Không được phép xem thông tin đặt lịch này."
      );
    }

    return booking;
  }

  /**
   * Update booking (reschedule)
   */
  async updateBooking(
    bookingId: string,
    userId: Types.ObjectId,
    data: {
      scheduledDate?: string;
      startTime?: string;
      employeeId?: string;
      customerNotes?: string;
    }
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const booking = await BookingModel.findById(bookingId).session(session);

      if (!booking) {
        throw new NotFoundException("Không tìm thấy lịch đặt");
      }

      // Check permissions
      if (booking.customerId.toString() !== userId.toString()) {
        throw new ForbiddenException(
          "Không được phép cập nhật thông tin đặt lịch này."
        );
      }

      // Can only update pending/confirmed bookings
      if (
        booking.status !== BookingStatus.PENDING &&
        booking.status !== BookingStatus.CONFIRMED
      ) {
        throw new BadRequestException(
          "Không thể cập nhật đặt lịch ở trạng thái hiện tại."
        );
      }

      // Must be at least 24h before booking
      const bookingDateTime = new Date(booking.scheduledDate);
      const [hours, minutes] = booking.startTime.split(":").map(Number);
      bookingDateTime.setHours(hours, minutes, 0, 0);
      const hoursUntil =
        (bookingDateTime.getTime() - Date.now()) / (1000 * 60 * 60);

      if (hoursUntil < 24) {
        throw new BadRequestException(
          "Không thể thay đổi lịch đặt nếu thời gian còn lại dưới 24 giờ so với giờ dự kiến."
        );
      }

      // If changing date/time, validate availability
      if (data.scheduledDate || data.startTime || data.employeeId) {
        const newDate =
          data.scheduledDate ||
          booking.scheduledDate.toISOString().split("T")[0];
        const newTime = data.startTime || booking.startTime;
        const newEmployeeId = data.employeeId || booking.employeeId.toString();

        const calculator = new AvailabilityCalculator();
        const slots = await calculator.getAvailableSlots({
          employeeId: newEmployeeId,
          date: new Date(newDate),
          serviceId: booking.serviceId.toString(),
        });

        const requestedSlot = slots.find((s) => s.startTime === newTime);
        if (!requestedSlot || !requestedSlot.available) {
          throw new BadRequestException("Khung giờ đã chọn không khả dụng");
        }

        // Update fields
        if (data.scheduledDate)
          booking.scheduledDate = new Date(data.scheduledDate);
        if (data.startTime) {
          booking.startTime = data.startTime;
          const service = await mongoose
            .model("Service")
            .findById(booking.serviceId);
          booking.endTime = this.calculateEndTime(
            data.startTime,
            service!.duration + (service!.bufferTime || 0)
          );
        }
        if (data.employeeId)
          booking.employeeId = new mongoose.Types.ObjectId(data.employeeId);
      }

      if (data.customerNotes !== undefined) {
        booking.customerNotes = data.customerNotes;
      }

      await booking.save({ session });
      await session.commitTransaction();

      // Send update notification
      //   this.sendBookingUpdateNotification(bookingId);

      return booking;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Cancel booking
   */
  async cancelBooking(
    bookingId: string,
    userId: Types.ObjectId,
    userRole: string,
    reason: string
  ) {
    const booking = await BookingModel.findById(bookingId);

    if (!booking) {
      throw new Error("Lịch đặt không tìm thấy");
    }

    // Check if already cancelled
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException("Đặt lịch đã bị hủy");
    }

    // Check if can be cancelled
    if (
      booking.status === BookingStatus.COMPLETED ||
      booking.status === BookingStatus.NO_SHOW
    ) {
      throw new BadRequestException(
        "Không thể hủy các đặt lịch đã hoàn tất hoặc khách không đến."
      );
    }

    // Determine who is cancelling
    let initiator: "customer" | "employee" | "admin" | "system" = "customer";
    const isCustomer = booking.customerId.toString() === userId.toString();
    const isEmployee = booking.employeeId.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (isAdmin) {
      initiator = "admin";
    } else if (isEmployee) {
      initiator = "employee";
    } else if (!isCustomer) {
      throw new ForbiddenException("Không được phép hủy đặt lịch này.");
    }

    // Customer must cancel 24h before
    if (initiator === "customer") {
      const bookingDateTime = new Date(booking.scheduledDate);
      const [hours, minutes] = booking.startTime.split(":").map(Number);
      bookingDateTime.setHours(hours, minutes, 0, 0);
      const hoursUntil =
        (bookingDateTime.getTime() - Date.now()) / (1000 * 60 * 60);

      if (hoursUntil < 24) {
        throw new Error(
          "Khách hàng phải hủy đặt lịch ít nhất 24 giờ trước giờ đặt lịch. Vui lòng liên hệ với chúng tôi để được hỗ trợ."
        );
      }
    }

    // Update booking
    booking.status = BookingStatus.CANCELLED;
    booking.cancelledAt = new Date();
    booking.cancelledBy = new mongoose.Types.ObjectId(userId);
    booking.cancellationReason = reason;
    booking.cancellationInitiator = initiator;
    (booking as any).modifiedBy = new mongoose.Types.ObjectId(userId);
    (booking as any).statusChangeReason = reason;

    await booking.save();

    // Handle refund if paid
    if (booking.paymentStatus === PaymentStatus.PAID) {
      //   await this.processRefund(bookingId, initiator);
    }

    // Update stats
    const User = mongoose.model("User");
    await User.findByIdAndUpdate(booking.customerId, {
      $inc: { "customerInfo.stats.cancelledBookings": 1 },
    });

    if (initiator === "customer") {
      await User.findByIdAndUpdate(booking.employeeId, {
        $inc: { "employeeInfo.stats.cancelledBookings": 1 },
      });
    }

    // Send cancellation notification
    // this.sendCancellationNotification(bookingId);

    return booking;
  }

  /**
   * Update booking status (employee/admin only)
   */
  async updateStatus(
    bookingId: string,
    userId: Types.ObjectId,
    userRole: string,
    data: {
      status: BookingStatus;
      reason?: string;
      employeeNotes?: string;
    }
  ) {
    const booking = await BookingModel.findById(bookingId);

    if (!booking) {
      throw new Error("Không tìm thấy lịch đặt");
    }

    // Only employee/admin can update status
    const isEmployee = booking.employeeId.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (!isEmployee && !isAdmin) {
      throw new ForbiddenException(
        "Không được phép cập nhật trạng thái đặt chỗ"
      );
    }

    // Validate status transition
    this.validateStatusTransition(booking.status, data.status);

    // Update status
    booking.status = data.status;
    (booking as any).modifiedBy = new mongoose.Types.ObjectId(userId);
    (booking as any).statusChangeReason = data.reason;

    if (data.employeeNotes) {
      booking.employeeNotes = data.employeeNotes;
    }

    // Mark completion
    if (data.status === BookingStatus.COMPLETED) {
      booking.completedAt = new Date();
      booking.completedBy = new mongoose.Types.ObjectId(userId);

      // Update stats
      const User = mongoose.model("User");
      await Promise.all([
        User.findByIdAndUpdate(booking.customerId, {
          $inc: { "customerInfo.stats.completedBookings": 1 },
          $set: { "customerInfo.stats.lastBookingDate": new Date() },
        }),
        User.findByIdAndUpdate(booking.employeeId, {
          $inc: {
            "employeeInfo.stats.completedBookings": 1,
            "employeeInfo.stats.totalRevenue": booking.totalAmount,
          },
        }),
      ]);
    }

    // Mark no-show
    if (data.status === BookingStatus.NO_SHOW) {
      const User = mongoose.model("User");
      await User.findByIdAndUpdate(booking.customerId, {
        $inc: { "customerInfo.stats.noShowCount": 1 },
      });
    }

    await booking.save();

    // Send status update notification
    // this.sendStatusUpdateNotification(bookingId, data.status);

    return booking;
  }

  /**
   * Add rating to completed booking
   */
  async addRating(
    bookingId: string,
    userId: Types.ObjectId,
    data: {
      score: number;
      feedback?: string;
    }
  ) {
    const booking = await BookingModel.findById(bookingId);

    if (!booking) {
      throw new NotFoundException("Không tìm thấy lịch đặt");
    }

    // Only customer can rate
    if (booking.customerId.toString() !== userId.toString()) {
      throw new ForbiddenException(
        "Chỉ khách hàng mới có thể đánh giá đặt phòng này."
      );
    }

    // Must be completed
    if (booking.status !== BookingStatus.COMPLETED) {
      throw new BadRequestException(
        "Chỉ có thể đánh giá các đặt chỗ đã hoàn tất."
      );
    }

    // Check if already rated
    if (booking.rating) {
      throw new BadRequestException("Booking đã được đánh giá");
    }

    // Add rating
    booking.rating = {
      score: data.score,
      feedback: data.feedback,
      ratedAt: new Date(),
    };

    await booking.save();

    // Update employee rating
    await this.updateEmployeeRating(booking.employeeId.toString(), data.score);

    return booking;
  }

  /**
   * Get booking statistics
   */
  async getStatistics(filters: {
    employeeId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const query: any = {};

    if (filters.employeeId) query.employeeId = filters.employeeId;
    if (filters.startDate || filters.endDate) {
      query.scheduledDate = {};
      if (filters.startDate) query.scheduledDate.$gte = filters.startDate;
      if (filters.endDate) query.scheduledDate.$lte = filters.endDate;
    }

    const [totalBookings, byStatus, totalRevenue, averageRating] =
      await Promise.all([
        BookingModel.countDocuments(query),
        BookingModel.aggregate([
          { $match: query },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        BookingModel.aggregate([
          { $match: { ...query, status: BookingStatus.COMPLETED } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
        BookingModel.aggregate([
          { $match: { ...query, "rating.score": { $exists: true } } },
          { $group: { _id: null, avg: { $avg: "$rating.score" } } },
        ]),
      ]);

    return {
      totalBookings,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>),
      totalRevenue: totalRevenue[0]?.total || 0,
      averageRating: averageRating[0]?.avg || 0,
    };
  }

  /**
   * Tính giờ kết thúc của booking
   * @param startTime ví dụ "09:30"
   * @param durationMinutes ví dụ 90
   * @returns "11:00"
   */
  private calculateEndTime(startTime: string, durationMinutes: number): string {
    const [hour, minute] = startTime.split(":").map(Number);

    const startInMinutes = hour * 60 + minute;
    const endInMinutes = startInMinutes + durationMinutes;

    const endHour = Math.floor(endInMinutes / 60);
    const endMinute = endInMinutes % 60;

    return `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(
      2,
      "0"
    )}`;
  }

  /**
   * Tìm nhân viên có thể nhận booking
   * @returns employeeId hoặc null
   */
  private async findAvailableEmployee(
    serviceId: string,
    scheduledDate: string,
    startTime: string
  ): Promise<string | null> {
    // 1. Lấy service
    const Service = mongoose.model("Service");
    const service = await Service.findById(serviceId);
    if (!service) return null;

    // 2. Tìm employee hợp lệ
    const User = mongoose.model("User");

    const query: any = {
      role: { $in: ["employee", "admin"] },
      status: "active",
      "employeeInfo.isAcceptingBookings": true,
      "employeeInfo.vacationMode": false,
    };

    // Nếu service yêu cầu chuyên môn
    if (service.requiresSpecialty) {
      query["employeeInfo.specialties"] = service.requiresSpecialty;
    }

    const employees = await User.find(query);

    // 3. Kiểm tra lịch từng employee
    const calculator = new AvailabilityCalculator();

    for (const employee of employees) {
      const slots = await calculator.getAvailableSlots({
        employeeId: employee._id.toString(),
        date: new Date(scheduledDate),
        serviceId,
      });

      const matchedSlot = slots.find(
        (slot) => slot.startTime === startTime && slot.available
      );

      if (matchedSlot) {
        return employee._id.toString();
      }
    }

    // 4. Không ai rảnh
    return null;
  }

  /**
   * Kiểm tra xem booking có được đổi trạng thái không
   */
  private validateStatusTransition(
    currentStatus: BookingStatus,
    newStatus: BookingStatus
  ): void {
    const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
      [BookingStatus.PENDING]: [
        BookingStatus.CONFIRMED,
        BookingStatus.CANCELLED,
      ],
      [BookingStatus.CONFIRMED]: [
        BookingStatus.IN_PROGRESS,
        BookingStatus.CANCELLED,
        BookingStatus.NO_SHOW,
      ],
      [BookingStatus.IN_PROGRESS]: [
        BookingStatus.COMPLETED,
        BookingStatus.CANCELLED,
      ],
      [BookingStatus.COMPLETED]: [],
      [BookingStatus.CANCELLED]: [],
      [BookingStatus.NO_SHOW]: [],
    };

    const allowedNextStatuses = allowedTransitions[currentStatus];

    if (!allowedNextStatuses.includes(newStatus)) {
      throw new Error(`Không thể chuyển từ ${currentStatus} sang ${newStatus}`);
    }
  }

  /**
   * Cập nhật rating trung bình cho employee
   */
  private async updateEmployeeRating(
    employeeId: string,
    newRating: number
  ): Promise<void> {
    const User = mongoose.model("User");
    const employee = await User.findById(employeeId);

    if (!employee?.employeeInfo) return;

    const { rating, completedBookings } = employee.employeeInfo.stats;

    const totalRating = rating * (completedBookings - 1) + newRating;

    const averageRating = totalRating / completedBookings;

    await User.findByIdAndUpdate(employeeId, {
      $set: { "employeeInfo.stats.rating": averageRating },
    });
  }

  private async processRefund() {
    // TODO: tích hợp cổng thanh toán
  }

  private async sendBookingConfirmation() {
    // TODO: gửi email / socket
  }
}

export const bookingService = new BookingService();
