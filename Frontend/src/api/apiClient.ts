import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = Number(error.response?.status);
    const errorData = error.response?.data as { message?: string } | undefined;
    const errorMessage =
      (errorData && typeof errorData === "object" && "message" in errorData
        ? errorData.message
        : null) ||
      error.message ||
      "An unknown error occurred";

    toast.error(errorMessage);

    console.error("API Error:", errorData || errorMessage);

    const navigate = useNavigate();
    if ([401, 403].includes(status)) {
      toast.warning("Session expired. Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }

    return Promise.reject(errorMessage);
  }
);

const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get<T>(url, config).then((res) => res.data),

  post: <T, D>(url: string, data: D, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.post<T>(url, data, config).then((res) => res.data),

  put: <T, D>(url: string, data: D, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.put<T>(url, data, config).then((res) => res.data),

  patch: <T, D>(
    url: string,
    data: D,
    config?: AxiosRequestConfig
  ): Promise<T> =>
    apiClient.patch<T>(url, data, config).then((res) => res.data),

  delete: <T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> =>
    apiClient.delete<T>(url, { ...config, data }).then((res) => res.data),
};

export default api;
