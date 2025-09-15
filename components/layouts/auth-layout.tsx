"use client";

import { ReactNode } from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[url('/images/AuthBg.png')] bg-cover bg-center flex flex-col p-4">
      <div className="w-full max-w-md mx-auto mb-2 text-center">
        <Image
          src="/Logo.png"
          alt="OSADO Logo"
          width={160}
          height={50}
          priority
          className="mx-auto"
        />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
