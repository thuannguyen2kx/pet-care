import { Request, Response } from "express";

import { employeeService } from "../services/employee.service";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import {
  bulkCreateShiftsSchema,
  createBreakTemplateSchema,
  createShiftOverrideSchema,
  createShiftTemplateSchema,
  disableShiftTemplateSchema,
  replaceShiftTemplateSchema,
  updateEmployeeProfileSchema,
} from "../validation/employee.validation";
import { getCurrentWeekRange, parseDateOnly } from "../utils/format-date";
import { Roles } from "../enums/role.enum";
/**
 * @desc    Get employees
 * @route   GET /api/employees
 * @access  Private (All)
 */
export const getEmployeesController = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = req.query;
    const result = await employeeService.getEmployees(filters);

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy danh sách nhân viên thành công",
      data: result,
    });
  }
);

/**
 * @desc    Get employee by ID
 * @route   GET /api/employees/:id
 * @access  Private (All)
 */
export const getEmployeeByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = req.params.id;
    const result = await employeeService.getEmployeeById(employeeId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy thông tin nhân viên thành công",
      data: result,
    });
  }
);

/**
 * @desc    Update employee profile
 * @route   PUT /api/employees/:id/profile
 * @access  Private (Admin or Self)
 */
export const updateEmployeeProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = req.params.id;
    const userId = req.user?._id;
    const userRole = req.user?.role;

    const data = updateEmployeeProfileSchema.parse(req.body);
    const employee = await employeeService.updateEmployeeProfile(
      employeeId,
      data
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật thông tin nhân viên thành công",
      data: employee,
    });
  }
);

/**
 * @desc    Create shift template
 * @route   POST /api/employees/:id/shifts
 * @access  Private (Admin)
 */
export const createShiftTemplateController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = req.params.id;

    const data = createShiftTemplateSchema.parse({
      ...req.body,
      employeeId,
    });

    const shift = await employeeService.createShiftTemplate(data);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Tạo ca làm việc thành công",
      data: shift,
    });
  }
);

/**
 * @desc    Bulk create weekly schedule
 * @route   POST /api/employees/:id/shifts/bulk
 * @access  Private (Admin)
 */
export const bulkCreateShiftsController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = req.params.id;

    const data = bulkCreateShiftsSchema.parse({
      ...req.body,
      employeeId,
    });

    const shifts = await employeeService.bulkCreateShifts(data);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Lịch trình hàng tuần được tạo thành công",
      data: shifts,
    });
  }
);

/**
 * @desc    Get employee shifts
 * @route   GET /api/employees/:id/shifts
 * @access  Private (All)
 */
export const getEmployeeShiftsController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = req.params.id;
    const date = parseDateOnly(req.query.date as string);

    const shifts = await employeeService.getEmployeeScheduleByDate(
      employeeId,
      date
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy thông tin ca làm việc của nhân viên thành công",
      data: shifts,
    });
  }
);
/**
 * @desc Update shift template
 * @route PUT /api/employees/:id/shifts/:shiftId
 * @access Private (Admin)
 */
export const updateShiftTemplateController = asyncHandler(
  async (req: Request, res: Response) => {
    const shiftId = req.params.shiftId;

    const data = createShiftTemplateSchema.parse({
      ...req.body,
    });

    const shift = await employeeService.updateShiftTemplate(shiftId, data);

    return res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật ca làm việc của nhân viên thành công",
      data: shift,
    });
  }
);

/**
 * @desc    Delete shift template
 * @route   DELETE /api/employees/shifts/:shiftId
 * @access  Private (Admin)
 */
export const deleteShiftTemplateController = asyncHandler(
  async (req: Request, res: Response) => {
    const shiftId = req.params.shiftId;

    await employeeService.deleteShiftTemplate(shiftId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Xóa ca làm việc của nhân viên thành công",
    });
  }
);

/**
 * @desc Replace shift template
 * @route POST /api/employees/shifts/:shiftId/replace
 * @access Private (Admin)
 */
export const replaceShiftTemplateController = asyncHandler(
  async (req: Request, res: Response) => {
    const shiftId = req.params.shiftId;

    const data = replaceShiftTemplateSchema.parse(req.body);

    const shift = await employeeService.replaceShiftTemplate(shiftId, data);

    return res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật ca làm việc của nhân viên thành công",
      data: shift,
    });
  }
);
export const disableShiftTemplateController = asyncHandler(
  async (req: Request, res: Response) => {
    const shiftId = req.params.shiftId;

    const data = disableShiftTemplateSchema.parse(req.body);

    const shift = await employeeService.disableShiftTemplate(shiftId, data);

    return res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật ca làm việc thành công",
      data: shift,
    });
  }
);

/**
 * @desc    Create shift override
 * @route   POST /api/employees/:id/overrides
 * @access  Private (Admin)
 */
export const createShiftOverrideController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = req.params.id;
    const createdBy = req.user!._id.toString();

    const data = createShiftOverrideSchema.parse({
      ...req.body,
      employeeId,
    });

    const override = await employeeService.createShiftOverride(data, createdBy);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Tạo ca làm việc ngoại lệ thành công",
      data: override,
    });
  }
);

