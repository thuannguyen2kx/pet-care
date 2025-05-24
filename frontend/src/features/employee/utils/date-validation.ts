import { startOfDay, isAfter, isSameDay } from "date-fns";

/**
 * Check if a date is in the future (today or later)
 */
export const isFutureDate = (date: Date): boolean => {
  const today = startOfDay(new Date());
  const targetDate = startOfDay(date);
  
  return isAfter(targetDate, today) || isSameDay(targetDate, today);
};

/**
 * Check if a date is in the past
 */
export const isPastDate = (date: Date): boolean => {
  return !isFutureDate(date);
};

/**
 * Check if a schedule can be edited based on date
 */
export const canEditSchedule = (date: Date): boolean => {
  return isFutureDate(date);
};

/**
 * Get validation message for past date editing
 */
export const getPastDateMessage = (): string => {
  return "Không thể chỉnh sửa lịch trình cho ngày đã qua";
};