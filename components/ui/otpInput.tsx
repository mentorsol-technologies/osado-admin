import * as React from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./input-otp";

interface OneTimePasswordProps {
    className?: string;
    length?: number;
    onChange?: (value: string) => void;
}

const OneTimePassword: React.FC<OneTimePasswordProps> = ({
    className = "",
    length = 6,
    onChange,
}) => {
    const [otp, setOtp] = React.useState("");

    const handleChange = (value: string) => {
        setOtp(value);
        onChange?.(value);
    };

    return (
        <InputOTP maxLength={length} value={otp} onChange={handleChange} className={className}>
            <InputOTPGroup className="flex gap-2">
                {Array.from({ length }).map((_, index) => (
                    <InputOTPSlot
                        key={index}
                        index={index}
                        className="otp-style h-[60px] w-[57px] border text-white-100 
              placeholder:text-white-100 border-black-400 bg-black-500 
              rounded-[14px] px-3 py-2 text-center focus:outline-none"
                    />
                ))}
            </InputOTPGroup>
        </InputOTP>
    );
};

export default OneTimePassword;
