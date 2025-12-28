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
  EMPLOYEE: `${API_VERSION}/employee`,
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
