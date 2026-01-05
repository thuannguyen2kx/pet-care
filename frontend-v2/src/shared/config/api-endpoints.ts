/* ================= BASE ================= */
const API_VERSION = '';

export const API_BASE = {
  AUTH: `${API_VERSION}/auth`,
  USERS: `${API_VERSION}/users`,
  PETS: `${API_VERSION}/pets`,
  BOOKINGS: `${API_VERSION}/bookings`,
  SERVICES: `${API_VERSION}/services`,
  SOCIAL: `${API_VERSION}/social`,
  ADMIN: `${API_VERSION}/admin`,
  EMPLOYEE: `${API_VERSION}/employees`,
};

/* ================= AUTH ================= */
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE.AUTH}/login`,
  GOOGLE_OAUTH: `${API_BASE.AUTH}/google`,
  REGISTER: `${API_BASE.AUTH}/register`,
  LOGOUT: `${API_BASE.AUTH}/logout`,
  REFRESH_TOKEN: `${API_BASE.AUTH}/refresh`,
  ME: `${API_BASE.AUTH}/me`,
};

/* ================= USER ================= */
export const USER_ENDPOINTS = {
  PROFILE: `${API_BASE.USERS}/profile`,
  UPDATE_PROFILE: `${API_BASE.USERS}/profile`,
  GET_PROFILE: (userId: string) => `${API_BASE.USERS}/${userId}`,
  UPDATE_ADDRESS: `${API_BASE.USERS}/address`,
  UPDATE_PREFERENCES: `${API_BASE.USERS}/preferences`,
  UPDATE_PROFILE_IMAGE: `${API_BASE.USERS}/profile-picture`,
  REMOVE_PROFILE_IMAGE: `${API_BASE.USERS}/profile-picture`,

  GET_USER: (userId: string) => `${API_BASE.USERS}/admin/users/${userId}`,
  CUSTOMER_LIST: `${API_BASE.USERS}/admin/customers`,
  EMPLOYEE_LIST: `${API_BASE.USERS}/admin/employees`,
  CREATE_EMPLOYEE: `${API_BASE.USERS}/admin/employees`,
  UPDATE_EMPLOYEE: (userId: string) => `${API_BASE.USERS}/admin/employees/${userId}`,
  CHANGE_STATUS: (userId: string) => `${API_BASE.USERS}/admin/users/${userId}/status`,
  CHANGE_ROLE: (userId: string) => `${API_BASE.USERS}/admin/users/${userId}/role`,
  DELETE: (userId: string) => `${API_BASE.USERS}/admin/users/${userId}`,
};

/* ================= EMPLOYEE SCHEDULE ================= */
export const EMPLOYEE_SCHEDULE_ENDPOINTS = {
  GET_EMPLOYEE: (employeeId: string) => `${API_BASE.EMPLOYEE}/${employeeId}`,
  SCHEDULE: (employeeId: string) => `${API_BASE.EMPLOYEE}/${employeeId}/schedule`,
  TEAM_SCHEDULE: `${API_BASE.EMPLOYEE}/schedule/week`,
  SCHEDULE_TODAY: `${API_BASE.EMPLOYEE}/schedule/today`,
  CREATE_SHIFT: (employeeId: string) => `${API_BASE.EMPLOYEE}/${employeeId}/shifts`,
  CREATE_SHIFT_BULK: (employeeId: string) => `${API_BASE.EMPLOYEE}/${employeeId}/shifts/bulk`,
  GET_SHIFT: (employeeId: string) => `${API_BASE.EMPLOYEE}/${employeeId}/shifts`,
  UPDATE_SHIFT: (shiftId: string) => `${API_BASE.EMPLOYEE}/shifts/${shiftId}`,
  REPLACE_SHIFT: (shiftId: string) => `${API_BASE.EMPLOYEE}/shifts/${shiftId}/replace`,
  DELETE_SHIFT: (shiftId: string) => `${API_BASE.EMPLOYEE}/shifts/${shiftId}`,
  DIABLE_SHIFT: (shiftId: string) => `${API_BASE.EMPLOYEE}/shifts/${shiftId}/disable`,
  CREATE_OVERRIDE: (employeeId: string) => `${API_BASE.EMPLOYEE}/${employeeId}/overrides`,
  GET_OVERRIDE: (employeeId: string) => `${API_BASE.EMPLOYEE}/${employeeId}/overrides`,
  UPDATE_OVERRIDE: (overrideId: string) => `${API_BASE.EMPLOYEE}/overrides/${overrideId}`,
  DELETE_OVERRIDE: (overrideId: string) => `${API_BASE.EMPLOYEE}/overrides/${overrideId}`,
  CREATE_BREAK: (employeeId: string) => `${API_BASE.EMPLOYEE}/${employeeId}/breaks`,
  GET_BREAK: (employeeId: string) => `${API_BASE.EMPLOYEE}/${employeeId}/breaks`,
  UPDATE_BREAK: (breakId: string) => `${API_BASE.EMPLOYEE}/breaks/${breakId}`,
  DELETE_BREAK: (breakId: string) => `${API_BASE.EMPLOYEE}/breaks/${breakId}`,
};
/* ================= PET ================= */
export const PET_ENDPOINTS = {
  LIST: `${API_BASE.PETS}`,
  DETAIL: (petId: string) => `${API_BASE.PETS}/${petId}`,
  CREATE: `${API_BASE.PETS}`,
  UPDATE: (petId: string) => `${API_BASE.PETS}/${petId}`,
  UPDATE_IMAGE: (petId: string) => `${API_BASE.PETS}/${petId}/image`,
  DELETE: (petId: string) => `${API_BASE.PETS}/${petId}`,
};

/* ================= BOOKING ================= */
export const BOOKING_ENDPOINTS = {
  LIST: `${API_BASE.BOOKINGS}`,
  DETAIL: (bookingId: string) => `${API_BASE.BOOKINGS}/${bookingId}`,
  CREATE: `${API_BASE.BOOKINGS}`,
  CANCEL: (bookingId: string) => `${API_BASE.BOOKINGS}/${bookingId}/cancel`,
};

/* ================= SERVICE ================= */
export const SERVICE_ENDPOINTS = {
  LIST: `${API_BASE.SERVICES}`,
  DETAIL: (serviceId: string) => `${API_BASE.SERVICES}/${serviceId}`,
};

/* ================= SOCIAL ================= */
export const SOCIAL_ENDPOINTS = {
  POSTS: `${API_BASE.SOCIAL}/posts`,
  POST_DETAIL: (postId: string) => `${API_BASE.SOCIAL}/posts/${postId}`,
  CREATE_POST: `${API_BASE.SOCIAL}/posts`,
  COMMENT: (postId: string) => `${API_BASE.SOCIAL}/posts/${postId}/comments`,
  REACT: (postId: string) => `${API_BASE.SOCIAL}/posts/${postId}/reactions`,
};

/* ================= ADMIN ================= */
export const ADMIN_ENDPOINTS = {
  DASHBOARD: `${API_BASE.ADMIN}/dashboard`,
  USERS: `${API_BASE.ADMIN}/users`,
  SERVICES: `${API_BASE.ADMIN}/services`,
  BOOKINGS: `${API_BASE.ADMIN}/bookings`,
};

/* ================= EMPLOYEE ================= */
export const EMPLOYEE_ENDPOINTS = {
  SCHEDULE: `${API_BASE.EMPLOYEE}/schedule`,
  BOOKINGS: `${API_BASE.EMPLOYEE}/bookings`,
  UPDATE_STATUS: (bookingId: string) => `${API_BASE.EMPLOYEE}/bookings/${bookingId}/status`,
};
