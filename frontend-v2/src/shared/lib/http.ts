import type { AxiosInstance, AxiosError } from 'axios';
import axios from 'axios';
import { toast } from 'sonner';

import { storage } from './storage';
import { AUTH_ENDPOINTS } from '../config/api-endpoints';
import { HTTPSTATUS, STORAGE_KEYS } from '../constant';
import { ErrorCodeEnum } from '../constant/error-code';
import type { TApiResponseError } from '../types/api-response';

import { env } from '@/shared/config/env';
export class ApiError extends Error {
  public errorCode: string;
  public status: number;
  public data?: unknown;

  constructor(errorCode: string, message: string, status: number, data: unknown) {
    super(message);
    this.errorCode = errorCode;
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
class Http {
  instance: AxiosInstance;
  private accessToken: string;
  constructor() {
    this.accessToken = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN) || '';
    this.instance = axios.create({
      baseURL: env.API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
          return config;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config;

        if (url === AUTH_ENDPOINTS.LOGIN) {
          const data = response.data;
          this.accessToken = data.data.access_token;
          storage.set(STORAGE_KEYS.ACCESS_TOKEN, this.accessToken);
        } else if (url === AUTH_ENDPOINTS.LOGOUT) {
          this.accessToken = '';
          storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        }

        return response.data;
      },
      (error: AxiosError) => {
        const data = error.response?.data as TApiResponseError;
        const message = data?.message || error.message;
        const errorCode = data?.errorCode || error.code || ErrorCodeEnum.UNKNOW_ERROR;
        const apiError = new ApiError(
          errorCode,
          message,
          error.response?.status || HTTPSTATUS.INTERNAL_SERVER_ERROR,
          data.errors,
        );

        if (apiError.status === HTTPSTATUS.UNAUTHORIZED) {
          this.accessToken = '';
          storage.clearToken();
        }

        if (apiError.status !== HTTPSTATUS.UNAUTHORIZED) {
          toast.error(apiError.message);
        }

        return Promise.reject(apiError);
      },
    );
  }
  setAccessToken(token: string) {
    this.accessToken = token;
  }
}

const httpClient = new Http();

export const http = httpClient.instance;
export const setAccessToken = httpClient.setAccessToken.bind(httpClient);
