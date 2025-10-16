"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import OneTimePassword from "@/components/ui/otpInput";
import { useAuthMutations } from "@/hooks/useAuthMutations";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/app/store/authStore";

const RESEND_INTERVAL = 60; // seconds

const VerifyAccount = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(RESEND_INTERVAL);
  const router = useRouter();
  const { verifyOtpMutation } = useAuthMutations();
  const userId = useAuthStore((state) => state.userId);

  // Timer logic
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Format time MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit OTP sent to your phone.",
        variant: "error",
      });
      return;
    }

    verifyOtpMutation.mutate(
      { otpCode: Number(otp), userId },
      {
        onSuccess: (res) => {
           const token = res?.accessToken;
          if (token) {
            useAuthStore.getState().setAccessToken(token);
  }
          toast({
            title: "OTP Verified",
            description: "You can now set your new password.",
            variant: "success",
          });
          // Navigate to create password page
          router.push("/create-password");
        },
        onError: (err: any) => {
          toast({
            title: "Verification failed",
            description:
              err?.response?.data?.message || "Failed to verify OTP",
            variant: "error",
          });
        },
      }
    );
  };

  return (
    <Card className="w-full bg-transparent md:bg-black-600 rounded-[18px] border-0 max-w-[450px]">
      <CardHeader>
        <CardTitle className="text-white-100 font-bold text-[34px] md:text-[40px] lg:text-[46px] leading-[1.2]">
          Enter your <br /> verification code
        </CardTitle>
        <p className="text-white-100 text-[14px] md:text-[16px] font-normal">
          Enter the 6-digit verification code sent to
        </p>
        <div className="flex items-center gap-[5px] text-[14px] md:text-[16px] font-normal !-mt-0.5">
          <span className="text-white-100 text-[14px] font-normal">
            +965 6592 8329
          </span>
          <span className="text-white-100 text-[14px] md:text-[16px] font-normal">
            -
          </span>
          <button className="text-red-600 text-[14px] md:text-[16px] font-normal hover:underline">
            Edit
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <OneTimePassword onChange={(value) => setOtp(value)} />
        </div>
        <div className="flex justify-center items-center pt-5 gap-2">
          <div className="text-white-100 text-[14px] md:text-[16px] font-normal">
            Resend code in
          </div>
          <div className="text-red-600 text-[14px] md:text-[16px]">
            {formatTime(timer)}
          </div>
        </div>
        <div className="pt-[125px]">
          {" "}
          <Button
            type="submit"
            onClick={handleVerifyOtp}
            className="w-full text-white-100 bg-red-600 rounded-xl py-6 hover:bg-red-700"
            disabled={verifyOtpMutation.isLoading}
          >
            {verifyOtpMutation.isLoading ? "Verifying..." : "Continue"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerifyAccount;
