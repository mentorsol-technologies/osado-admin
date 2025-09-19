"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CommonInput, { Country } from "@/components/ui/input";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your authentication logic here
    router.push("/dashboard");
  };
  const countries: Country[] = [
    {
      code: "+965",
      name: "",
      flag: (
        <Image
          src={"/images/countryFlag.svg"}
          alt="US Flag"
          width={24}
          height={24}
        />
      ),
    },
    {
      code: "+91",
      name: "",
      flag: (
        <Image
          src={"/images/countryFlag.svg"}
          alt="UK Flag"
          width={24}
          height={24}
        />
      ),
    },
    {
      code: "+96",
      name: "",
      flag: (
        <Image
          src={"/images/countryFlag.svg"}
          alt="UK Flag"
          width={24}
          height={24}
        />
      ),
    },
    {
      code: "+92",
      name: "",
      flag: (
        <Image
          src={"/images/countryFlag.svg"}
          alt="UK Flag"
          width={24}
          height={24}
        />
      ),
    },
  ];
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };
  const handleCountryChange = (country: (typeof countries)[0]) => {
    setSelectedCountry(country);
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
          <div className="space-y-2">
            <CommonInput
              label="Phone Number"
              type="tel"
              placeholder=""
              value={phoneNumber}
              onChange={handlePhoneChange}
              prefix="+965"
              maxLength={8}
              countries={countries}
              selectedCountry={selectedCountry}
              onCountryChange={handleCountryChange}
              showCountryDropdown={true}
            />
          </div>
          <div className="space-y-2">
            <CommonInput
              name="password"
              label="Password"
              placeholder="Write password"
              autoComplete="new-password"
              onChange={() => {}}
              type="password"
            />
            <div className="text-right pb-2">
              <Link
                href="/forgot-password"
                className="text-sm text-white-100 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full text-white-100 bg-red-600 rounded-xl py-6 hover:bg-red-700"
          >
            Continue
          </Button>
          <div className="flex items-center justify-center gap-2 text-sm text-white-100">
            {" "}
            Don&apos;t have an account?
            <Link
              href="/register"
              className="text-sm text-white-100 hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </form>
        <div className="mt-6 flex justify-center items-center gap-5">
          <Image
            src="/images/Google.png"
            className="cursor-pointer"
            alt="OSADO Logo"
            width={58}
            height={58}
            priority
          />
          <Image
            src="/images/Apple.png"
            alt="OSADO Logo"
            width={58}
            className="cursor-pointer"
            height={58}
            priority
          />
        </div>
      </CardContent>
    </Card>
  );
}
