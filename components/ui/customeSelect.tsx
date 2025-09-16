"use client";

import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./select";



interface CustomSelectProps {
  placeholder?: string;
  defaultValue?: string;
  options: string[];
  onChange?: (value: string) => void;
   className?: string;
}

export function CustomSelect({
  placeholder = "Select option",
  defaultValue,
  options,
  onChange,
}: CustomSelectProps) {
  return (
    <Select defaultValue={defaultValue} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
