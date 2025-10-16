"use client";
import { useCountries } from "@/components/ui/CountryPicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CommonInput from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Country } from "@/components/ui/CountryPicker";
import { useAuthMutations } from "@/hooks/useAuthMutations";
import { toast } from 'react-toastify';
import { useAuthStore } from "@/app/store/authStore";

const ForgetPassword = () => {
  const router = useRouter();
  const countries: Country[] = useCountries();

  // default to first country in the list
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    countries[0] || null
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const { forgotPasswordMutation } = useAuthMutations();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
  };

  // ✅ Submit handler for Forgot Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCountry || !phoneNumber) {
      toast.error("Please enter your phone number and select a country.");
      return;
    }


    const payload = {
      callingCode: selectedCountry.code,
      phoneNumber,
    };

    forgotPasswordMutation.mutate(payload, {
      onSuccess: (response) => {
        console.log("Forgot password response:", response);
        toast.error("Please check your phone for the verification code.");

        const userId = response?.data.userId;
        useAuthStore.getState().setUserId(userId);
        router.push("/verify-otp");
      },
      onError: (error: any) => {
        toast.error("Failed to send OTP. Please try again.");
      },
    });
  };

  return (
    <Card className="w-full bg-transparent md:bg-black-600 rounded-[18px] border-0 max-w-[450px]">
      <CardHeader>
        <CardTitle className="text-white-100 font-bold text-[34px] md:text-[40px] lg:text-[46px]">
          Reset Password
        </CardTitle>
        <p className="text-white-100 text-[14px] md:text-[16px] font-normal !-mt-0.5">
          Enter your phone number and we’ll send you a verification code (OTP)
          to reset your password.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            {selectedCountry && (
              <CommonInput
                label="Phone Number"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                countries={countries}
                selectedCountry={selectedCountry}
                onCountryChange={handleCountryChange}
                showCountryDropdown={true}
                // prefix updates with selected country dial code
                prefix={selectedCountry.code}
                maxLength={15}
              />
            )}
          </div>

          <div className="pt-[110px]">
            <Button
              type="submit"
              className="w-full text-white-100 bg-red-600 rounded-xl py-6 hover:bg-red-700"
            >
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgetPassword;
