// /features/appointment/utils/appointment-form-config.ts

import { z } from "zod";

// Cập nhật thứ tự các bước
export const STEPS = {
  PET: 0,
  EMPLOYEE: 1, // Di chuyển bước chọn nhân viên lên trước
  DATE: 2,     // Ngày hẹn sau khi chọn nhân viên
  TIME: 3,     // Giờ hẹn sau khi chọn ngày
  NOTES: 4,
  PAYMENT: 5,
  REVIEW: 6
};

// Schema validation của form
export const formSchema = z.object({
  petId: z.string({ required_error: "Vui lòng chọn thú cưng" }),
  employeeId: z.string().optional(), // Không bắt buộc chọn nhân viên
  scheduledDate: z.date({ required_error: "Vui lòng chọn ngày" }),
  timeSlot: z.object({
    start: z.string({ required_error: "Vui lòng chọn khung giờ" }),
    end: z.string({ required_error: "Vui lòng chọn khung giờ" }),
    originalSlotIndexes: z.array(z.number()).optional()
  }, { required_error: "Vui lòng chọn khung giờ" }),
  notes: z.string().optional(),
  paymentMethod: z.enum(["card", "cash", "bank_transfer"], {
    required_error: "Vui lòng chọn phương thức thanh toán"
  })
});

export type FormValues = z.infer<typeof formSchema>;

// Hàm định dạng thời gian
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} phút`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} giờ`;
  }
  
  return `${hours} giờ ${remainingMinutes} phút`;
};