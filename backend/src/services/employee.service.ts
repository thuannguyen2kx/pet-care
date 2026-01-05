import mongoose, { Types } from "mongoose";
import { ShiftTemplateModel } from "../models/shift-template.model";
import { ShiftOverrideModel } from "../models/shift-override.model";
import { BreakTemplateModel } from "../models/break-time.model";
import { Roles } from "../enums/role.enum";
import { BadRequestException } from "../utils/app-error";
import UserModel from "../models/user.model";
import {
  getDatesForDayOfWeek,
  getDatesInRange,
  parseDateOnly,
} from "../utils/format-date";
import { UserStatus } from "../enums/status-user.enum";
import { format } from "date-fns";

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
    const [shifts, overrides, breaks] = await Promise.all([
      this.getAllEmployeeShifts(employeeId),
      this.getShiftOverrides(employeeId),
      this.getEmployeeBreaks(employeeId),
      // this.getEmployeeStats(employeeId),
    ]);

    return {
      employee,
      schedule: {
        shifts,
        overrides,
        breaks,
      },
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
      effectiveFrom: { $lte: parseDateOnly(data.effectiveFrom) },
      $or: [
        { effectiveTo: { $gte: parseDateOnly(data.effectiveFrom) } },
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
      effectiveFrom: parseDateOnly(data.effectiveFrom),
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
      const User = mongoose.model("User");
      const employee = await User.findOne({
        _id: data.employeeId,
        role: { $in: [Roles.EMPLOYEE, Roles.ADMIN] },
      }).session(session);

      if (!employee) {
        throw new BadRequestException("Nhân viên không tồn tại");
      }

      const effectiveFromDate = parseDateOnly(data.effectiveFrom);
      const effectiveToDate = data.effectiveTo
        ? parseDateOnly(data.effectiveTo)
        : null;

      await ShiftTemplateModel.updateMany(
        {
          employeeId: data.employeeId,
          isActive: true,
        },
        {
          isActive: false,
          effectiveTo: effectiveFromDate,
        },
        { session }
      );

      const docs = data.shifts.map((shift) => ({
        employeeId: data.employeeId,
        dayOfWeek: shift.dayOfWeek,
        startTime: shift.startTime,
        endTime: shift.endTime,
        effectiveFrom: effectiveFromDate,
        effectiveTo: effectiveToDate,
        isActive: true,
      }));

      const shifts = await ShiftTemplateModel.insertMany(docs, {
        session,
        ordered: true,
      });

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
   * Get all active shift templates of employee
   */
  async getAllEmployeeShifts(employeeId: string) {
    return ShiftTemplateModel.find({
      employeeId,
      isActive: true,
    })
      .sort({ dayOfWeek: 1, effectiveFrom: -1 })
      .lean();
  }

  /**
   * Get employee schedule for ONE date
   */
  async getEmployeeScheduleByDate(employeeId: string, date: Date) {
    const dayOfWeek = this.getISODayOfWeek(date); // 0 = Monday

    const override = await ShiftOverrideModel.findOne({
      employeeId,
      date,
    }).lean();

    if (override) {
      return {
        date: format(date, "yyyy-MM-dd"),
        dayOfWeek,
        isWorking: override.isWorking,
        startTime: override.isWorking ? override.startTime : undefined,
        endTime: override.isWorking ? override.endTime : undefined,
        breaks: [],
        override: true,
        reason: override.reason,
      };
    }

    const shift = await ShiftTemplateModel.findOne({
      employeeId,
      dayOfWeek,
      isActive: true,
      effectiveFrom: { $lte: date },
      $or: [{ effectiveTo: { $gte: date } }, { effectiveTo: null }],
    }).lean();

    if (!shift) {
      return {
        date: format(date, "yyyy-MM-dd"),
        dayOfWeek,
        isWorking: false,
        breaks: [],
      };
    }

    const breaks = await BreakTemplateModel.find({
      employeeId,
      isActive: true,
      effectiveFrom: { $lte: date },

      $and: [
        {
          $or: [{ dayOfWeek }, { dayOfWeek: null }],
        },
        {
          $or: [{ effectiveTo: { $gte: date } }, { effectiveTo: null }],
        },
      ],
    }).lean();

    return {
      date: format(date, "yyyy-MM-dd"),
      dayOfWeek,
      isWorking: true,
      startTime: shift.startTime,
      endTime: shift.endTime,
      breaks: breaks.map((b) => ({
        name: b.name,
        startTime: b.startTime,
        endTime: b.endTime,
      })),
    };
  }

  /**
   * Get employee shift templates overlapping date range
   * dayOfWeek: 0 (Monday) → 6 (Sunday)
   */
  async getEmployeeShifts(employeeId: string, startDate: Date, endDate: Date) {
    const query = {
      employeeId,
      isActive: true,
      effectiveFrom: { $lte: endDate },
      $or: [{ effectiveTo: { $gte: startDate } }, { effectiveTo: null }],
    };

    return ShiftTemplateModel.find(query).sort({ dayOfWeek: 1 }).lean();
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
  async replaceShiftTemplate(
    shiftId: string,
    data: {
      startTime: string;
      endTime: string;
      effectiveFrom: string;
    }
  ) {
    const oldShift = await ShiftTemplateModel.findById(shiftId);
    if (!oldShift) throw new BadRequestException("Không tồn tại");

    const from = parseDateOnly(data.effectiveFrom);

    // Close old
    oldShift.effectiveTo = from;
    oldShift.isActive = false;
    await oldShift.save();

    // Create new
    return ShiftTemplateModel.create({
      employeeId: oldShift.employeeId,
      dayOfWeek: oldShift.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      effectiveFrom: from,
      isActive: true,
    });
  }

  async disableShiftTemplate(
    shiftId: string,
    payload: { effectiveTo: string }
  ) {
    const shift = await ShiftTemplateModel.findById(shiftId);
    if (!shift) {
      throw new BadRequestException("Ca làm việc không tồn tại");
    }

    const to = parseDateOnly(payload.effectiveTo);
    const from = parseDateOnly(shift.effectiveFrom.toString());

    if (to < from) {
      throw new BadRequestException("Ngày kết thúc không hợp lệ");
    }

    shift.effectiveTo = to;

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
    if (shift.effectiveFrom <= parseDateOnly(Date.now().toString())) {
      throw new BadRequestException("Không thể xoá ca đã áp dụng");
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
      role: { $in: [Roles.EMPLOYEE] },
    });

    if (!employee) {
      throw new BadRequestException("Nhân viên không tồn tại");
    }

    // Check for existing override
    const existing = await ShiftOverrideModel.findOne({
      employeeId: data.employeeId,
      date: parseDateOnly(data.date),
    });

    if (existing) {
      throw new BadRequestException("Ngày này đã có lịch làm việc ngoại lệ");
    }

    // Validate working hours if isWorking
    if (data.isWorking) {
      if (!data.startTime || !data.endTime) {
        throw new BadRequestException("Vui lòng chọn thời gian làm việc");
      }

      if (data.endTime <= data.startTime) {
        throw new BadRequestException("Giờ kết thúc phải sau giờ bắt đầu");
      }
    }

    const override = await ShiftOverrideModel.create({
      employeeId: data.employeeId,
      date: parseDateOnly(data.date),
      isWorking: data.isWorking,
      startTime: data.isWorking ? data.startTime : undefined,
      endTime: data.isWorking ? data.endTime : undefined,
      reason: data.reason,
      createdBy,
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
      role: { $in: [Roles.EMPLOYEE, Roles.ADMIN] },
    });

    if (!employee) {
      throw new BadRequestException("Nhân viên không tồn tại");
    }

    if (data.endTime <= data.startTime) {
      throw new BadRequestException("Giờ kết thúc phải sau giờ bắt đầu");
    }

    const normalize = (d: string) => {
      const date = new Date(d);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    const effectiveFrom = normalize(data.effectiveFrom);
    const effectiveTo = data.effectiveTo ? normalize(data.effectiveTo) : null;

    if (effectiveTo && effectiveTo < effectiveFrom) {
      throw new BadRequestException("Ngày kết thúc phải sau ngày bắt đầu");
    }

    const overlap = await BreakTemplateModel.findOne({
      employeeId: data.employeeId,
      isActive: true,
      dayOfWeek: data.dayOfWeek ?? null,
      effectiveFrom: { $lte: effectiveTo ?? effectiveFrom },
      $or: [{ effectiveTo: { $gte: effectiveFrom } }, { effectiveTo: null }],
      startTime: { $lt: data.endTime },
      endTime: { $gt: data.startTime },
    });

    if (overlap) {
      throw new BadRequestException(
        "Khoảng nghỉ bị trùng với break đã tồn tại"
      );
    }

    return BreakTemplateModel.create({
      employeeId: data.employeeId,
      dayOfWeek: data.dayOfWeek ?? null,
      startTime: data.startTime,
      endTime: data.endTime,
      name: data.name,
      effectiveFrom,
      effectiveTo,
    });
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
   * Get employee breaks for specific date
   * dayOfWeek: 0 (Monday) → 6 (Sunday)
   */
  async getEmployeeBreaksForDate(employeeId: string, date: Date) {
    const dayOfWeek = this.getISODayOfWeek(date);

    return BreakTemplateModel.find({
      employeeId,
      isActive: true,
      effectiveFrom: { $lte: date },

      $and: [
        {
          $or: [{ dayOfWeek }, { dayOfWeek: null }],
        },
        {
          $or: [{ effectiveTo: { $gte: date } }, { effectiveTo: null }],
        },
      ],
    })
      .sort({ startTime: 1 })
      .lean();
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
    const Booking = mongoose.model("Appointment");
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
   * dayOfWeek: 0 (Monday) → 6 (Sunday)
   */
  async getEmployeeSchedule(
    employeeId: string,
    startDate: Date,
    endDate: Date
  ) {
    const days: Array<{
      date: string; // YYYY-MM-DD
      dayOfWeek: number;
      isWorking: boolean;
      startTime?: string;
      endTime?: string;
      breaks: Array<{
        name: string;
        startTime: string;
        endTime: string;
      }>;
      override?: boolean;
      reason?: string;
    }> = [];

    /* -------------------- Normalize date range -------------------- */
    const start = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );

    const end = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );

    /* -------------------- Load data -------------------- */

    // Shift templates (effective in range)
    const shifts = await this.getEmployeeShifts(employeeId, start, end);

    const shiftsByDay = shifts.reduce((acc, shift) => {
      if (!acc[shift.dayOfWeek]) acc[shift.dayOfWeek] = [];
      acc[shift.dayOfWeek].push(shift);
      return acc;
    }, {} as Record<number, any[]>);

    // Overrides
    const overrides = await this.getShiftOverrides(employeeId, start, end);

    const overridesByDate = overrides.reduce((acc, override) => {
      const key = format(override.date, "yyyy-MM-dd");
      acc[key] = override;
      return acc;
    }, {} as Record<string, any>);

    // Break templates
    const breaks = await this.getEmployeeBreaks(employeeId);

    /* -------------------- Generate schedule -------------------- */

    let current = new Date(start);

    while (current <= end) {
      const dateKey = format(current, "yyyy-MM-dd");
      const dayOfWeek = this.getDayOfWeek0Monday(current);
      const override = overridesByDate[dateKey];

      const day: any = {
        date: dateKey,
        dayOfWeek,
        isWorking: false,
        breaks: [],
      };

      /* ---------- 1. Override (highest priority) ---------- */
      if (override) {
        day.override = true;
        day.reason = override.reason;
        day.isWorking = override.isWorking;

        if (override.isWorking) {
          day.startTime = override.startTime;
          day.endTime = override.endTime;
        }
      } else if (shiftsByDay[dayOfWeek]) {
        /* ---------- 2. Shift template ---------- */
        const shift = shiftsByDay[dayOfWeek].find(
          (s) =>
            s.effectiveFrom <= current &&
            (!s.effectiveTo || s.effectiveTo >= current)
        );

        if (shift) {
          day.isWorking = true;
          day.startTime = shift.startTime;
          day.endTime = shift.endTime;
        }
      }

      /* ---------- 3. Breaks ---------- */
      if (day.isWorking) {
        const dayBreaks = await this.getEmployeeBreaksForDate(
          employeeId,
          current
        );

        day.breaks = dayBreaks.map((b) => ({
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

  // /**
  //  * Get employee schedule for date range
  //  */
  // async getEmployeeSchedule(
  //   employeeId: string,
  //   startDate: Date,
  //   endDate: Date
  // ) {
  //   const days: Array<{
  //     date: Date;
  //     dayOfWeek: number;
  //     isWorking: boolean;
  //     startTime?: string;
  //     endTime?: string;
  //     breaks: Array<{ name: string; startTime: string; endTime: string }>;
  //     override?: boolean;
  //     reason?: string;
  //   }> = [];

  //   // Get shift templates
  //   const shifts = await this.getEmployeeShifts(employeeId, startDate);
  //   const shiftsByDay = shifts.reduce((acc, shift) => {
  //     if (!acc[shift.dayOfWeek]) acc[shift.dayOfWeek] = [];
  //     acc[shift.dayOfWeek].push(shift);
  //     return acc;
  //   }, {} as Record<number, any[]>);

  //   // Get overrides
  //   const overrides = await this.getShiftOverrides(
  //     employeeId,
  //     startDate,
  //     endDate
  //   );
  //   const overridesByDate = overrides.reduce((acc, override) => {
  //     // const dateKey = override.date.toISOString().split("T")[0];
  //     const dateKey = format(override.date, "yyyy-MM-dd");
  //     acc[dateKey] = override;
  //     return acc;
  //   }, {} as Record<string, any>);

  //   // Get breaks
  //   const breaks = await this.getEmployeeBreaks(employeeId);

  //   // Generate schedule
  //   let current = new Date(
  //     startDate.getFullYear(),
  //     startDate.getMonth(),
  //     startDate.getDate()
  //   );

  //   const end = new Date(
  //     endDate.getFullYear(),
  //     endDate.getMonth(),
  //     endDate.getDate()
  //   );

  //   while (current <= end) {
  //     const dateKey = format(current, "yyyy-MM-dd");
  //     const dayOfWeek = this.getISODayOfWeek(current);
  //     const override = overridesByDate[dateKey];

  //     let day: any = {
  //       // date: format(current, "yyyy-MM-dd"),
  //       date: format(current, "yyyy-MM-dd"),
  //       dayOfWeek,
  //       isWorking: false,
  //       breaks: [],
  //     };

  //     if (override) {
  //       // Override takes precedence
  //       day.isWorking = override.isWorking;
  //       if (override.isWorking) {
  //         day.startTime = override.startTime;
  //         day.endTime = override.endTime;
  //       }
  //       day.override = true;
  //       day.reason = override.reason;
  //     } else if (shiftsByDay[dayOfWeek]) {
  //       // Use template
  //       const dayShifts = shiftsByDay[dayOfWeek] || [];
  //       const shift = dayShifts.find(
  //         (s) =>
  //           s.effectiveFrom <= current &&
  //           (!s.effectiveTo || s.effectiveTo >= current)
  //       );
  //       day.isWorking = true;
  //       day.startTime = shift.startTime;
  //       day.endTime = shift.endTime;
  //     }

  //     // Add breaks if working
  //     if (day.isWorking) {
  //       day.breaks = breaks
  //         .filter((b) => b.dayOfWeek === null || b.dayOfWeek === dayOfWeek)
  //         .map((b) => ({
  //           name: b.name,
  //           startTime: b.startTime,
  //           endTime: b.endTime,
  //         }));
  //     }

  //     days.push(day);
  //     current.setDate(current.getDate() + 1);
  //   }

  //   return days;
  // }

  // async getTeamWeekSchedule(startDate: Date, endDate: Date) {
  //   // Build employee query
  //   const employeeQuery: any = {
  //     role: { $in: [Roles.EMPLOYEE] },
  //     status: UserStatus.ACTIVE,
  //   };

  //   // Get all employees
  //   const employees = await UserModel.find(employeeQuery)
  //     .select("fullName email profilePicture employeeInfo")
  //     .lean();

  //   if (employees.length === 0) {
  //     return {
  //       employees: [],
  //     };
  //   }

  //   const employeeIds_list = employees.map((e) => e._id);

  //   // Get shift templates for all employees
  //   const shiftTemplates = await ShiftTemplateModel.find({
  //     employeeId: { $in: employeeIds_list },
  //     isActive: true,
  //     $or: [
  //       { effectiveTo: { $exists: false } },
  //       { effectiveTo: null },
  //       { effectiveTo: { $gte: startDate } },
  //     ],
  //     effectiveFrom: { $lte: endDate },
  //   }).lean();

  //   // Get overrides for the date range
  //   const overrides = await ShiftOverrideModel.find({
  //     employeeId: { $in: employeeIds_list },
  //     date: { $gte: startDate, $lte: endDate },
  //   }).lean();

  //   // Get break templates
  //   const breakTemplates = await BreakTemplateModel.find({
  //     employeeId: { $in: employeeIds_list },
  //     isActive: true,
  //     $or: [
  //       { effectiveTo: { $exists: false } },
  //       { effectiveTo: null },
  //       { effectiveTo: { $gte: startDate } },
  //     ],
  //     effectiveFrom: { $lte: endDate },
  //   }).lean();

  //   // Build response for each employee
  //   const result: WeekScheduleResponse[] = employees.map((employee) => {
  //     const empId = employee._id.toString();

  //     // Get employee's shifts
  //     const empShifts = shiftTemplates.filter(
  //       (s) => s.employeeId.toString() === empId
  //     );

  //     // Get employee's overrides
  //     const empOverrides = overrides.filter(
  //       (o) => o.employeeId.toString() === empId
  //     );

  //     // Get employee's breaks
  //     const empBreaks = breakTemplates.filter(
  //       (b) => b.employeeId.toString() === empId
  //     );

  //     // Build week schedule (0-6 for Sun-Sat)
  //     const weekSchedule: WeekScheduleResponse["weekSchedule"] = {};

  //     for (let day = 0; day <= 6; day++) {
  //       // Find shift template for this day
  //       const shift = empShifts.find((s) => s.dayOfWeek === day);

  //       // Check if there's an override for any date in range with this day of week
  //       const dayDates = getDatesForDayOfWeek(startDate, endDate, day);
  //       const override = dayDates
  //         .map((date) =>
  //           empOverrides.find(
  //             (o) =>
  //               o.date.toISOString().split("T")[0] ===
  //               date.toISOString().split("T")[0]
  //           )
  //         )
  //         .find((o) => o !== undefined);

  //       // Get breaks for this day
  //       const dayBreaks = empBreaks
  //         .filter((b) => b.dayOfWeek === null || b.dayOfWeek === day)
  //         .map((b) => ({
  //           name: b.name,
  //           startTime: b.startTime,
  //           endTime: b.endTime,
  //         }));

  //       if (override) {
  //         // Override takes precedence
  //         weekSchedule[day] = {
  //           isWorking: override.isWorking,
  //           startTime: override.startTime,
  //           endTime: override.endTime,
  //           breaks: override.isWorking ? dayBreaks : [],
  //           override: {
  //             reason: override.reason || "",
  //             isWorking: override.isWorking,
  //           },
  //         };
  //       } else if (shift) {
  //         // Regular shift
  //         weekSchedule[day] = {
  //           isWorking: true,
  //           startTime: shift.startTime,
  //           endTime: shift.endTime,
  //           breaks: dayBreaks,
  //         };
  //       } else {
  //         // Not working
  //         weekSchedule[day] = {
  //           isWorking: false,
  //           breaks: [],
  //         };
  //       }
  //     }

  //     // Get default work hours from employeeInfo or calculate from shifts
  //     let defaultHours = { start: "09:00", end: "17:00" };
  //     if (employee.employeeInfo?.defaultSchedule?.workHours) {
  //       defaultHours = employee.employeeInfo.defaultSchedule.workHours;
  //     } else if (empShifts.length > 0) {
  //       defaultHours = {
  //         start: empShifts[0].startTime,
  //         end: empShifts[0].endTime,
  //       };
  //     }

  //     return {
  //       employeeId: empId,
  //       fullName: employee.fullName,
  //       email: employee.email,
  //       profilePicture: employee.profilePicture?.url,
  //       specialties: employee.employeeInfo?.specialties || [],
  //       workHours: defaultHours,
  //       weekSchedule,
  //     };
  //   }) as WeekScheduleResponse[];

  //   return {
  //     employees: result,
  //     period: {
  //       startDate,
  //       endDate,
  //     },
  //   };
  // }

  async getTeamWeekSchedule(startDate: Date, endDate: Date) {
    const employees = await UserModel.find({
      role: { $in: [Roles.EMPLOYEE] },
      status: UserStatus.ACTIVE,
    })
      .select("fullName email profilePicture employeeInfo")
      .lean();

    if (!employees.length) {
      return {
        period: { startDate, endDate },
        employees: [],
      };
    }

    const employeeIds = employees.map((e) => e._id);

    // ===== Fetch data =====
    const [shiftTemplates, overrides, breakTemplates] = await Promise.all([
      ShiftTemplateModel.find({
        employeeId: { $in: employeeIds },
        isActive: true,
        effectiveFrom: { $lte: endDate },
        $or: [
          { effectiveTo: { $exists: false } },
          { effectiveTo: null },
          { effectiveTo: { $gte: startDate } },
        ],
      }).lean(),

      ShiftOverrideModel.find({
        employeeId: { $in: employeeIds },
        date: { $gte: startDate, $lte: endDate },
      }).lean(),

      BreakTemplateModel.find({
        employeeId: { $in: employeeIds },
        isActive: true,
        effectiveFrom: { $lte: endDate },
        $or: [
          { effectiveTo: { $exists: false } },
          { effectiveTo: null },
          { effectiveTo: { $gte: startDate } },
        ],
      }).lean(),
    ]);

    // ===== Group data =====
    const shiftsByEmployee = this.groupBy(shiftTemplates, (s) =>
      s.employeeId.toString()
    );
    const overridesByEmployee = this.groupBy(overrides, (o) =>
      o.employeeId.toString()
    );
    const breaksByEmployee = this.groupBy(breakTemplates, (b) =>
      b.employeeId.toString()
    );

    const dates = getDatesInRange(startDate, endDate);

    // ===== Build response =====
    const result = employees.map((employee) => {
      const empId = employee._id.toString();

      const empShifts = shiftsByEmployee[empId] || [];
      const empOverrides = overridesByEmployee[empId] || [];
      const empBreaks = breaksByEmployee[empId] || [];

      const days = dates.map((date) => {
        const dateKey = format(date, "yyyy-MM-dd");
        const dayOfWeek = this.getISODayOfWeek(date);

        const override = empOverrides.find(
          (o) => o.date.toISOString().split("T")[0] === dateKey
        );

        const shift = empShifts.find(
          (s) =>
            s.dayOfWeek === dayOfWeek &&
            s.effectiveFrom <= date &&
            (!s.effectiveTo || s.effectiveTo >= date)
        );

        const breaks = empBreaks
          .filter((b) => b.dayOfWeek === null || b.dayOfWeek === dayOfWeek)
          .map((b) => ({
            name: b.name,
            startTime: b.startTime,
            endTime: b.endTime,
          }));

        if (override) {
          return {
            date: dateKey,
            dayOfWeek,
            isWorking: override.isWorking,
            startTime: override.startTime,
            endTime: override.endTime,
            breaks: override.isWorking ? breaks : [],
            override: {
              reason: override.reason,
            },
          };
        }

        if (shift) {
          return {
            date: dateKey,
            dayOfWeek,
            isWorking: true,
            startTime: shift.startTime,
            endTime: shift.endTime,
            breaks,
          };
        }

        return {
          date: dateKey,
          dayOfWeek,
          isWorking: false,
          breaks: [],
        };
      });

      const defaultHours =
        employee.employeeInfo?.defaultSchedule?.workHours ||
        (empShifts[0]
          ? {
              start: empShifts[0].startTime,
              end: empShifts[0].endTime,
            }
          : { start: "09:00", end: "17:00" });

      return {
        employeeId: empId,
        fullName: employee.fullName,
        email: employee.email,
        profilePicture: employee.profilePicture?.url,
        specialties: employee.employeeInfo?.specialties || [],
        workHours: defaultHours,
        days,
      };
    });

    return {
      period: { startDate, endDate },
      employees: result,
    };
  }

  async getEmployeeMonthSchedule({
    employeeId,
    year,
    month,
  }: {
    employeeId: string;
    year: number;
    month: number;
  }) {
    // Get employee
    const employee = await UserModel.findById(employeeId)
      .select("fullName email profilePicture employeeInfo")
      .lean();

    if (!employee) {
      throw new BadRequestException("Nhân viên không tồn tại");
    }

    // Calculate date range
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Get all data
    const [shiftTemplates, overrides, breakTemplates] = await Promise.all([
      ShiftTemplateModel.find({
        employeeId,
        isActive: true,
        $or: [
          { effectiveTo: { $exists: false } },
          { effectiveTo: null },
          { effectiveTo: { $gte: startDate } },
        ],
        effectiveFrom: { $lte: endDate },
      }).lean(),

      ShiftOverrideModel.find({
        employeeId,
        date: { $gte: startDate, $lte: endDate },
      }).lean(),

      BreakTemplateModel.find({
        employeeId,
        isActive: true,
        $or: [
          { effectiveTo: { $exists: false } },
          { effectiveTo: null },
          { effectiveTo: { $gte: startDate } },
        ],
        effectiveFrom: { $lte: endDate },
      }).lean(),
    ]);

    // Build schedule for each day of month
    const daysInMonth = new Date(year, month, 0).getDate();
    const schedule = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month - 1, day);
      const dayOfWeek = currentDate.getDay();
      const dateString = currentDate.toISOString().split("T")[0];

      // Check for override first
      const override = overrides.find(
        (o) => o.date.toISOString().split("T")[0] === dateString
      );

      // Get shift template for this day of week
      const shift = shiftTemplates.find((s) => s.dayOfWeek === dayOfWeek);

      // Get breaks for this day
      const dayBreaks = breakTemplates
        .filter((b) => b.dayOfWeek === null || b.dayOfWeek === dayOfWeek)
        .map((b) => ({
          _id: b._id,
          name: b.name,
          startTime: b.startTime,
          endTime: b.endTime,
        }));

      let daySchedule: any = {
        date: dateString,
        dayOfWeek,
        dayName: this.getDayName(dayOfWeek),
      };

      if (override) {
        daySchedule = {
          ...daySchedule,
          isWorking: override.isWorking,
          startTime: override.startTime,
          endTime: override.endTime,
          breaks: override.isWorking ? dayBreaks : [],
          override: true,
          reason: override.reason,
        };
      } else if (shift) {
        daySchedule = {
          ...daySchedule,
          isWorking: true,
          startTime: shift.startTime,
          endTime: shift.endTime,
          breaks: dayBreaks,
          override: false,
        };
      } else {
        daySchedule = {
          ...daySchedule,
          isWorking: false,
          breaks: [],
          override: false,
        };
      }

      schedule.push(daySchedule);
    }

    return {
      employee: {
        _id: employee._id,
        fullName: employee.fullName,
        email: employee.email,
        profilePicture: employee.profilePicture?.url,
        specialties: employee.employeeInfo?.specialties || [],
      },
      schedule,
      period: {
        year: year,
        month: month,
      },
    };
  }

  async getEmployeesWorkingToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);
    const dayOfWeek = today.getDay();

    // Get all active employees
    const employees = await UserModel.find({
      role: { $in: [Roles.EMPLOYEE, Roles.ADMIN] },
      status: "active",
      "employeeInfo.vacationMode": false,
    })
      .select("fullName email profilePicture employeeInfo")
      .lean();

    const employeeIds = employees.map((e) => e._id);

    // Get shifts for today's day of week
    const shifts = await ShiftTemplateModel.find({
      employeeId: { $in: employeeIds },
      dayOfWeek,
      isActive: true,
      $or: [
        { effectiveTo: { $exists: false } },
        { effectiveTo: null },
        { effectiveTo: { $gte: today } },
      ],
      effectiveFrom: { $lte: today },
    }).lean();

    // Get overrides for today
    const overrides = await ShiftOverrideModel.find({
      employeeId: { $in: employeeIds },
      date: { $gte: today, $lte: todayEnd },
    }).lean();

    // Filter working employees
    const workingEmployees = employees
      .map((employee) => {
        const empId = employee._id.toString();
        const override = overrides.find(
          (o) => o.employeeId.toString() === empId
        );
        const shift = shifts.find((s) => s.employeeId.toString() === empId);

        let isWorking = false;
        let startTime = "";
        let endTime = "";
        let hasOverride = false;

        if (override) {
          isWorking = override.isWorking;
          startTime = override.startTime || "";
          endTime = override.endTime || "";
          hasOverride = true;
        } else if (shift) {
          isWorking = true;
          startTime = shift.startTime;
          endTime = shift.endTime;
        }

        return {
          ...employee,
          isWorking,
          startTime,
          endTime,
          hasOverride,
        };
      })
      .filter((e) => e.isWorking);

    return {
      count: workingEmployees.length,
      employees: workingEmployees,
      date: today.toISOString().split("T")[0],
      dayOfWeek,
    };
  }

  // Helper methods
  private getDayName(dayOfWeek: number): string {
    const days = [
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
      "Chủ nhật",
    ];
    return days[dayOfWeek];
  }

  private groupBy<T>(
    items: T[],
    keyFn: (item: T) => string
  ): Record<string, T[]> {
    return items.reduce((acc, item) => {
      const key = keyFn(item);
      acc[key] ||= [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, T[]>);
  }

  private getISODayOfWeek(date: Date): number {
    const jsDay = date.getDay(); // 0 (Sun) - 6 (Sat)
    return jsDay === 0 ? 6 : jsDay - 1;
  }

  private getDayOfWeek0Monday(date: Date): number {
    // JS: Sunday = 0 → Saturday = 6
    // Convert to: Monday = 0 → Sunday = 6
    return (date.getDay() + 6) % 7;
  }
}

export const employeeService = new EmployeeService();
