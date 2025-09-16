"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogOverlay
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: ModalProps) {
  return (
        <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent   className="
        fixed left-1/2 top-1/2 z-50 w-[95%] max-w-lg sm:max-w-2xl 
        -translate-x-1/2 -translate-y-1/2 rounded-xl bg-black-400 p-6 shadow-lg
        data-[state=open]:animate-in data-[state=closed]:animate-out
        data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0
        data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95
    "
    >
            <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>

            <div className="space-y-4">{children}</div>

            {footer && <DialogFooter>{footer}</DialogFooter>}
        </DialogContent>
        </Dialog>
  );
}
