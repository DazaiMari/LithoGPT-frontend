import { Modal } from "./index";
import Button from "../button/Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const iconColors = {
    danger: "bg-red-100 dark:bg-red-500/15 text-red-500",
    warning: "bg-warning-100 dark:bg-warning-500/15 text-warning-500",
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6" showCloseButton={false}>
      <div className="text-center">
        {/* Icon */}
        <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${iconColors[variant]}`}>
          {variant === "danger" ? (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h3>

        {/* Message */}
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

