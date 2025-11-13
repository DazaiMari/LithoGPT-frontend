import {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { sendForgetCodeApi, resetPasswordApi } from "@/api/user";
import { toast } from "@/utils/message";
//import Checkbox from "../form/input/Checkbox";

export default function ResetPwdForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 错误状态
  const [errors, setErrors] = useState({
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
  });

  // 倒计时逻辑
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // 表单验证函数
  const validateForm = (): boolean => {
    const newErrors = {
      email: "",
      code: "",
      password: "",
      confirmPassword: "",
    };

    let isValid = true;

    // 验证邮箱
    if (!email || !email.trim()) {
      newErrors.email = "Please enter your email address";
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address";
        isValid = false;
      }
    }

    // 验证验证码
    if (!code || !code.trim()) {
      newErrors.code = "Please enter the verification code";
      isValid = false;
    }

    // 验证密码
    if (!password || !password.trim()) {
      newErrors.password = "Please enter your password";
      isValid = false;
    } else {
      // 密码强度验证：8-20字符，必须包含大小写字母和数字
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/;
      if (!passwordRegex.test(password)) {
        newErrors.password = "Password must be 8-20 characters, including upper & lower case letters and numbers";
        isValid = false;
      }
    }

    // 验证确认密码
    if (!confirmPassword || !confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      // 验证密码匹配
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSendCode = async () => {
    // 验证邮箱是否填写
    if (!email || !email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    // 简单的邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSending(true);
    try {
      await sendForgetCodeApi(email);
      setCountdown(60); // 倒计时60秒
      toast.success("Verification code sent successfully!");
    } catch (err: any) {
      // http 拦截器已经处理了错误并显示了 toast
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 执行表单验证
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPasswordApi({
        userEmail: email.trim(),
        code: code.trim(),
        password: password,
        confirmPassword: confirmPassword,
      });

      toast.success("Password reset successful! Redirecting to sign in...");

      // 延迟跳转到登录页面
      setTimeout(() => {
        navigate("/signin");
      }, 1500);
    } catch (err: any) {
      // 拦截器已经处理了错误并显示了 toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Reset Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to reset your password!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors({ ...errors, email: "" });
                      }
                    }}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-error-500">{errors.email}</p>
                  )}
                </div>
            {/* <!-- Email Verification Code --> */}
                <div>
                  <Label htmlFor="code">
                    Email Verification Code:
                    <span className="text-error-500">*</span>
                  </Label>

                  <div className="flex gap-2 w-full">
                    <Input
                      type="text"
                      id="code"
                      name="code"
                      placeholder="Enter your code"
                      className="flex-1"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                        if (errors.code) {
                          setErrors({ ...errors, code: "" });
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendCode}
                      disabled={isSending || countdown > 0}
                      className="px-5 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors whitespace-nowrap"
                    >
                      {countdown > 0 ? `${countdown}s` : "Send Code"}
                    </Button>
                  </div>
                  {errors.code ? (
                    <p className="mt-1 text-xs text-error-500">{errors.code}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      6-digit verification code, valid for 5 minutes
                    </p>
                  )}
                </div>

                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) {
                          setErrors({ ...errors, password: "" });
                        }
                      }}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                  {errors.password ? (
                    <p className="mt-1 text-xs text-error-500">{errors.password}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      8-20 characters, must include upper & lower case letters and numbers
                    </p>
                  )}
                </div>
                  {/* <!-- Confirm Password --> */}
                <div>
                  <Label>
                    Confirm Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) {
                          setErrors({ ...errors, confirmPassword: "" });
                        }
                      }}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                  {errors.confirmPassword ? (
                    <p className="mt-1 text-xs text-error-500">{errors.confirmPassword}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Must match the password above
                    </p>
                  )}
                </div>
                {/* <!-- Checkbox --> */}
                {/*<div className="flex items-center gap-3">*/}
                {/*  <Checkbox*/}
                {/*    className="w-5 h-5"*/}
                {/*    checked={isChecked}*/}
                {/*    onChange={setIsChecked}*/}
                {/*  />*/}
                {/*  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">*/}
                {/*    By creating an account means you agree to the{" "}*/}
                {/*    <span className="text-gray-800 dark:text-white/90">*/}
                {/*      Terms and Conditions,*/}
                {/*    </span>{" "}*/}
                {/*    and our{" "}*/}
                {/*    <span className="text-gray-800 dark:text-white">*/}
                {/*      Privacy Policy*/}
                {/*    </span>*/}
                {/*  </p>*/}
                {/*</div>*/}
                {/* <!-- Button --> */}
                <div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-red-500 shadow-theme-xs hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Resetting Password..." : "Reset Password"}
                  </button>
                </div>
                <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account? {""}
                <Link
                  to="/signin"
                  className="text-red-500 hover:text-red-600 dark:text-red-400">
                  Back to Sign In
                </Link>
              </p>
            </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
