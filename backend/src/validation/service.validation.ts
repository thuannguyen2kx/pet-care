import { z } from "zod";
import { SPECIALTIES } from "../enums/employee.enum";

// Service ID validation (MongoDB ObjectId format)
export const serviceIdSchema = z
  .string()
  .trim()
  .length(24, "Mã dịch vụ không hợp lệ")
  .regex(/^[0-9a-fA-F]{24}$/, "Mã dịch vụ không hợp lệ");

// Create service schema
export const createServiceSchema = z
  .object({
    name: z
      .string({ required_error: "Tên dịch vụ là bắt buộc" })
      .trim()
      .min(3, "Tên dịch vụ phải ít nhất 3 ký tự")
      .max(100, "Tên dịch vụ tối đa 100 ký tự")
      .refine((val) => val.length > 0, "Tên dịch vụ không được trống"),

    description: z
      .string()
      .trim()
      .max(1000, "Mổ tả dịch vụ tối đa 1000 ký tự")
      .optional(),

    price: z
      .number({ required_error: "Giá dịch vụ là bắt buộc" })
      .positive("Giá dịch vụ phải là một số dương")
      .min(10000, "Giá dịch vụ phải ít nhất 10,000 VND")
      .max(100000000, "Giá không được vượt quá 100.000.000 VND")
      .finite("Giá phải là một con số hữu hạn."),

    duration: z
      .number({ required_error: "Thời lượng là bắt buộc" })
      .int("Thời lượng phải là một số nguyên")
      .positive("Thời lượng phải là một số dương.")
      .min(15, "Thời lượng phải ít nhất 15 phút.")
      .max(10080, "Thời lượng không được vượt quá 1 tuần (10.080 phút)."),

    category: z.enum(SPECIALTIES),

    requiredSpecialties: z.array(z.enum(SPECIALTIES)).default([]),

    isActive: z.boolean().optional().default(true),
  })
  .strict();

// Update service schema (all fields optional except at least one must be provided)
export const updateServiceSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Tên dịch vụ phải ít nhất 3 ký tự")
      .max(100, "Tên dịch vụ tối đa 100 ký tự")
      .optional(),

    description: z
      .string()
      .trim()
      .max(1000, "Mổ tả dịch vụ tối đa 1000 ký tự")
      .optional(),

    price: z
      .number()
      .positive("Giá dịch vụ phải là một số dương")
      .min(10000, "Giá dịch vụ phải ít nhất 10,000 VND")
      .max(100000000, "Giá không được vượt quá 100.000.000 VND")
      .finite("Giá phải là một con số hữu hạn.")
      .optional(),

    duration: z
      .number()
      .int("Thời lượng phải là một số nguyên")
      .positive("Thời lượng phải là một số dương.")
      .min(15, "Thời lượng phải ít nhất 15 phút.")
      .max(10080, "Thời lượng không được vượt quá 1 tuần (10.080 phút).")
      .optional(),

    category: z.enum(SPECIALTIES),

    requiredSpecialties: z.array(z.enum(SPECIALTIES)).default([]),

    isActive: z.boolean().optional(),
    keepImageIds: z.array(z.string()).default([]),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Ít nhất một trường phải được cung cấp để cập nhật.",
  });

// Query filters validation with proper type coercion
export const serviceQuerySchema = z
  .object({
    // Filters
    category: z.enum(SPECIALTIES).optional(),

    isActive: z
      .string()
      .optional()
      .transform((val) => {
        if (val === undefined) return undefined;
        if (val === "true") return true;
        if (val === "false") return false;
        throw new Error("isActive phải là 'true' hoặc 'false'");
      }),

    // Price range
    minPrice: z
      .string()
      .optional()
      .transform((val) => (val ? parseFloat(val) : undefined))
      .pipe(z.number().positive().optional()),

    maxPrice: z
      .string()
      .optional()
      .transform((val) => (val ? parseFloat(val) : undefined))
      .pipe(z.number().positive().optional()),

    // Search
    search: z.string().trim().max(100).optional(),

    // Sorting
    sortBy: z
      .enum(["name", "price", "duration", "createdAt", "updatedAt"])
      .optional()
      .default("createdAt"),

    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),

    // Pagination
    page: z
      .string()
      .optional()
      .default("1")
      .transform((val) => parseInt(val))
      .pipe(z.number().int().positive()),

    limit: z
      .string()
      .optional()
      .default("10")
      .transform((val) => parseInt(val))
      .pipe(z.number().int().positive().max(100, "Tối đa 100 mục mỗi trang")),
  })
  .refine(
    (data) => {
      if (data.minPrice !== undefined && data.maxPrice !== undefined) {
        return data.minPrice <= data.maxPrice;
      }
      return true;
    },
    {
      message: "minPrice phải nhỏ hơn hoặc bằng maxPrice",
      path: ["minPrice"],
    }
  );
