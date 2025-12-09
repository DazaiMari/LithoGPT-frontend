import ComponentCard from "../../common/ComponentCard";
import { useDropzone } from "react-dropzone";
import { stoneUpload } from "@/api/stone"; // ★ 引入你的接口
import { useState, useEffect } from "react";
import { toast } from "@/utils/message";
// import Dropzone from "react-dropzone";

interface DropzoneComponentProps {
  onUploadSuccess?: (url: string) => void;
  initialImageUrl?: string; // 初始图片 URL（用于路由切换后恢复）
}

const DropzoneComponent: React.FC<DropzoneComponentProps> = ({ onUploadSuccess, initialImageUrl }) => {
    const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null);
  const [fileName, setFileName] = useState<string>("");
  const [isServerUrl, setIsServerUrl] = useState<boolean>(!!initialImageUrl); // 标记是否是服务器 URL

  // 当 initialImageUrl 变化时更新预览
  useEffect(() => {
    if (initialImageUrl) {
      setPreview(initialImageUrl);
      setIsServerUrl(true);
    }
  }, [initialImageUrl]);

  // 清理预览 URL，防止内存泄漏（只清理本地 blob URL）
  useEffect(() => {
    return () => {
      if (preview && !isServerUrl) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, isServerUrl]);

    const onDrop = async (acceptedFiles: File[]) => {
    console.log("Files dropped:", acceptedFiles);
    if (!acceptedFiles.length) return;

    const file = acceptedFiles[0]; // 后端只接收一个文件
    
    // 清理之前的本地预览 URL
    if (preview && !isServerUrl) {
      URL.revokeObjectURL(preview);
    }

    // 创建预览 URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setFileName(file.name);
    setIsServerUrl(false); // 标记为本地 blob URL

    const formData = new FormData();
    formData.append("stoneImage", file); // ★ key 必须叫 stoneImage

    try {
      setUploading(true);
      // ★ 上传接口
      const res = await stoneUpload(formData);
      const imageServerUrl = res.data;
      console.log("res", imageServerUrl);
      
      // 上传成功后，用服务器 URL 替换本地预览
      URL.revokeObjectURL(previewUrl);
      setPreview(imageServerUrl);
      setIsServerUrl(true);
      
      onUploadSuccess?.(imageServerUrl);
        console.log("Uploaded file: ", acceptedFiles);
      toast.success("Upload success");
    } catch {
      toast.error("Upload failed");
      // 上传失败时清除预览
      URL.revokeObjectURL(previewUrl);
      setPreview(null);
      setFileName("");
      setIsServerUrl(false);
    } finally {
      setUploading(false);
    }
  };

  // 移除预览图片
  const handleRemove = () => {
    if (preview && !isServerUrl) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setFileName("");
    setIsServerUrl(false);
    onUploadSuccess?.(""); // 通知父组件清除
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
  });
  return (
    <ComponentCard title="Dropzone">
      <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-red-500 dark:border-gray-700 rounded-xl hover:border-red-500">
        {/* 预览模式 */}
        {preview ? (
          <div className="relative p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center">
              {/* 预览图片 */}
              <div className="relative group mb-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-[300px] max-w-full object-contain rounded-lg shadow-md"
                />
                {/* 上传中遮罩 */}
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="mt-2 text-white text-sm">Uploading...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 文件名 */}
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 truncate max-w-full">
                {fileName}
              </p>

              {/* 操作按钮 */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={uploading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <button
                    type="button"
                    disabled={uploading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 上传模式 */
        <form
          {...getRootProps()}
            className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10
        ${
          isDragActive
            ? "border-red-500 bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
        }
      `}
          id="demo-upload"
        >
          {/* Hidden Input */}
          <input {...getInputProps()} />

          <div className="dz-message flex flex-col items-center m-0!">
            {/* Icon Container */}
            <div className="mb-[22px] flex justify-center">
                <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <svg
                  className="fill-current"
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                  />
                </svg>
              </div>
            </div>

            {/* Text Content */}
            <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
              {isDragActive ? "Drop Image Here" : "Drag & Drop Image Here"}
            </h4>

              <span className="text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
              Drag and drop your PNG, JPG, WebP, SVG images here or browse
            </span>

            <span className="font-medium underline text-theme-sm text-red-500">
              Browse File
            </span>
          </div>
        </form>
        )}
      </div>
    </ComponentCard>
  );
};

export default DropzoneComponent;
