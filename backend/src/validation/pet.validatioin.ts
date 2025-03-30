import { z } from "zod";

// Schema cho ID
export const petIdSchema = z.string().min(1, "ID thú cưng không được để trống");

// Schema cho việc tạo thú cưng mới
export const createPetSchema = z.object({
  name: z.string().min(1, "Tên thú cưng không được để trống"),
  species: z.string().min(1, "Loài thú cưng không được để trống"),
  breed: z.string().optional(),
  age: z.number().positive("Tuổi phải là số dương").optional(),
  weight: z.number().positive("Cân nặng phải là số dương").optional(),
  gender: z.string().optional(),
  habits: z.array(z.string()).optional().or(z.string().optional()),
  allergies: z.array(z.string()).optional().or(z.string().optional()),
  specialNeeds: z.string().optional(),
});

// Schema cho việc cập nhật thú cưng
export const updatePetSchema = z.object({
  name: z.string().min(1, "Tên thú cưng không được để trống").optional(),
  species: z.string().min(1, "Loài thú cưng không được để trống").optional(),
  breed: z.string().optional(),
  age: z.number().positive("Tuổi phải là số dương").optional(),
  weight: z.number().positive("Cân nặng phải là số dương").optional(),
  gender: z.string().optional(),
  habits: z.array(z.string()).optional().or(z.string().optional()),
  allergies: z.array(z.string()).optional().or(z.string().optional()),
  specialNeeds: z.string().optional(),
});

// Schema cho việc thêm tiêm phòng
export const vaccinationSchema = z.object({
  name: z.string().min(1, "Tên vaccine không được để trống"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Ngày tiêm phòng không hợp lệ",
  }),
  expiryDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Ngày hết hạn không hợp lệ",
    })
    .optional(),
  certificate: z.string().optional(),
});

// Schema cho việc thêm lịch sử y tế
export const medicalRecordSchema = z.object({
  condition: z.string().min(1, "Tình trạng không được để trống"),
  diagnosis: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Ngày chẩn đoán không hợp lệ",
  }),
  treatment: z.string().optional(),
  notes: z.string().optional(),
});