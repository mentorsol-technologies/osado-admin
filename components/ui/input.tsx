"use client";

import { ReactNode, useState } from "react";
import { Eye } from "lucide-react";
import { Label } from "./label";
import Image from "next/image";

type CommonInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?:
    | "number"
    | "search"
    | "time"
    | "text"
    | "hidden"
    | "date"
    | "datetime-local"
    | "email"
    | "month"
    | "password"
    | "tel"
    | "url"
    | "week";
  name?: string;
  autoComplete?: string;
  className?: string;
  icon?: ReactNode;
  prefix?: string;
  readonly?: boolean;
  error?: boolean;
  errorMessage?: string;
  maxLength?: number;
  countries?: Country[];
  selectedCountry?: Country;
  onCountryChange?: (country: Country) => void;
  showCountryDropdown?: boolean;
};

const CommonInput: React.FC<CommonInputProps> = ({
  label,
  placeholder = "",
  value,
  onChange,
  type = "text",
  name,
  className = "",
  icon,
  prefix,
  readonly = false,
  error = false,
  errorMessage = "",
  autoComplete = "off",
  maxLength,
  countries,
  selectedCountry,
  onCountryChange,
  showCountryDropdown = false,
  ...rest
}) => {
  const inputId = name || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  const [showPassword, setShowPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isPasswordType = type === "password";
  const actualType = isPasswordType
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <Label
          htmlFor={inputId}
          className="!text-white-100 text-[16px] font-medium"
        >
          {label}
        </Label>
      )}
      <div
        className={`flex items-center min-h-[51px] w-full rounded-[14px] border border-black-300 bg-black-500 px-[14px] gap-2 ${className}`}
      >
         {/* Country Dropdown */}
        {showCountryDropdown && countries && selectedCountry && (
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 text-white-100 text-sm font-medium pr-2"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              {selectedCountry.flag}
              {selectedCountry.code}
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 bg-black-600 border border-black-300 rounded-lg shadow-lg z-10 w-[120px]">
                {countries.map((country, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onCountryChange?.(country);
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 w-full text-left text-white-100 hover:bg-black-400"
                  >
                    {country.flag}
                    {country.code}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {icon && !prefix && <span className="text-white-100">{icon}</span>}
        {icon && prefix && (
          <span className="flex items-center gap-2 text-white-100 text-sm font-medium pr-2">
            {icon}
            {prefix}
          </span>
        )}
        {/* {!icon && prefix && (
          <span className="text-[#484A4C] text-sm font-medium pr-2">
            {prefix}
          </span>
        )} */}

        <input
          id={inputId}
          name={name}
          type={actualType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readonly}
          className="w-full bg-black-500  outline-none text-sm text-white-800 font-normal placeholder:text-white-800 hover:outline-none hover:ring-0 focus:outline-none focus:ring-0"
          maxLength={maxLength}
          autoComplete={autoComplete}
          {...rest}
        />

        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-gray-500 focus:outline-none cursor-pointer"
          >
            {showPassword ? (
              <Eye size={22} color="white" />
            ) : (
              <Image
                src={"/images/streamline_invisible-2.png"}
                height={24}
                width={24}
                className="bg-transparent"
                alt="Icon"
              />
            )}
          </button>
        )}
      </div>
      {error && errorMessage && (
        <p className="text-red-500 text-[12px] transition-all">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default CommonInput;
