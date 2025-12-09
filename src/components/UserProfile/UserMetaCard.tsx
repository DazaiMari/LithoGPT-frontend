import { useState, useRef, useEffect } from "react";
import { uploadAvatarApi, getUserInfoApi } from "@/api";
import { toast } from "@/utils/message";
import { useUserInfoStore } from "@/store/userInfoStore";

const DEFAULT_AVATAR = "https://raw.githubusercontent.com/maximum2974/markdown-image/develop/89431227.png";

export default function UserMetaCard() {
  // 从 zustand store 获取（已自动持久化到 localStorage）
  const { avatarUrl, setAvatarUrl } = useUserInfoStore();
  
  // 本地预览 URL（createObjectURL 创建的 blob URL，临时用，刷新后失效）
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  // 如果 store 中有缓存，不显示 loading
  const [loading, setLoading] = useState(!avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 组件挂载时从后端获取最新头像
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // 只有没有缓存时才显示 loading
        if (!avatarUrl) {
          setLoading(true);
        }
        const res = await getUserInfoApi();
        // 后端返回格式: { code: 1, data: { userAvatar: "..." } }
        if (res?.data?.userAvatar) {
          setAvatarUrl(res.data.userAvatar); // 更新 store（自动持久化）
        }
      } catch (err) {
        console.log("Failed to fetch user info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [avatarUrl, setAvatarUrl]);

  // 当前显示的头像：优先显示本地预览，否则显示 store 中的 URL，最后显示默认头像
  const displayAvatarUrl = previewBlobUrl || avatarUrl || DEFAULT_AVATAR;

  // 点击按钮时触发文件选择
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // 处理文件选择
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件大小（最大 5MB）
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // 清理之前的本地预览 URL
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
    }

    // 创建本地预览（blob URL）
    const newPreviewBlobUrl = URL.createObjectURL(file);
    setPreviewBlobUrl(newPreviewBlobUrl);

    // 上传文件
    const formData = new FormData();
    formData.append("avatarImage", file);

    try {
      setUploading(true);
      const res = await uploadAvatarApi(formData);

      // 上传成功，保存服务器返回的 URL 到 store（自动持久化）
      if (res?.data) {
        console.log("Avatar server URL:", res.data);
        setAvatarUrl(res.data);
      }
      
      // 清理本地预览 URL（已有服务器 URL）
      URL.revokeObjectURL(newPreviewBlobUrl);
      setPreviewBlobUrl(null);
      
      toast.success("Avatar uploaded successfully");
    } catch (err) {
      console.log(err);
      // 上传失败，清理本地预览
      URL.revokeObjectURL(newPreviewBlobUrl);
      setPreviewBlobUrl(null);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      // 清空 input，允许再次选择同一文件
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            {/* 头像显示 */}
            <div className="relative w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img
                src={displayAvatarUrl}
                alt="user avatar"
                className="w-full h-full object-cover"
              />
              {/* 加载中或上传中遮罩 */}
              {(loading || uploading) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            <div className="order-3 xl:order-2">
              {/* 隐藏的文件输入 */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {/* 上传按钮 */}
              <button
                onClick={handleButtonClick}
                disabled={uploading}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 18H5a3 3 0 01-.176-5.995A5.001 5.001 0 0114.9 9.6a4 4 0 015.94 3.2A4.5 4.5 0 0119 18zM12 12v5m0-5l-3 3m3-3l3 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                {uploading ? "Uploading..." : "Upload your avatar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
