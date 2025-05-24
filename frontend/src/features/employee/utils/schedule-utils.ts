
import { TimeRange } from "../types/schedule.types";

export const formatTime = (timeString: string): string => {
  if (!timeString) return "";
  return timeString.split(":").slice(0, 2).join(":");
};

export const doTimeRangesOverlap = (ranges: TimeRange[]): boolean => {
  if (ranges.length <= 1) return false;

  const sortedRanges = [...ranges].sort((a, b) => a.start.localeCompare(b.start));

  for (let i = 0; i < sortedRanges.length - 1; i++) {
    if (sortedRanges[i].end > sortedRanges[i + 1].start) {
      return true;
    }
  }
  return false;
};

export const areTimeRangesValid = (ranges: TimeRange[]): boolean => {
  return ranges.every((range) => range.start < range.end);
};

export const generateTimeOptions = (): { value: string; label: string }[] => {
  const options: { value: string; label: string }[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      const value = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      const formattedHour = hour % 12 || 12;
      const period = hour >= 12 ? "CH" : "SA";
      const label = `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
      options.push({ value, label });
    }
  }
  return options;
};

export const DEFAULT_WORK_HOURS: TimeRange[] = [
  { start: "09:00", end: "17:00" },
];


