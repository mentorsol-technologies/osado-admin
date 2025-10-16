"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { loginService } from "@/services/auth-services/authService";
import { useAuthStore } from "@/app/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CommonInput from "@/components/ui/input";
import { useCountries } from "@/components/ui/CountryPicker";
import { Country } from "@/components/ui/CountryPicker";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';


export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const countries = useCountries();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    countries.length > 0 ? countries[0] : null
  );

  const { setUser, setToken } = useAuthStore();

  // ✅ React Query Mutation
 const { mutate: login, isPending } = useMutation({
  mutationFn: (payload: any) => loginService(payload),
  onSuccess: (res: any) => {
    const userId = res?.userId;
    const accessToken = res?.accessToken;

    if (accessToken) {
      Cookies.set("token", accessToken, { expires: 7 }); 
      setToken(accessToken);
      setUser(userId);
     toast.success("Login successful!");
      router.push("/dashboard");
    }
  },
  onError: (error: any) => {
    console.error("Login Error:", error);
    toast.error("Failed Login")
  },
});

    
  // ✅ Handle form submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCountry) {
     toast.error("Please select your country before logging in.")
      return;
    }

    // ✅ Build payload as per backend requirement
    const payload = {
      callingCode: selectedCountry.code,
      phoneNumber: phoneNumber,
      authProvider: "phone",
      countryCode: selectedCountry.iso3,
      password: password,
    };

    login(payload);
  };


  return (
    <Card className="w-full bg-transparent md:bg-black-600 rounded-[18px] border-0 max-w-[450px]">
      <CardHeader>
        <CardTitle className="text-white-100 text-center font-bold text-[34px] md:text-[40px] lg:text-[46px]">
          Log In
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Phone Number */}
          <CommonInput
            label="Phone Number"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            maxLength={15}
            countries={countries}
            selectedCountry={selectedCountry || undefined}
            onCountryChange={setSelectedCountry}
            showCountryDropdown
          />

          {/* Password */}
          <CommonInput
            name="password"
            label="Password"
            placeholder="Write password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="text-right pb-2">
            <Link
              href="/reset-password"
              className="text-sm text-white-100 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full text-white-100 bg-red-600 rounded-xl py-6 hover:bg-red-700"
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Continue"}
          </Button>

          <div className="flex items-center justify-center gap-2 text-sm text-white-100">
            Don&apos;t have an account?
            <Link href="/" className="hover:underline">
              Sign Up
            </Link>
          </div>
        </form>

        {/* Social Logins */}
        <div className="mt-6 flex justify-center items-center gap-5">
          <Image src="/images/Google.png" alt="Google" width={58} height={58} />
          <Image src="/images/Apple.png" alt="Apple" width={58} height={58} />
        </div>
      </CardContent>
    </Card>
  );
}
