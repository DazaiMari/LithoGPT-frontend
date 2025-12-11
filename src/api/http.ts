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

// 递归转换请求数据中的相对路径为完整的 MinIO URL
// 将 /uploads/xxx 转换回 http://68.64.179.75:9000/uploads/xxx
// 这样后端可以正确访问 MinIO 资源
function denormalizeImageUrls(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  // 如果是字符串，检查是否是相对路径
  if (typeof obj === 'string') {
    // 匹配相对路径: /uploads/xxx
    if (obj.startsWith('/uploads/')) {
      // 转换回完整的 MinIO URL
      return `http://68.64.179.75:9000${obj}`;
    }
    return obj;
  }
  
  // 如果是数组，递归处理每个元素
  if (Array.isArray(obj)) {
    return obj.map(item => denormalizeImageUrls(item));
  }
  
  // 如果是对象，递归处理每个属性
  if (typeof obj === 'object') {
    const denormalized: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        denormalized[key] = denormalizeImageUrls(obj[key]);
      }
    }
    return denormalized;
  }
  
  return obj;
}

//  请求拦截：注入 token 并转换图片 URL
http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // 转换请求数据中的相对路径为完整的 MinIO URL
  // 注意：跳过 FormData，因为它是用于文件上传的特殊对象
  if (config.data && !(config.data instanceof FormData)) {
    config.data = denormalizeImageUrls(config.data);
  }
  // 转换 URL 参数中的相对路径
  if (config.params) {
    config.params = denormalizeImageUrls(config.params);
  }
  
  return config;
});

// SSE 流也需要 token 和 URL 转换
httpStream.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // 转换请求数据中的相对路径为完整的 MinIO URL
  // 注意：跳过 FormData，因为它是用于文件上传的特殊对象
  if (config.data && !(config.data instanceof FormData)) {
    config.data = denormalizeImageUrls(config.data);
  }
  // 转换 URL 参数中的相对路径
  if (config.params) {
    config.params = denormalizeImageUrls(config.params);
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

// 递归转换响应数据中的 MinIO HTTP URL 为相对路径
// 解决 HTTPS 页面加载 HTTP 资源的混合内容问题
function normalizeImageUrls(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  // 如果是字符串，检查是否是 MinIO URL 或包含 URL 的 JSON 字符串
  if (typeof obj === 'string') {
    // 先检查是否是直接的 MinIO URL
    const minioPattern = /^(https?:\/\/[^\/]+)(\/uploads\/.+)$/i;
    const match = obj.match(minioPattern);
    if (match) {
      const baseUrl = match[1];
      const pathPart = match[2]; // 包含 /uploads/ 的路径部分
      
      try {
        // 尝试直接解析 URL（如果已经是正确编码的）
        const url = new URL(obj);
        return url.pathname;
      } catch {
        // URL 解析失败，可能是包含未编码的中文字符
        // 手动处理：编码路径部分中的中文字符
        // 路径格式：/uploads/filename.jpg
        const pathSegments = pathPart.split('/');
        const encodedPath = pathSegments.map((segment, index) => {
          if (index === 0) {
            // 第一个是空字符串（因为路径以 / 开头），或者是 /uploads
            return segment;
          }
          // 检查是否包含未编码的中文字符
          if (segment && /[^\x00-\x7F]/.test(segment) && !/%[0-9A-F]{2}/i.test(segment)) {
            return encodeURIComponent(segment);
          }
          return segment;
        }).join('/');
        
        return encodedPath;
      }
    }
    
    // 检查字符串中是否包含 MinIO URL 模式
    // 如果包含，可能是 JSON 字符串，尝试解析并转换
    if (obj.includes('/uploads/') && (obj.includes('http://') || obj.includes('https://'))) {
      try {
        // 尝试解析 JSON（可能是数组或对象格式的字符串）
        const parsed = JSON.parse(obj);
        // 如果解析成功，递归处理解析后的内容
        const normalized = normalizeImageUrls(parsed);
        // 重新序列化为 JSON 字符串
        return JSON.stringify(normalized);
      } catch {
        // 不是有效的 JSON，可能是普通字符串包含 URL，继续处理
      }
    }
    
    return obj;
  }
  
  // 如果是数组，递归处理每个元素
  if (Array.isArray(obj)) {
    return obj.map(item => normalizeImageUrls(item));
  }
  
  // 如果是对象，递归处理每个属性
  if (typeof obj === 'object') {
    const normalized: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        normalized[key] = normalizeImageUrls(obj[key]);
      }
    }
    return normalized;
  }
  
  return obj;
}

//  响应拦截：统一错误处理和 URL 转换
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
    // 转换响应数据中的 MinIO URL 为相对路径
    return normalizeImageUrls(data);
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

