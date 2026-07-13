"use client";

import { ReactNode, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    const token = Cookies.get("osado-admin-token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[url('/images/AuthBg.png')] bg-cover bg-center flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto mb-14 text-center">
        <Image
          src="/Logo.png"
          alt="OSADO Logo"
          width={160}
          height={50}
          priority
          className="mx-auto"
        />
      </div>

      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
