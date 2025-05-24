import { z } from "zod";
import { doTimeRangesOverlap } from "../utils/schedule-utils";

export const timeRangeSchema = z.object({
  start: z.string().min(1, "Giờ bắt đầu là bắt buộc"),
  end: z.string().min(1, "Giờ kết thúc là bắt buộc"),
}).refine((data) => data.start < data.end, {
  message: "Giờ kết thúc phải sau giờ bắt đầu",
  path: ["end"],
});

export const scheduleFormSchema = z.object({
  isWorking: z.boolean(),
  workHours: z.array(timeRangeSchema),
  note: z.string().optional(),
}).refine((data) => {
  // Nếu là ngày làm việc thì phải có ít nhất 1 ca làm việc
  if (data.isWorking && data.workHours.length === 0) {
    return false;
  }
  return true;
}, {
  message: "Cần có ít nhất một khoảng thời gian làm việc cho ngày làm việc",
  path: ["workHours"],
}).refine((data) => {
  // Kiểm tra overlap giữa các khoảng thời gian
  if (data.isWorking && data.workHours.length > 1) {
    const hasOverlap = doTimeRangesOverlap(data.workHours);
    if (hasOverlap) {
      return false;
    }
  }
  return true;
}, {
  message: "Các khoảng thời gian không được chồng chéo nhau",
  path: ["workHours"],
});

export type ScheduleFormData = z.infer<typeof scheduleFormSchema>;

// Helper function để validate manually nếu cần
export const validateScheduleForm = (data: ScheduleFormData) => {
  try {
    scheduleFormSchema.parse(data);
    return { success: true, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }
    return { success: false, errors: [{ message: "Unknown validation error" }] };
  }
};