import axios from "axios";
import { getToken, removeToken } from "@/utils/token";
import { toast } from "@/utils/message";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8091",
  timeout: 10000,
});

//  请求拦截：注入 token
http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//  响应拦截：统一错误处理
http.interceptors.response.use(
  (res) => {
    const data = res.data;
    // 检查响应中的 code 字段，如果 code !== 0，当作错误处理
    // 只有当响应是对象且包含 code 字段时才检查
    if (data && typeof data === 'object' && data !== null && 'code' in data) {
      // code 可能是数字 0 或字符串 "0"
      const code = data.code;
      if (code !== 0 && code !== '0' && code !== null && code !== undefined) {
        const errorMessage = data.message || "Request failed";
        toast.error(errorMessage);
        return Promise.reject(new Error(errorMessage));
      }
    }
    return data;
  },
  (error) => {
    // 网络错误（没有 response）
    if (!error.response) {
      const errorMessage = error.message || "Network error. Please check your connection and try again.";
      toast.error(errorMessage);
      return Promise.reject(error);
    }
    
    const status = error.response?.status;
    if (status === 401) {
      toast.error("Session expired, please login again");
      removeToken();
      window.location.href = "/login";
    } else {
      // 优先显示后端返回的错误消息
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.data?.message ||
                          error.message || 
                          "Request failed";
      toast.error(errorMessage);
    }
    return Promise.reject(error);
  }
);

export default http;
