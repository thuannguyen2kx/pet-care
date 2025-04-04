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
export type SpecialtyType = keyof typeof Specialty;