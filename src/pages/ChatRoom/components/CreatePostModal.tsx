import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import TextArea from "@/components/form/input/TextArea";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  setTitle: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  images: string[];
  uploadingImage: boolean;
  submitting: boolean;
  imageInputRef: React.RefObject<HTMLInputElement | null>;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSubmit: () => void;
}

export default function CreatePostModal({
  isOpen,
  onClose,
  title,
  setTitle,
  content,
  setContent,
  images,
  uploadingImage,
  submitting,
  imageInputRef,
  onImageUpload,
  onRemoveImage,
  onSubmit,
}: CreatePostModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-[90%] max-w-md p-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        Create New Post
      </h2>

      <div className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Content Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content
          </label>
          <TextArea
            value={content}
            onChange={setContent}
            placeholder="Share your thoughts..."
            rows={5}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Images
          </label>
          <input
            type="file"
            ref={imageInputRef}
            onChange={onImageUpload}
            accept="image/*"
            className="hidden"
          />
          <div className="flex flex-wrap gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                <button
                  onClick={() => onRemoveImage(idx)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => imageInputRef.current?.click()}
              disabled={uploadingImage}
              className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-red-500 hover:text-red-500 transition-colors dark:border-gray-700"
            >
              {uploadingImage ? (
                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Actions */}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={submitting}>
          {submitting ? "Posting..." : "Post"}
        </Button>
      </div>
    </Modal>
  );
}

