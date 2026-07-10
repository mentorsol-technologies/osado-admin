"use client";

import { Button } from "../button";
import Modal from "../Modal";

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export default function DeleteConfirmModal({
  open,
  onOpenChange,
  title = "Delete Category",
  description = "Are you sure you want to delete this category? This action cannot be undone.",
  onConfirm,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      open={open}
      size="md"
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      footer={
        <div className="flex flex-col sm:flex-row  gap-3 w-full">
          <Button
            onClick={onConfirm}
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : confirmText}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={isLoading}
          >
            {cancelText}
          </Button>
        </div>
      }
    >
      <></>
    </Modal>
  );
}
