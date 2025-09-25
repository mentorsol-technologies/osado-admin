"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "lg",
}: ModalProps) {
  const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const modalFontClasses = "font-medium text-[25px] text-white"; 

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`fixed left-1/2 top-1/2 z-50 w-[95%] ${sizeClasses[size]} -translate-x-1/2 -translate-y-1/2 rounded-xl bg-black-400 p-6 shadow-lg`}>
        {/* Header with close button inside */}
        <DialogHeader>
          <DialogTitle className={modalFontClasses}>{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-white mt-1">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Main content */}
        <div className="space-y-4">{children}</div>
        {/* Footer */}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
