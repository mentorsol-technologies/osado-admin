"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CommonInput from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your authentication logic here
    router.push("/dashboard");
  };

  return (
    <Card className="w-full bg-black-600 rounded-[18px] border-0 max-w-[450px]">
      <CardHeader>
        <CardTitle className="text-white-100 text-center font-bold text-[42px]">
          Log In
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <CommonInput
              icon={
                <Image
                  src={"/images/countryFlag.svg"}
                  alt="Country Flag"
                  width={38}
                  height={24}
                />
              }
              prefix="+965"
              name="phone"
              maxLength={8}
              type="text"
              label="Phone Number"
              autoComplete="off"
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
        </form>

        <div className="mt-6 flex justify-center items-center gap-5">
          <Image
            src="/images/Google.png"
            className="cursor-pointer"
            alt="OSADO Logo"
            width={60}
            height={60}
            priority
          />
          <Image
            src="/images/Apple.png"
            alt="OSADO Logo"
            width={60}
            className="cursor-pointer"
            height={60}
            priority
          />
        </div>
      </CardContent>
    </Card>
  );
}
