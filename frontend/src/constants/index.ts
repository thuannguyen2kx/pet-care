export const Roles = {
  ADMIN: "ADMIN",
  EMPLOYEE: "EMPLOYEE",
  CUSTOMER: "CUSTOMER",
} as const;
export type RolesType = keyof typeof Roles;

export const StatusUser = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED",
} as const;
export type StatusUserType = keyof typeof StatusUser;
export const statusTranslations: Record<StatusUserType | "ALL", string> = {
  [StatusUser.ACTIVE]: "Đang hoạt động",
  [StatusUser.INACTIVE]: "Không hoạt động",
  [StatusUser.BLOCKED]: "Bị chặn",
  ALL: "Tất cả",
};
export const GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as const;
export type GenderType = keyof typeof GENDER;

export enum Specialty {
  // Dịch vụ Grooming
  BATHING = "BATHING",          // Tắm gội
  HAIRCUT = "HAIRCUT",          // Cắt tỉa lông
  SKINCARE = "SKINCARE",        // Chăm sóc da
  NAIL_TRIMMING = "NAIL_TRIMMING", // Cắt móng

  // Dịch vụ Spa và Thư giãn
  MASSAGE = "MASSAGE",          // Massage thư giãn
  AROMATHERAPY = "AROMATHERAPY",// Xông hơi tinh dầu
  HERBAL_BATH = "HERBAL_BATH",  // Tắm thảo dược
  SKIN_TREATMENT = "SKIN_TREATMENT", // Điều trị da

  // Dịch vụ Y tế cơ bản tại cửa hàng
  HEALTH_CHECK = "HEALTH_CHECK",       // Khám sức khỏe định kỳ
  VACCINATION = "VACCINATION",         // Tiêm phòng
  POST_VACCINE_CARE = "POST_VACCINE_CARE", // Chăm sóc sau tiêm
  NUTRITION_ADVICE = "NUTRITION_ADVICE", // Tư vấn dinh dưỡng
}
export type SpecialtyType = keyof typeof Specialty;// Chuyển đổi tên chuyên môn sang tiếng Việt
export const specialtyTranslations: Record<Specialty | "ALL", string> = {
  [Specialty.BATHING]: "Tắm gội",
  [Specialty.HAIRCUT]: "Cắt tỉa lông",
  [Specialty.SKINCARE]: "Chăm sóc da",
  [Specialty.NAIL_TRIMMING]: "Cắt móng",

  [Specialty.MASSAGE]: "Massage thư giãn",
  [Specialty.AROMATHERAPY]: "Xông hơi tinh dầu",
  [Specialty.HERBAL_BATH]: "Tắm thảo dược",
  [Specialty.SKIN_TREATMENT]: "Điều trị da",

  [Specialty.HEALTH_CHECK]: "Khám sức khỏe định kỳ",
  [Specialty.VACCINATION]: "Tiêm phòng",
  [Specialty.POST_VACCINE_CARE]: "Chăm sóc sau tiêm",
  [Specialty.NUTRITION_ADVICE]: "Tư vấn dinh dưỡng",
  ALL: "Tất cả",
};

export const weekdays = [
  { id: "monday", label: "Thứ Hai" },
  { id: "tuesday", label: "Thứ Ba" },
  { id: "wednesday", label: "Thứ Tư" },
  { id: "thursday", label: "Thứ Năm" },
  { id: "friday", label: "Thứ Sáu" },
  { id: "saturday", label: "Thứ Bảy" },
  { id: "sunday", label: "Chủ Nhật" },
];