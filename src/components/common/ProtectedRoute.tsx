import { useEffect, useRef } from "react";
import { Navigate, Outlet } from "react-router";
import { getToken } from "../../utils/token";
import { toast } from "../../utils/message";

/**
 * 路由守卫组件
 * 用于保护需要登录才能访问的路由
 * 如果用户未登录（没有token），自动重定向到登录页
 */
const ProtectedRoute = () => {
  const token = getToken();
  const hasShownToast = useRef(false);

  useEffect(() => {
    // 如果没有token且还没显示过提示，则显示错误提示
    if (!token && !hasShownToast.current) {
      toast.error("Please login first");
      hasShownToast.current = true;
    }
  }, [token]);

  // 如果没有token，重定向到登录页
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  // 如果有token，渲染子路由
  return <Outlet />;
};

export default ProtectedRoute;
