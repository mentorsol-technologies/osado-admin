"use client";
import { useCountries } from "@/components/ui/CountryPicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CommonInput from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Country } from "@/components/ui/CountryPicker";

const ForgetPassword = () => {
  const router = useRouter();
  const countries: Country[] = useCountries();

  // default to first country in the list
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    countries[0] || null
  );
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // 🔑 Add your OTP / password reset logic here
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
              onClick={() => router.push("/create-password")}
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
