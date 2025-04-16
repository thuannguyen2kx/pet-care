import { z } from "zod";

// Steps
export const STEPS = {
  PET: 0,
  DATE: 1,
  TIME: 2,
  EMPLOYEE: 3,
  NOTES: 4,
  PAYMENT: 5,
  REVIEW: 6,
};

// Form schema
export const formSchema = z.object({
  petId: z.string().min(1, { message: "Vui lòng chọn thú cưng" }),
  scheduledDate: z.date({
    required_error: "Vui lòng chọn ngày hẹn",
  }),
  timeSlot: z.object(
    {
      start: z.string().min(1, { message: "Vui lòng chọn khung giờ" }),
      end: z.string().min(1, { message: "Vui lòng chọn khung giờ" }),
      originalSlotIndexes: z.array(z.number()).optional(),
    },
    {
      required_error: "Vui lòng chọn khung giờ",
    }
  ),
  employeeId: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(["card", "cash", "bank_transfer"])
});

export type FormValues = z.infer<typeof formSchema>;

// Format duration display
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} phút`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  return mins > 0 ? `${hours} giờ ${mins} phút` : `${hours} giờ`;
};