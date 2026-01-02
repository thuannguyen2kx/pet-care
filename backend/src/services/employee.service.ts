import mongoose from "mongoose";
import { ShiftTemplateModel } from "../models/shift-template.model";
import { ShiftOverrideModel } from "../models/shift-override.model";
import { BreakTemplateModel } from "../models/break-time.model";
import { Roles } from "../enums/role.enum";
import { BadRequestException } from "../utils/app-error";

class EmployeeService {
  /**
   * Get all employees with filters
   */
  async getEmployees(filters: {
    status?: string;
    specialty?: string;
    isAcceptingBookings?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const query: any = {
      role: { $in: ["employee", "admin"] },
    };

    if (filters.status) query.status = filters.status;
    if (filters.specialty) {
      query["employeeInfo.specialties"] = filters.specialty;
    }
    if (filters.isAcceptingBookings !== undefined) {
      query["employeeInfo.isAcceptingBookings"] = filters.isAcceptingBookings;
    }
    if (filters.search) {
      query.$or = [
        { fullName: { $regex: filters.search, $options: "i" } },
        { email: { $regex: filters.search, $options: "i" } },
      ];
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const User = mongoose.model("User");
    const [employees, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .sort({ "employeeInfo.stats.rating": -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    return {
      employees,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get employee by ID with full details
   */
  async getEmployeeById(employeeId: string) {
    const User = mongoose.model("User");
    const employee = await User.findOne({
      _id: employeeId,
      role: { $in: [Roles.EMPLOYEE, Roles.ADMIN] },
    }).select("-password");

    if (!employee) {
      throw new BadRequestException("Nhân viên không tồn tại");
    }

    // Get additional data
    const [shifts, breaks, stats] = await Promise.all([
      this.getEmployeeShifts(employeeId),
      this.getEmployeeBreaks(employeeId),
      this.getEmployeeStats(employeeId),
    ]);

    return {
      employee,
      schedule: {
        shifts,
        breaks,
      },
      stats,
    };
  }

  /**
   * Update employee profile
   */
  async updateEmployeeProfile(
    employeeId: string,
    data: {
      specialties?: string[];
      certifications?: string[];
      experience?: string;
      hourlyRate?: number;
      commissionRate?: number;
      maxDailyBookings?: number;
      isAcceptingBookings?: boolean;
      vacationMode?: boolean;
    }
  ) {
    const User = mongoose.model("User");
    const employee = await User.findOne({
      _id: employeeId,
      role: { $in: ["employee", "admin"] },
    });

    if (!employee) {
      throw new BadRequestException("Nhân viên không tồn tại");
    }

    // Update employeeInfo
    if (!employee.employeeInfo) {
      throw new BadRequestException("Thông tin nhân viên chưa được khởi tạo");
    }

    Object.keys(data).forEach((key) => {
      if (data[key as keyof typeof data] !== undefined) {
        (employee.employeeInfo as any)[key] = data[key as keyof typeof data];
      }
    });

    await employee.save();
    return employee;
  }

  /**
   * Create shift template
   */
  async createShiftTemplate(data: {
    employeeId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    effectiveFrom: string;
    effectiveTo?: string;
  }) {
    // Validate employee exists
    const User = mongoose.model("User");
    const employee = await User.findOne({
      _id: data.employeeId,
      role: { $in: [Roles.EMPLOYEE, Roles.ADMIN] },
    });

    if (!employee) {
      throw new BadRequestException("Nhân viên không tồn tại");
    }

    // Check for overlapping shifts
    const existing = await ShiftTemplateModel.findOne({
      employeeId: data.employeeId,
      dayOfWeek: data.dayOfWeek,
      isActive: true,
      effectiveFrom: { $lte: new Date(data.effectiveFrom) },
      $or: [
        { effectiveTo: { $gte: new Date(data.effectiveFrom) } },
        { effectiveTo: null },
      ],
    });

    if (existing) {
      throw new Error(
        `Ca làm việc cho ngày ${this.getDayName(data.dayOfWeek)} đã tồn tại. ` +
          `Vui lòng vô hiệu hóa hoặc cập nhật ca làm việc hiện tại.`
      );
    }

    const shift = await ShiftTemplateModel.create({
      employeeId: data.employeeId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      effectiveFrom: new Date(data.effectiveFrom),
      effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : null,
    });

    return shift;
  }

  /**
   * Bulk create shifts (weekly schedule)
   */
  async bulkCreateShifts(data: {
    employeeId: string;
    shifts: Array<{
      dayOfWeek: number;
      startTime: string;
      endTime: string;
    }>;
    effectiveFrom: string;
    effectiveTo?: string;
  }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Validate employee
      const User = mongoose.model("User");
      const employee = await User.findOne({
        _id: data.employeeId,
        role: { $in: [Roles.EMPLOYEE, Roles.ADMIN] },
      }).session(session);

      if (!employee) {
        throw new BadRequestException("Nhân viên không tồn tại");
      }

      // Deactivate existing shifts
      await ShiftTemplateModel.updateMany(
        {
          employeeId: data.employeeId,
          isActive: true,
        },
        {
          isActive: false,
          effectiveTo: new Date(data.effectiveFrom),
        },
        { session }
      );

      // Create new shifts
      const shifts = await ShiftTemplateModel.create(
        data.shifts.map((shift) => ({
          employeeId: data.employeeId,
          dayOfWeek: shift.dayOfWeek,
          startTime: shift.startTime,
          endTime: shift.endTime,
          effectiveFrom: new Date(data.effectiveFrom),
          effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : null,
        })),
        { session }
      );

      await session.commitTransaction();
      return shifts;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get employee shifts
   */
  async getEmployeeShifts(employeeId: string, date?: Date) {
    const query: any = {
      employeeId,
      isActive: true,
    };

    if (date) {
      query.effectiveFrom = { $lte: date };
      query.$or = [{ effectiveTo: { $gte: date } }, { effectiveTo: null }];
    }

    const shifts = await ShiftTemplateModel.find(query)
      .sort({ dayOfWeek: 1 })
      .lean();

    return shifts;
  }

  /**
   * Update shift template
   */
  async updateShiftTemplate(
    shiftId: string,
    data: {
      startTime?: string;
      endTime?: string;
      effectiveTo?: string;
      isActive?: boolean;
    }
  ) {
    const shift = await ShiftTemplateModel.findById(shiftId);

    if (!shift) {
      throw new BadRequestException("Ca làm việc không tồn tại");
    }

    if (data.startTime) shift.startTime = data.startTime;
    if (data.endTime) shift.endTime = data.endTime;
    if (data.effectiveTo) shift.effectiveTo = new Date(data.effectiveTo);
    if (data.isActive !== undefined) shift.isActive = data.isActive;

    await shift.save();
    return shift;
  }

  /**
   * Delete shift template
   */
  async deleteShiftTemplate(shiftId: string) {
    const shift = await ShiftTemplateModel.findById(shiftId);

    if (!shift) {
      throw new BadRequestException("Ca làm việc không tồn tại");
    }

    // Soft delete by deactivating
    shift.isActive = false;
    shift.effectiveTo = new Date();
    await shift.save();

    return { message: "Đã xoá ca làm việc" };
  }

  /**
   * Create shift override
   */
  async createShiftOverride(
    data: {
      employeeId: string;
      date: string;
      isWorking: boolean;
      startTime?: string;
      endTime?: string;
      reason?: string;
    },
    createdBy: string
  ) {
    // Validate employee
    const User = mongoose.model("User");
    const employee = await User.findOne({
      _id: data.employeeId,
      role: { $in: ["employee", "admin"] },
    });

    if (!employee) {
      throw new BadRequestException("Nhân viên không tồn tại");
    }

    // Check for existing override
    const existing = await ShiftOverrideModel.findOne({
      employeeId: data.employeeId,
      date: new Date(data.date),
    });

    if (existing) {
      throw new BadRequestException("Ngày này đã có lịch làm việc ngoại lệ");
    }

    // Validate working hours if isWorking
    if (data.isWorking && (!data.startTime || !data.endTime)) {
      throw new BadRequestException("Vui lòng chọn thời gian làm việc");
    }

    const override = await ShiftOverrideModel.create({
      employeeId: data.employeeId,
      date: new Date(data.date),
      isWorking: data.isWorking,
      startTime: data.startTime,
      endTime: data.endTime,
      reason: data.reason,
      createdBy: createdBy,
    });

    return override;
  }

  /**
   * Get shift overrides
   */
  async getShiftOverrides(
    employeeId: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const query: any = { employeeId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const overrides = await ShiftOverrideModel.find(query)
      .populate("createdBy", "fullName")
      .sort({ date: 1 })
      .lean();

    return overrides;
  }

  /**
   * Update shift override
   */
  async updateShiftOverride(
    overrideId: string,
    data: {
      isWorking?: boolean;
      startTime?: string;
      endTime?: string;
      reason?: string;
    }
  ) {
    const override = await ShiftOverrideModel.findById(overrideId);

    if (!override) {
      throw new BadRequestException(
        "Thời gian làm việc ngoại lệ không tồn tại"
      );
    }

    if (data.isWorking !== undefined) override.isWorking = data.isWorking;
    if (data.startTime) override.startTime = data.startTime;
    if (data.endTime) override.endTime = data.endTime;
    if (data.reason !== undefined) override.reason = data.reason;

    await override.save();
    return override;
  }

  /**
   * Delete shift override
   */
  async deleteShiftOverride(overrideId: string) {
    const result = await ShiftOverrideModel.findByIdAndDelete(overrideId);

    if (!result) {
      throw new BadRequestException(
        "Thời gian làm việc ngoại lệ không tồn tại"
      );
    }

    return { message: "Thời gian làm việc ngoại lệ đã xoá" };
  }

  /**
   * Create break template
   */
  async createBreakTemplate(data: {
    employeeId: string;
    dayOfWeek?: number;
    startTime: string;
    endTime: string;
    name: string;
    effectiveFrom: string;
    effectiveTo?: string;
  }) {
    const User = mongoose.model("User");
    const employee = await User.findOne({
      _id: data.employeeId,
      role: { $in: ["employee", "admin"] },
    });

    if (!employee) {
      throw new BadRequestException("Nhân viên không tồn tại");
    }

    const breakTemplate = await BreakTemplateModel.create({
      employeeId: data.employeeId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      name: data.name,
      effectiveFrom: new Date(data.effectiveFrom),
      effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : null,
    });

    return breakTemplate;
  }

  /**
   * Get employee breaks
   */
  async getEmployeeBreaks(employeeId: string) {
    const breaks = await BreakTemplateModel.find({
      employeeId,
      isActive: true,
    })
      .sort({ dayOfWeek: 1, startTime: 1 })
      .lean();

    return breaks;
  }

  /**
   * Update break template
   */
  async updateBreakTemplate(
    breakId: string,
    data: {
      startTime?: string;
      endTime?: string;
      name?: string;
      isActive?: boolean;
    }
  ) {
    const breakTemplate = await BreakTemplateModel.findById(breakId);

    if (!breakTemplate) {
      throw new BadRequestException("Không tìm thấy thời gian nghỉ");
    }

    if (data.startTime) breakTemplate.startTime = data.startTime;
    if (data.endTime) breakTemplate.endTime = data.endTime;
    if (data.name) breakTemplate.name = data.name;
    if (data.isActive !== undefined) breakTemplate.isActive = data.isActive;

    await breakTemplate.save();
    return breakTemplate;
  }

  /**
   * Delete break template
   */
  async deleteBreakTemplate(breakId: string) {
    const breakTemplate = await BreakTemplateModel.findById(breakId);

    if (!breakTemplate) {
      throw new BadRequestException("Thời gian nghỉ không tồn tại");
    }

    breakTemplate.isActive = false;
    await breakTemplate.save();

    return { message: "Xoá thời gian nghỉ thành công" };
  }

  /**
   * Get employee statistics
   */
  async getEmployeeStats(employeeId: string, startDate?: Date, endDate?: Date) {
    const Booking = mongoose.model("Booking");
    const query: any = {
      employeeId,
      status: { $in: ["completed", "cancelled", "no-show"] },
    };

    if (startDate || endDate) {
      query.scheduledDate = {};
      if (startDate) query.scheduledDate.$gte = startDate;
      if (endDate) query.scheduledDate.$lte = endDate;
    }

    const [bookings, ratings] = await Promise.all([
      Booking.aggregate([
        { $match: query },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            revenue: { $sum: "$totalAmount" },
          },
        },
      ]),
      Booking.aggregate([
        {
          $match: {
            ...query,
            "rating.score": { $exists: true },
          },
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating.score" },
            totalRatings: { $sum: 1 },
          },
        },
      ]),
    ]);

    const stats = {
      totalBookings: 0,
      completed: 0,
      cancelled: 0,
      noShow: 0,
      totalRevenue: 0,
      averageRating: 0,
      totalRatings: 0,
    };

    bookings.forEach((item) => {
      stats.totalBookings += item.count;
      if (item._id === "completed") {
        stats.completed = item.count;
        stats.totalRevenue = item.revenue;
      } else if (item._id === "cancelled") {
        stats.cancelled = item.count;
      } else if (item._id === "no-show") {
        stats.noShow = item.count;
      }
    });

    if (ratings.length > 0) {
      stats.averageRating = ratings[0].averageRating;
      stats.totalRatings = ratings[0].totalRatings;
    }

    return stats;
  }

  /**
   * Get employee schedule for date range
   */
  async getEmployeeSchedule(
    employeeId: string,
    startDate: Date,
    endDate: Date
  ) {
    const days: Array<{
      date: Date;
      dayOfWeek: number;
      isWorking: boolean;
      startTime?: string;
      endTime?: string;
      breaks: Array<{ name: string; startTime: string; endTime: string }>;
      override?: boolean;
      reason?: string;
    }> = [];

    // Get shift templates
    const shifts = await this.getEmployeeShifts(employeeId, startDate);
    const shiftsByDay = shifts.reduce((acc, shift) => {
      acc[shift.dayOfWeek] = shift;
      return acc;
    }, {} as Record<number, any>);

    // Get overrides
    const overrides = await this.getShiftOverrides(
      employeeId,
      startDate,
      endDate
    );
    const overridesByDate = overrides.reduce((acc, override) => {
      const dateKey = override.date.toISOString().split("T")[0];
      acc[dateKey] = override;
      return acc;
    }, {} as Record<string, any>);

    // Get breaks
    const breaks = await this.getEmployeeBreaks(employeeId);

    // Generate schedule
    const current = new Date(startDate);
    while (current <= endDate) {
      const dateKey = current.toISOString().split("T")[0];
      const dayOfWeek = current.getDay();
      const override = overridesByDate[dateKey];

      let day: any = {
        date: new Date(current),
        dayOfWeek,
        isWorking: false,
        breaks: [],
      };

      if (override) {
        // Override takes precedence
        day.isWorking = override.isWorking;
        day.startTime = override.startTime;
        day.endTime = override.endTime;
        day.override = true;
        day.reason = override.reason;
      } else if (shiftsByDay[dayOfWeek]) {
        // Use template
        const shift = shiftsByDay[dayOfWeek];
        day.isWorking = true;
        day.startTime = shift.startTime;
        day.endTime = shift.endTime;
      }

      // Add breaks if working
      if (day.isWorking) {
        day.breaks = breaks
          .filter((b) => !b.dayOfWeek || b.dayOfWeek === dayOfWeek)
          .map((b) => ({
            name: b.name,
            startTime: b.startTime,
            endTime: b.endTime,
          }));
      }

      days.push(day);
      current.setDate(current.getDate() + 1);
    }

    return days;
  }

  // Helper methods
  private getDayName(dayOfWeek: number): string {
    const days = [
      "Chủ nhật",
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
    ];
    return days[dayOfWeek];
  }
}

export const employeeService = new EmployeeService();
