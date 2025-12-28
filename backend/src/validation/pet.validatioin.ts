import { z } from "zod";
import { PET_GENDERS, PET_TYPES } from "../enums/pet";

// Schema cho ID
export const petIdSchema = z.string().min(1, "ID thú cưng không được để trống");

// Schema cho việc tạo thú cưng mới
export const createPetSchema = z.object({
  name: z
    .string()
    .min(1, "Vui lòng nhập tên thú cưng")
    .max(100, "Tên không được quá 100 ký tự"),
  type: z.enum(PET_TYPES, { message: "Vui lòng chọn loại thú cưng" }),
  breed: z.string().min(1, "Vui lòng chọn giống"),
  gender: z.enum(PET_GENDERS, { message: "Vui lòng chọn giới tính" }),
  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Ngày sinh không hợp lệ",
    })
    .refine((val) => new Date(val) <= new Date(), {
      message: "Ngày sinh không thể ở tương lai",
    }),
  weight: z.coerce
    .number({
      required_error: "Vui lòng nhập cân nặng",
      invalid_type_error: "Cân nặng phải là số",
    })
    .positive("Cân nặng phải là số dương"),
  color: z.string().min(1, "Vui lòng nhập màu lông"),
  microchipId: z.string().optional(),
  isNeutered: z.coerce.boolean().default(false),

  allergies: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return [];
      }
    }
    return val;
  }, z.array(z.string()).default([])),
  medicalNotes: z
    .string()
    .max(2000, "Ghi chú không được quá 2000 ký tự")
    .optional(),
});

export const updatePetSchema = createPetSchema.partial();

// Schema cho việc thêm tiêm phòng
export const vaccinationSchema = z.object({
  name: z.string().min(1, "Tên vaccine không được để trống"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Ngày tiêm phòng không hợp lệ",
  }),
  expiryDate: z.string().optional(),
  nextDueDate: z.string().optional(),
  batchNumber: z.string().optional(),
  veterinarianName: z.string().optional(),
  clinicName: z.string().optional(),
  certificate: z.string().optional(),
  notes: z.string().optional(),
});

// Schema cho việc thêm lịch sử y tế
export const medicalRecordSchema = z.object({
  condition: z.string().min(1, "Tình trạng không được để trống"),
  diagnosis: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Ngày chẩn đoán không hợp lệ",
  }),
  treatment: z.string().optional(),
  veterinarianName: z.string().optional(),
  clinicName: z.string().optional(),
  followUpDate: z.string().optional(),
  cost: z.number().positive().optional(),
  notes: z.string().optional(),
});

export const petFilterSchema = z.object({
  search: z.string().optional(),
  type: z.enum(PET_TYPES).optional(),
  gender: z.enum(PET_GENDERS).optional(),
  size: z.enum(["small", "medium", "large", "extra-large"]).optional(),
  minAge: z.string().transform(Number).pipe(z.number().min(0)).optional(),
  maxAge: z.string().transform(Number).pipe(z.number().min(0)).optional(),
  minWeight: z.string().transform(Number).pipe(z.number().min(0)).optional(),
  maxWeight: z.string().transform(Number).pipe(z.number().min(0)).optional(),
  isNeutered: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  hasUpcomingVaccinations: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  page: z.string().transform(Number).pipe(z.number().min(1)).default("1"),
  limit: z
    .string()
    .transform(Number)
    .pipe(z.number().min(1).max(100))
    .default("10"),
  sortBy: z
    .enum(["name", "dateOfBirth", "createdAt", "updatedAt"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
