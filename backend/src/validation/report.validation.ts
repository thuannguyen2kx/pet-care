import { z } from "zod";

// Schema for report ID validation
export const reportIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, {
  message: "ID báo cáo không hợp lệ",
});

// Schema for query parameters when getting reports
export const getReportParamsSchema = z
  .object({
    reportType: z
      .enum(["daily", "weekly", "monthly", "yearly"], {
        errorMap: () => ({ message: "Loại báo cáo không hợp lệ" }),
      })
      .optional(),
    startDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Định dạng ngày bắt đầu không hợp lệ",
      })
      .transform((val) => new Date(val))
      .optional(),
    endDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Định dạng ngày kết thúc không hợp lệ",
      })
      .transform((val) => new Date(val))
      .optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().min(1).max(100).default(10),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    {
      message: "Ngày bắt đầu phải trước hoặc bằng ngày kết thúc",
      path: ["endDate"],
    }
  );

// Schema for report generation
export const generateReportSchema = z.object({
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Định dạng ngày không hợp lệ",
    })
    .transform((val) => new Date(val)),
});

// Schema for checking date range for custom reports
export const dateRangeSchema = z
  .object({
    startDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Định dạng ngày bắt đầu không hợp lệ",
      })
      .transform((val) => new Date(val)),
    endDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Định dạng ngày kết thúc không hợp lệ",
      })
      .transform((val) => new Date(val)),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: "Ngày bắt đầu phải trước hoặc bằng ngày kết thúc",
    path: ["endDate"],
  });

// Schema for dashboard statistics filtering (optional parameters)
export const dashboardStatisticsSchema = z
  .object({
    period: z
      .enum(["day", "week", "month", "year", "custom"], {
        errorMap: () => ({ message: "Khoảng thời gian không hợp lệ" }),
      })
      .default("month"),
    startDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Định dạng ngày bắt đầu không hợp lệ",
      })
      .transform((val) => new Date(val))
      .optional(),
    endDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Định dạng ngày kết thúc không hợp lệ",
      })
      .transform((val) => new Date(val))
      .optional(),
  })
  .refine(
    (data) => {
      if (data.period === "custom") {
        return !!data.startDate && !!data.endDate;
      }
      return true;
    },
    {
      message:
        "Ngày bắt đầu và ngày kết thúc là bắt buộc khi chọn khoảng thời gian tùy chỉnh",
      path: ["period"],
    }
  )
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    {
      message: "Ngày bắt đầu phải trước hoặc bằng ngày kết thúc",
      path: ["endDate"],
    }
  );
