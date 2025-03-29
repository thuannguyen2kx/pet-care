import { useStore } from "@/store/store";
import { CustomError } from "@/types/custom-error";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const options = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

API.interceptors.request.use((config) => {
  const accessToken = useStore.getState().accessToken;
  config.headers.Authorization = `Bearer ${accessToken}`;

  return config
});
API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const customError: CustomError = {
      ...error,
      errorCode: error?.errorCode || "UNKNOWN_ERROR",
    }
    return Promise.reject(customError);
  }
);

export default API;
