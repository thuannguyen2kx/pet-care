type TApiResponseSuccess<T> = {
  status: number;
  message: string;
  data: T;
};

type TApiResponseError = {
  status: number;
  message: string;
  errorCode: string;
};
export type { TApiResponseSuccess, TApiResponseError };
