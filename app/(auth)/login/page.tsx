"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CommonInput from "@/components/ui/input";
import { useCountries } from "@/components/ui/CountryPicker";
import { Country } from "@/components/ui/CountryPicker";

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const countries = useCountries();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    countries.length > 0 ? countries[0] : null
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
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

          {/* Submit */}
          <Button
            type="submit"
            className="w-full text-white-100 bg-red-600 rounded-xl py-6 hover:bg-red-700"
          >
            Continue
          </Button>

          <div className="flex items-center justify-center gap-2 text-sm text-white-100">
            Don&apos;t have an account?
            <Link href="/" className="hover:underline">
              Sign Up
            </Link>
          </div>
        </form>

        {/* Social logins */}
        <div className="mt-6 flex justify-center items-center gap-5">
          <Image src="/images/Google.png" alt="Google" width={58} height={58} />
          <Image src="/images/Apple.png" alt="Apple" width={58} height={58} />
        </div>
      </CardContent>
    </Card>
  );
}