/**
 * @desc    Get shift overrides
 * @route   GET /api/employees/:id/overrides
 * @access  Private (All)
 */
export const getShiftOverridesController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = req.params.id;

    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : undefined;

    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : undefined;

    const overrides = await employeeService.getShiftOverrides(
      employeeId,
      startDate,
      endDate
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy danh sách ca làm việc ngoại lệ thành công",
      data: overrides,
    });
  }
);

/**
 *  @desc Update shift override
 *  @route PUT /api/employees/:id/overrides/:overrideId
 *  @access Private (Admin)
 */
export const updateShiftOverrideController = asyncHandler(
  async (req: Request, res: Response) => {
    const overrideId = req.params.overrideId;

    const data = createShiftOverrideSchema.parse({
      ...req.body,
    });

    const override = await employeeService.updateShiftOverride(
      overrideId,
      data
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật ca làm việc ngoại lệ của nhân viên thành công",
      data: override,
    });
  }
);

/**
 * @desc    Delete shift override
 * @route   DELETE /api/employees/:id/overrides/:overrideId
 * @access  Private (Admin)
 */
export const deleteShiftOverrideController = asyncHandler(
  async (req: Request, res: Response) => {
    const overrideId = req.params.overrideId;

    await employeeService.deleteShiftOverride(overrideId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Xóa ca làm việc ngoại lệ của nhân viên thành công",
    });
  }
);
/**
 * @desc    Create break template
 * @route   POST /api/employees/:id/breaks
 * @access  Private (Admin)
 */
export const createBreakTemplateController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = req.params.id;

    const data = createBreakTemplateSchema.parse({
      ...req.body,
      employeeId,
    });

    const breakTemplate = await employeeService.createBreakTemplate(data);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Thời gian nghỉ được tạo thành công",
      data: breakTemplate,
    });
  }
);

/**
 * @desc Update break template
 * @route PUT /api/employees/:id/breaks/:breakId
 * @access Private (Admin)
 */
export const updateBreakTemplateController = asyncHandler(
  async (req: Request, res: Response) => {
    const breakId = req.params.breakId;

    const data = createBreakTemplateSchema.parse({
      ...req.body,
    });

    const breakTemplate = await employeeService.updateBreakTemplate(
      breakId,
      data
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật thời gian nghị của nhân viên thông",
      data: breakTemplate,
    });
  }
);

/**
 * @desc    Delete break template
 * @route   DELETE /api/employees/:id/breaks/:breakId
 * @access  Private (Admin)
 */
export const deleteBreakTemplateController = asyncHandler(
  async (req: Request, res: Response) => {
    const breakId = req.params.breakId;

    await employeeService.deleteBreakTemplate(breakId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Xóa thời gian nghị của nhân viên thông",
    });
  }
);

/**
 * @desc    Get employee schedule (calendar view)
 * @route   GET /api/employees/schedule?startDate&endDate&employeeId
 * @access  Private (All)
 */
export const getEmployeeScheduleController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    const filters: any = {};
    if (user?.role === Roles.EMPLOYEE) {
      filters["employeeId"] = user._id.toString();
    }

    if (user?.role === Roles.ADMIN && req.query.employeeId) {
      filters["employeeId"] = req.query.employeeId;
    }

    const now = new Date();
    filters["startDate"] = req.query.startDate
      ? parseDateOnly(req.query.startDate as string)
      : new Date(now.getFullYear(), now.getMonth(), 1);

    filters["endDate"] = req.query.endDate
      ? parseDateOnly(req.query.endDate as string)
      : new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const schedule = await employeeService.getEmployeeSchedule(
      filters.employeeId,
      filters.startDate,
      filters.endDate
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Đã lấy lịch làm việc thành công",
      data: schedule,
    });
  }
);

export const getTeamWeekScheduleController = asyncHandler(
  async (req: Request, res: Response) => {
    const now = new Date();

    let startDate: Date;
    let endDate: Date;

    if (req.query.startDate && req.query.endDate) {
      startDate = new Date(req.query.startDate as string);
      endDate = new Date(req.query.endDate as string);
    } else {
      const weekRange = getCurrentWeekRange(now);
      startDate = weekRange.startDate;
      endDate = weekRange.endDate;
    }
    const result = await employeeService.getTeamWeekSchedule(
      startDate,
      endDate
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Đã lấy lịch làm việc của nhân viên trong tuần",
      data: result,
    });
  }
);

export const getEmployeeWorkingTodayController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await employeeService.getEmployeesWorkingToday();

    return res.status(HTTPSTATUS.OK).json({
      message: "Đã lấy lịch làm việc của nhân viên trong ngày",
      data: result,
    });
  }
);

export const getEmployeeDashboardStatController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = req.user!._id;
    const result = await employeeService.getEmployeeDashboardStat(employeeId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Đã lấy lịch làm việc của nhân viên trong ngày",
      data: result,
    });
  }
);
