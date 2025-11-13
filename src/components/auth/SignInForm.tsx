import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
// import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { loginApi } from "@/api/user";
import { toast } from "@/utils/message";
import { useUserStore } from "@/store/userStore";

export default function SignInForm() {
  const navigate = useNavigate();
  const { setToken } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [identifier, setIdentifier] = useState(""); // email or username
  const [password, setPassword] = useState("");
  // const [isChecked, setIsChecked] = useState(false);

  // 错误状态
  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
  });

  // 表单验证函数
  const validateForm = (): boolean => {
    const newErrors = {
      identifier: "",
      password: "",
    };

    let isValid = true;

    // 验证邮箱/用户名
    if (!identifier || !identifier.trim()) {
      newErrors.identifier = "Please enter your email or username";
      isValid = false;
    }

    // 验证密码
    if (!password || !password.trim()) {
      newErrors.password = "Please enter your password";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 执行表单验证
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // 判断是邮箱还是用户名
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim());
      
      const loginData: { userEmail?: string; userName?: string; userPassword: string } = {
        userPassword: password,
      };

      if (isEmail) {
        loginData.userEmail = identifier.trim();
      } else {
        loginData.userName = identifier.trim();
      }

      const response: any = await loginApi(loginData);

      // 保存 token
      // 响应格式: { code: 0, data: "token_string", message: "ok" }
      if (response?.code === 0 && response?.data) {
        setToken(response.data);
        toast.success("Login successful! Redirecting...");
        
        // 延迟跳转到首页
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error(response?.message || "Login failed: No token received");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
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
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email/ Username <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input 
                    placeholder="info@gmail.com/ Username"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (errors.identifier) {
                        setErrors({ ...errors, identifier: "" });
                      }
                    }}
                  />
                  {errors.identifier && (
                    <p className="mt-1 text-xs text-error-500">{errors.identifier}</p>
                  )}
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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
                  {errors.password && (
                    <p className="mt-1 text-xs text-error-500">{errors.password}</p>
                  )}
                </div>
                <div className="flex items-center justify-end">
                  {/*<div className="flex items-center gap-3">*/}
                  {/*  <Checkbox checked={isChecked} onChange={setIsChecked} />*/}
                  {/*  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">*/}
                  {/*    Keep me logged in*/}
                  {/*  </span>*/}
                  {/*</div>*/}
                  <Link
                    to="/reset-password"
                    className="text-sm text-red-500 hover:text-red-600 dark:text-red-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed" 
                    size="sm"
                  >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don't have an account? {""}
                <Link
                  to="/signup"
                  className="text-red-500 hover:text-red-600 dark:text-red-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
