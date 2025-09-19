"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CommonInput, { Country } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ForgetPassword = () => {
  const router = useRouter();

  const countries: Country[] = [
    {
      code: "+965",
      name: "Kuwait",
      flag: (
        <Image
          src={"/images/countryFlag.svg"}
          alt="KW Flag"
          width={24}
          height={24}
        />
      ),
    },
    {
      code: "+91",
      name: "India",
      flag: (
        <Image
          src={"/images/countryFlag.svg"}
          alt="IN Flag"
          width={24}
          height={24}
        />
      ),
    },
    {
      code: "+96",
      name: "UAE",
      flag: (
        <Image
          src={"/images/countryFlag.svg"}
          alt="AE Flag"
          width={24}
          height={24}
        />
      ),
    },
    {
      code: "+92",
      name: "Pakistan",
      flag: (
        <Image
          src={"/images/countryFlag.svg"}
          alt="PK Flag"
          width={24}
          height={24}
        />
      ),
    },
  ];

  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your authentication logic here
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
            <CommonInput
              label="Phone Number"
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              countries={countries}
              selectedCountry={selectedCountry}
              onCountryChange={handleCountryChange}
              showCountryDropdown={true}
              // auto-update prefix based on selected country
              prefix={selectedCountry.code}
              maxLength={8}
            />
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
