import { http } from "./http";

// 登录
export const loginApi = (data: { userEmail?: string; userName?: string; userPassword: string }) =>
  http.post("/user/login", data);

// 注册
export const signUpApi = (data: {
  username: string;
  userEmail: string;
  password: string;
  retryPassword: string;
  code: string;
}) => http.post("/user/signup", data);

// 发送注册验证码
export const sendSignUpCodeApi = (email: string) =>
  http.post("/user/signup/email", null, { params: { email } });

// 找回密码发送验证码
export const sendForgetCodeApi = (email: string) =>
  http.post("/user/forget/email", null, { params: { email } });

// 找回密码提交
export const resetPasswordApi = (data: {
  userEmail: string;
  code: string;
  password: string;
  confirmPassword: string;
}) => http.post("/user/forget/password", data);

// 退出登录
export const logoutApi = () => http.post("/user/logout");

// 上传头像
export const uploadAvatarApi = (data: FormData) => http.post("user/upload/avatar",
    data,{timeout:60000});

export const getUserInfoApi = () => http.get("user/get/info",)
