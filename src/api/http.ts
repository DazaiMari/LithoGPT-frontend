import axios from "axios";
import JSONBig from "json-bigint";
import { getToken, removeToken } from "@/utils/token";
import { toast } from "@/utils/message";

const BASE_URL= import.meta.env.VITE_API_BASE_URL || "http://localhost:8091"

// 配置 json-bigint：将大整数转换为字符串，避免精度丢失
const JSONBigString = JSONBig({ storeAsString: true });

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  // 使用自定义的 JSON 解析器处理响应数据
  transformResponse: [(data) => {
    try {
      return JSONBigString.parse(data);
    } catch {
      return data;
    }
  }],
});

// SSE 流专用实例（无超时，无响应拦截）
const httpStream = axios.create({
  baseURL: BASE_URL,
  timeout: 0, // 不设置超时
  // 使用自定义的 JSON 解析器处理响应数据
  transformResponse: [(data) => {
    try {
      return JSONBigString.parse(data);
    } catch {
      return data;
    }
  }],
});

//  请求拦截：注入 token
http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// SSE 流也需要 token
httpStream.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// SSE 流响应拦截：仅处理错误，不处理 data.code（因为 SSE 是文本流格式）
httpStream.interceptors.response.use(
  (res) => res, // 成功时直接返回，不做处理
  (error) => {
    // 网络错误（没有 response）
    if (!error.response) {
      const errorMessage = error.message || "Network error. Please check your connection.";
      toast.error(errorMessage);
      return Promise.reject(error);
    }

    const status = error.response?.status;
    if (status === 401) {
      toast.error("Session expired, please login again");
      removeToken();
      window.location.href = "/login";
    } else if (status === 403) {
      toast.error("Access denied");
    } else if (status === 404) {
      toast.error("Resource not found");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    } else {
      const errorMessage = error.response?.data?.message || error.message || "Request failed";
      toast.error(errorMessage);
    }
    return Promise.reject(error);
  }
);

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

export { http, httpStream };

