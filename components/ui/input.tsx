"use client";

import React, { ReactNode, useState } from "react";
import { Eye, ChevronDown, CalendarIcon } from "lucide-react";
import { Label } from "./label";
import Image from "next/image";
import { Country } from "@/components/ui/CountryPicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { format } from "date-fns";
import { Calendar } from "./calendar";

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
    | "week"
    | "calendar";

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
  minDate?: Date;
  maxDate?: Date;
};

const CommonInput = React.forwardRef<HTMLInputElement, CommonInputProps>(
  (props, ref) => {
    const {
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
      minDate,
      maxDate,
      ...rest
    } = props;

    const inputId =
      name || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;
    const [showPassword, setShowPassword] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

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
          className={`flex items-center min-h-[51px] w-full rounded-[14px] border border-black-300 bg-black-500 px-[14px] gap-2 
              focus-within:border-black-300 focus-within:ring-1 focus-within:ring-black-300 ${className}`}
        >
          {/* Country Dropdown (unchanged) */}
          {showCountryDropdown && countries && selectedCountry && (
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-1 text-white-100 text-sm font-medium"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                <Image
                  src={`https://flagcdn.com/w80/${selectedCountry.iso}.png`}
                  alt={selectedCountry.name}
                  width={30}
                  height={24}
                  className="object-cover"
                />
                <ChevronDown
                  size={18}
                  className={`text-white-100 flex-shrink-0 transition-transform ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
                <span className="text-white-100 font-normal">
                  {selectedCountry.code}
                </span>
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-black-600 border border-black-300 rounded-lg shadow-lg z-10 w-[220px] max-h-[280px] overflow-y-auto overflow-x-hidden">
                  <div className="p-2 sticky top-0 bg-black-600 z-20 border-b border-black-400">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-2 py-1 rounded bg-black-500 text-white-100 text-sm outline-none"
                    />
                  </div>
                  {countries
                    .filter((country) =>
                      country.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()),
                    )
                    .map((country, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          onCountryChange?.(country);
                          setIsDropdownOpen(false);
                          setSearchTerm("");
                        }}
                        className="flex items-center gap-2 px-3 py-2 w-full text-left text-white-100 hover:bg-black-400"
                      >
                        <Image
                          src={`https://flagcdn.com/w40/${country.iso}.png`}
                          alt={country.name}
                          width={20}
                          height={14}
                          className="rounded-sm object-cover"
                        />
                        <span className="truncate">{country.name}</span>
                        <span className="ml-auto text-gray-400">
                          {country.code}
                        </span>
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

          {/* If type = calendar → show custom calendar input */}
          {type === "calendar" ? (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-full text-left flex items-center justify-between  text-white-100 text-sm outline-none"
                >
                  {value
                    ? format(new Date(value), "dd MMM yyyy")
                    : placeholder || "Select date"}

                  <CalendarIcon size={18} className="opacity-70" />
                </button>
              </PopoverTrigger>

              <PopoverContent className="p-0 bg-black-500 border border-gray-700 rounded-md shadow-xl z-[999999]">
                <div className="bg-black-500 p-2 rounded-md">
                  <Calendar
                    mode="single"
                    selected={value ? new Date(value) : undefined}
                    disabled={[
                      ...(minDate ? [{ before: minDate }] : []),
                      ...(maxDate ? [{ after: maxDate }] : []),
                    ]}
                    onSelect={(date) => {
                      if (date) {
                        const formattedDate = format(date, "yyyy-MM-dd");
                        onChange?.({ target: { value: formattedDate } } as any);
                      }
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            // NORMAL INPUT
            <input
              ref={ref}
              id={inputId}
              name={name}
              type={actualType}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              readOnly={readonly}
              className={`w-full bg-black-500 outline-none text-sm text-white-100 font-normal placeholder:text-white
      hover:outline-none hover:ring-0 focus:outline-none focus:ring-0 
      ${showCountryDropdown && selectedCountry ? "ml-3 pl-2" : "ml-0"}`}
              maxLength={maxLength}
              autoComplete={autoComplete}
              {...rest}
            />
          )}

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
  },
);

CommonInput.displayName = "CommonInput";

export default CommonInput;
