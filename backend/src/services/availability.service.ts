import { formatInTimeZone } from "date-fns-tz";
import mongoose from "mongoose";
import { BreakTemplateModel } from "../models/break-time.model";
import { BookingModel, BookingStatus } from "../models/booking.model";
import { ShiftTemplateModel } from "../models/shift-template.model";
import { ShiftOverrideModel } from "../models/shift-override.model";
import { BadRequestException } from "../utils/app-error";
import ServiceModel from "../models/service.model";

interface TimeSlot {
  start: string; // "09:00"
  end: string; // "09:30"
}

interface AvailabilityQuery {
  employeeId: string;
  date: Date; // Target date
  serviceId: string; // To get duration
  timezone?: string; // Default 'Asia/Ho_Chi_Minh'
}

interface AvailableSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export class AvailabilityCalculator {
  /**
   * Main entry point: Get available slots for an employee on a date
   */
  async getAvailableSlots(query: AvailabilityQuery): Promise<AvailableSlot[]> {
    const { employeeId, date, serviceId } = query;

    // 1. Get service info (duration + buffer)
    const service = await ServiceModel.findById(serviceId);
    if (!service || !service.isActive) {
      throw new BadRequestException(
        "Không tìm thấy dịch vụ hoặc dịch vụ không hoạt động."
      );
    }

    const totalDuration = service.duration;

    // 2. Get working hours for this date
    const workingHours = await this.getWorkingHours(employeeId, date);
    if (!workingHours) {
      return []; // Employee not working this day
    }

    // 3. Get all unavailable periods
    const unavailablePeriods = await this.getUnavailablePeriods(
      employeeId,
      date
    );

    // 4. Generate all possible slots
    const allSlots = this.generateTimeSlots(
      workingHours.start,
      workingHours.end,
      totalDuration
    );

    // 5. Mark slots as available/unavailable
    const availableSlots: AvailableSlot[] = allSlots.map((slot) => ({
      startTime: slot.start,
      endTime: slot.end,
      available: !this.isSlotUnavailable(
        slot,
        unavailablePeriods,
        totalDuration
      ),
    }));

    return availableSlots;
  }

  /**
   * Step 1: Determine working hours for a specific date
   * Priority: Override > Template
   */
  private async getWorkingHours(
    employeeId: string,
    date: Date
  ): Promise<{ start: string; end: string } | null> {
    const dateStr = this.formatDate(date);
    const dayOfWeek = date.getDay();

    // Check for override first
    const override = await ShiftOverrideModel.findOne({
      employeeId,
      date: dateStr,
    });

    if (override) {
      if (!override.isWorking) {
        return null; // Day off
      }
      return {
        start: override.startTime!,
        end: override.endTime!,
      };
    }

    // Fall back to template
    const template = await ShiftTemplateModel.findOne({
      employeeId,
      dayOfWeek,
      isActive: true,
      effectiveFrom: { $lte: date },
      $or: [{ effectiveTo: { $gte: date } }, { effectiveTo: null }],
    });

    if (!template) {
      return null; // No schedule defined
    }

    return {
      start: template.startTime,
      end: template.endTime,
    };
  }

  /**
   * Step 2: Collect all unavailable time periods
   * - Existing bookings
   * - Break times
   */
  private async getUnavailablePeriods(
    employeeId: string,
    date: Date
  ): Promise<TimeSlot[]> {
    const dateStr = this.formatDate(date);
    const dayOfWeek = this.getDayOfWeek0Monday(date);
    const unavailable: TimeSlot[] = [];

    // 2a. Existing bookings
    const bookings = await BookingModel.find({
      employeeId,
      scheduledDate: dateStr,
      status: {
        $in: [
          BookingStatus.PENDING,
          BookingStatus.CONFIRMED,
          BookingStatus.IN_PROGRESS,
        ],
      },
    });

    bookings.forEach((booking) => {
      unavailable.push({
        start: booking.startTime,
        end: booking.endTime,
      });
    });

    // 2b. Break times
    const breaks = await BreakTemplateModel.find({
      employeeId,
      isActive: true,
      effectiveFrom: { $lte: date },
      $and: [
        { $or: [{ effectiveTo: { $gte: date } }, { effectiveTo: null }] },
        { $or: [{ dayOfWeek }, { dayOfWeek: null }] },
      ],
    });

    breaks.forEach((breakTime) => {
      unavailable.push({
        start: breakTime.startTime,
        end: breakTime.endTime,
      });
    });

    return this.mergeOverlappingPeriods(unavailable);
  }

  /**
   * Step 3: Generate all possible time slots
   * Example: 09:00-17:00, 30min slots → [09:00, 09:30, 10:00, ...]
   */
  private generateTimeSlots(
    startTime: string,
    endTime: string,
    slotDuration: number
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    let current = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);

    while (current + slotDuration <= end) {
      const slotStart = this.minutesToTime(current);
      const slotEnd = this.minutesToTime(current + slotDuration);

      slots.push({
        start: slotStart,
        end: slotEnd,
      });

      current += slotDuration;
    }

    return slots;
  }

  /**
   * Step 4: Check if a slot conflicts with unavailable periods
   */
  private isSlotUnavailable(
    slot: TimeSlot,
    unavailablePeriods: TimeSlot[],
    duration: number
  ): boolean {
    const slotStart = this.timeToMinutes(slot.start);
    const slotEnd = this.timeToMinutes(slot.end);

    for (const period of unavailablePeriods) {
      const periodStart = this.timeToMinutes(period.start);
      const periodEnd = this.timeToMinutes(period.end);

      // Check for any overlap
      if (slotStart < periodEnd && slotEnd > periodStart) {
        return true;
      }
    }

    return false;
  }

  /**
   * Merge overlapping time periods to optimize checks
   */
  private mergeOverlappingPeriods(periods: TimeSlot[]): TimeSlot[] {
    if (periods.length === 0) return [];

    // Sort by start time
    const sorted = periods.sort(
      (a, b) => this.timeToMinutes(a.start) - this.timeToMinutes(b.start)
    );

    const merged: TimeSlot[] = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const lastMerged = merged[merged.length - 1];

      const lastEnd = this.timeToMinutes(lastMerged.end);
      const currentStart = this.timeToMinutes(current.start);

      if (currentStart <= lastEnd) {
        // Overlapping - extend the last merged period
        const currentEnd = this.timeToMinutes(current.end);
        if (currentEnd > lastEnd) {
          lastMerged.end = current.end;
        }
      } else {
        // Not overlapping - add new period
        merged.push({ ...current });
      }
    }

    return merged;
  }

  // ============================================
  // Utility Functions
  // ============================================

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  }

  private formatDate(date: Date, tz = "Asia/Ho_Chi_Minh"): string {
    return formatInTimeZone(date, tz, "yyyy-MM-dd");
  }

  private getDayOfWeek0Monday(date: Date): number {
    // JS: Sunday = 0 → Saturday = 6
    // Convert to: Monday = 0 → Sunday = 6
    return (date.getDay() + 6) % 7;
  }
}
