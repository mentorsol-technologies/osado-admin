'use client';

import { useToast } from '@/hooks/use-toast';
import { Portal } from "@radix-ui/react-portal";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';

export function AppToaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      <Portal>
        {toasts.map(({ id, title, description, action, ...props }) => (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        ))}

        {/* ✅ Force above modal layers */}
        <ToastViewport className="fixed top-4 right-4 z-[9999]" />
      </Portal>
    </ToastProvider>
  );
}
