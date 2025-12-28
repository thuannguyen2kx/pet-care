import { Navigate, useLocation } from 'react-router';
import z from 'zod';

import { http } from './http';
import { configureAuth } from './react-query-auth';
import { paths } from '../config/paths';

import { AUTH_ENDPOINTS } from '@/shared/config/api-endpoints';
import type { TApiResponseSuccess, TUser } from '@/shared/types/api-response';

export type TAuthResponse = {
  user: TUser;
  access_token: string;
};
export const USE_USER_KEY = ['authicated-user'];
export const getUser = async (): Promise<TUser> => {
  const response = await http.get(AUTH_ENDPOINTS.ME);
  return response.data.user;
};

const logout = async () => {
  return await http.post(AUTH_ENDPOINTS.LOGOUT);
};

// eslint-disable-next-line react-refresh/only-export-components
export const loginInputSchema = z.object({
  email: z.email('Email không hợp lệ').min(1, 'Vui lồng nhập email'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  remenberMe: z.boolean().optional(),
});

export type TLoginInput = z.infer<typeof loginInputSchema>;
export type TLoginPayload = Omit<TLoginInput, 'remenberMe'>;

const loginWithEmailAndPassword = (
  data: TLoginPayload,
): Promise<TApiResponseSuccess<TAuthResponse>> => {
  return http.post(AUTH_ENDPOINTS.LOGIN, data);
};

// eslint-disable-next-line react-refresh/only-export-components
export const registerInputSchema = z
  .object({
    fullName: z.string().min(1, 'Vui lồng nhập họ và tên'),
    email: z.email('Email không hợp lệ').min(1, 'Vui lồng nhập email'),
    password: z.string().min(1, 'Vui lồng nhập mật khẩu'),
    confirmPassword: z.string().min(1, 'Vui lòng nhập mật khẩu'),
    agreeTerms: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khợp lệ nhau',
    path: ['confirmPassword'],
  })
  .refine((data) => data.agreeTerms, {
    message: 'Vui lòng đồng ý với chính sách của chúng tôi',
    path: ['agreeTerms'],
  });
export type TRegisterInput = z.infer<typeof registerInputSchema>;
export type TRegisterPayload = Omit<TRegisterInput, 'confirmPassword' | 'agreeTerms'>;

const registerWithEmailAndPassword = (
  data: TRegisterPayload,
): Promise<TApiResponseSuccess<{ message: string }>> => {
  return http.post(AUTH_ENDPOINTS.REGISTER, data);
};

const authConfig = {
  userKey: USE_USER_KEY,
  userFn: getUser,
  loginFn: async (data: TLoginPayload) => {
    const auth = await loginWithEmailAndPassword(data);
    return auth.data.user;
  },
  registerFn: async (data: TRegisterPayload) => {
    await registerWithEmailAndPassword(data);
    return null;
  },
  logoutFn: logout,
};

// eslint-disable-next-line react-refresh/only-export-components
export const { useUser, useLogin, useLogout, useRegister, AuthLoader } = configureAuth(authConfig);

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUser({
    staleTime: 0,
  });
  const location = useLocation();

  if (!user.data) {
    return <Navigate to={paths.auth.login.getHref(location.pathname)} replace />;
  }

  return <>{children}</>;
};
