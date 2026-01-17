import { startOfYear, subDays, subMonths } from "date-fns";

/**
 * Get all dates in range that match a specific day of week
 */
export function getDatesForDayOfWeek(
  start: Date,
  end: Date,
  dayOfWeek: number
): Date[] {
  const dates: Date[] = [];
  const current = new Date(start);

  while (current <= end) {
    if (current.getDay() === dayOfWeek) {
      dates.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Get Vietnamese day name
 */
export function getDayName(dayOfWeek: number): string {
  const names = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];
  return names[dayOfWeek];
}
export function getCurrentWeekRange(baseDate = new Date()) {
  const date = new Date(baseDate);

  const day = date.getDay(); // 0 = Sunday, 1 = Monday
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const startDate = new Date(date);
  startDate.setDate(date.getDate() + diffToMonday);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
}

export function getWeekRange(baseDate: Date) {
  const date = new Date(baseDate);
  const day = date.getDay(); // 0 (Sun) - 6 (Sat)

  const diffToMonday = day === 0 ? -6 : 1 - day;

  const startDate = new Date(date);
  startDate.setDate(date.getDate() + diffToMonday);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
}

export function getDatesInRange(startDate: Date, endDate: Date) {
  const dates: Date[] = [];

  const current = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );

  const end = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export function parseDateOnly(input: string): Date {
  const date = new Date(input);

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date input: ${input}`);
  }

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function resolveDateRange(timeRange: string) {
  const now = new Date();

  switch (timeRange) {
    case "week":
      return { from: subDays(now, 7), to: now };
    case "month":
      return { from: subDays(now, 30), to: now };
    case "quarter":
      return { from: subMonths(now, 3), to: now };
    case "year":
      return { from: startOfYear(now), to: now };
    default:
      return { from: subDays(now, 30), to: now };
  }
}
export function calcChange(current: number, previous: number) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return Number((((current - previous) / previous) * 100).toFixed(1));
}
