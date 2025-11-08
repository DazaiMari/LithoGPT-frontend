import {useEffect, useState} from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
//import Checkbox from "../form/input/Checkbox";

export default function ResetPwdForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

    // 倒计时逻辑
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendCode = async () => {
    setIsSending(true);
    try {
      // 在这里调用后端发送验证码接口
      console.log("Sending verification code...");
      setCountdown(60); // 倒计时60秒
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
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
            <form>
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
                  />
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
                    />
                    <Button
                      onClick={handleSendCode}
                      disabled={isSending || countdown > 0}
                      className="px-5 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors whitespace-nowrap"
                    >
                      {countdown > 0 ? `${countdown}s` : "Send Code"}
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  6-digit verification code, valid for 5 minutes
                    </p>
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
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  8-20 characters, must include upper & lower case letters and numbers</p>
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
                  <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-red-500 shadow-theme-xs hover:bg-red-600">
                    Reset Password
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
