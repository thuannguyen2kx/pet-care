import { Request, Response } from "express";
import { AvailabilityCalculator } from "../services/availability.service";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import ServiceModel from "../models/service.model";
import UserModel from "../models/user.model";
import {
  availabilityEmployeesQuerySchema,
  availabilitySlotsQuerySchema,
} from "../validation/availablity.validation";
import { formatInTimeZone } from "date-fns-tz";
import { parseDateOnly } from "../utils/format-date";
import { Roles } from "../enums/role.enum";
/**
 * GET /api/availability/slots
 * Query params:
 *   - employeeId: string
 *   - date: YYYY-MM-DD
 *   - serviceId: string
 */
export const getAvailableSlotsController = asyncHandler(
  async (req: Request, res: Response) => {
    // Validation
    const query = availabilitySlotsQuerySchema.parse(req.query);

    const targetDate = parseDateOnly(query.date);

    // Calculate availability
    const calculator = new AvailabilityCalculator();
    const slots = await calculator.getAvailableSlots({
      employeeId: query.employeeId as string,
      date: targetDate,
      serviceId: query.serviceId as string,
    });

    // Response
    return res.status(200).json({
      date: query.date,
      employeeId: query.employeeId,
      serviceId: query.serviceId,
      totalSlots: slots.length,
      availableSlots: slots.filter((s) => s.available).length,
      slots: slots,
    });
  }
);

/**
 * GET /api/availability/employees
 * Find available employees for a service on a date/time
 * Query params:
 *   - serviceId: string
 *   - date: YYYY-MM-DD
 *   - startTime: HH:MM
 */
export const getAvailableEmployeesController = asyncHandler(
  async (req: Request, res: Response) => {
    const query = availabilityEmployeesQuerySchema.parse(req.query);

    // Get service
    const service = await ServiceModel.findById(query.serviceId);
    if (!service) {
      return res.status(404).json({ error: "Dịch vụ không tồn tại" });
    }

    // Get all employees with required specialty
    const employeeQuery: any = {
      role: { $in: [Roles.EMPLOYEE] },
      status: "active",
      "employeeInfo.isAcceptingBookings": true,
      "employeeInfo.vacationMode": false,
    };

    if (service.requiredSpecialties) {
      employeeQuery["employeeInfo.specialties"] = {
        $all: service.requiredSpecialties,
      };
    }

    const employees = await UserModel.find(employeeQuery);

    // Check availability for each employee
    const calculator = new AvailabilityCalculator();
    const targetDate = parseDateOnly(query.date);

    const availableEmployees = await Promise.all(
      employees.map(async (employee) => {
        const slots = await calculator.getAvailableSlots({
          employeeId: employee._id.toString(),
          date: targetDate,
          serviceId: query.serviceId,
        });

        // Check if requested time is available
        const requestedSlot = slots.find(
          (s) => s.startTime === query.startTime
        );
        const isAvailable = requestedSlot?.available || false;

        return {
          employeeId: employee._id,
          fullName: employee.fullName,
          rating: employee.employeeInfo?.stats.rating || 0,
          available: isAvailable,
        };
      })
    );

    // Filter and sort
    const available = availableEmployees
      .filter((e) => e.available)
      .sort((a, b) => b.rating - a.rating);

    return res.status(200).json({
      date: query.date,
      startTime: query.startTime,
      serviceId: query.serviceId,
      availableEmployees: available,
    });
  }
);
