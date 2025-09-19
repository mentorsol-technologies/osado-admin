"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CommonInput from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { passwordRules } from "@/lib/utils";
const ChangePassword = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rulesChecked, setRulesChecked] = useState(
    Array(passwordRules?.length).fill(false)
  );
  const toggleRule = (index: number, value: boolean) => {
    setRulesChecked((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };
  const handleSubmit = () => {
    if (password && password === confirmPassword) {
      router.push("/login");
    } else {
      alert("Passwords do not match");
    }
  };
  return (
    <Card className="w-full bg-transparent md:bg-black-600 rounded-[18px] border-0 max-w-[450px]">
      <CardHeader>
        <CardTitle className="text-white-100 font-bold text-[34px] md:text-[40px] lg:text-[46px] leading-[1.2]">
          Create New <br /> Password
        </CardTitle>
        <p className="text-white-100 text-[14px] md:text-[16px] font-normal">
          Enter and confirm your new password to secure your account.
        </p>
        <div className="hidden md:flex items-center gap-[5px] text-[14px] md:text-[16px] font-normal !-mt-0.5">
          <span className="text-white-100">+965 6592 8329</span>
          <span className="text-white-100">-</span>
          <button className="text-red-600 hover:underline">Edit</button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 md:mt-0 mt-4">
          <CommonInput
            name="password"
            label="New Password"
            placeholder="Write password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </div>
        <div className="space-y-2 mt-4">
          <CommonInput
            name="confirmPassword"
            label="Repeat Password"
            placeholder="Repeat new password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
          />
        </div>
        <div className="flex flex-col gap-2 mt-6">
          {passwordRules?.map((rule, index) => (
            <div key={index} className="flex items-center gap-2">
              <Checkbox
                checked={rulesChecked[index]}
                onCheckedChange={(value) => toggleRule(index, !!value)}
                id={`rule-${index}`}
              />
              <label
                htmlFor={`rule-${index}`}
                className="text-sm text-white-100 cursor-pointer"
              >
                {rule}
              </label>
            </div>
          ))}
        </div>
        <div className="pt-[100px]">
          <Button
            type="button"
            onClick={handleSubmit}
            className="w-full text-white-100 bg-red-600 rounded-xl py-6 hover:bg-red-700"
          >
            Reset Password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default ChangePassword;