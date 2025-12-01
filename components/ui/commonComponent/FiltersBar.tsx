"use client";

import { useState } from "react";
import { Search, Calendar as CalendarIcon, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CommonInput from "../input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export interface Filter {
  key: string;
  label: string;
  options?: string[];
  type?: "select" | "date" | "time";   // ✅ ADDED "time"
}

interface FiltersBarProps {
  filters: Filter[];
  selectedFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  searchable?: boolean;
  search?: string;
  onSearchChange?: (value: string) => void;
  className?: string;
}

const FiltersBar = ({
  filters,
  selectedFilters,
  onFilterChange,
  searchable = false,
  search = "",
  onSearchChange,
  className = "",
}: FiltersBarProps) => {
  const [openCalendar, setOpenCalendar] = useState<string | null>(null);

  return (
    <div
      className={`mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between ${className}`}
    >
      {/* 🔍 Search Input */}
      {searchable && (
        <div className="md:order-2">
          <CommonInput
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            icon={<Search />}
            className="w-full border-black-200 md:w-64"
          />
        </div>
      )}

      {/* 🎛️ Filters */}
      <div className="grid grid-cols-2 gap-3 md:order-1 md:flex md:flex-wrap">

        {filters?.map((filter) => {
          
          /* 📅 DATE FILTER */
          if (filter.type === "date") {
            const selectedDate = selectedFilters[filter.key]
              ? new Date(selectedFilters[filter.key])
              : undefined;

            return (
              <Popover
                key={filter.key}
                open={openCalendar === filter.key}
                onOpenChange={(open) => setOpenCalendar(open ? filter.key : null)}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex gap-10 h-[51px] items-center justify-between rounded-[14px] border border-black-300 bg-black-500 px-4 text-sm text-gray-200"
                  >
                    {selectedDate
                      ? format(selectedDate, "dd MMM yyyy")
                      : filter.label}
                    <CalendarIcon className="h-4 w-4 opacity-70" />
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  align="start"
                  className="p-0 bg-black-400 border border-gray-700 rounded-lg"
                >
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        onFilterChange(filter.key, date.toISOString());
                        setOpenCalendar(null);
                      }
                    }}
                    showOutsideDays
                  />
                </PopoverContent>
              </Popover>
            );
          }

          /* ⏱️ SIMPLE TIME PICKER */
         /* ⏱️ SIMPLE TIME PICKER WITH CUSTOM PLACEHOLDER + AM/PM FORMAT */
if (filter.type === "time") {
  // Convert 24-hour input to AM/PM
  const formatToAMPM = (time: string) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    const suffix = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // convert 0 → 12
    return `${String(formattedHour).padStart(2, "0")}:${m} ${suffix}`;
  };

  const selectedTime = selectedFilters[filter.key]
    ? formatToAMPM(selectedFilters[filter.key])
    : null;

  return (
    <div key={filter.key} className="relative w-full md:w-[160px]">

      {/* Hidden input (actual time picker) */}
      <input
        type="time"
        ref={(el) => {
          (window as any)[`timeInput_${filter.key}`] = el;
        }}
        className="absolute inset-0 opacity-0 cursor-pointer"
        value={selectedFilters[filter.key] || ""}
        onChange={(e) => onFilterChange(filter.key, e.target.value)}
      />

      {/* Visible styled button */}
      <button
        type="button"
        onClick={() =>
          (window as any)[`timeInput_${filter.key}`]?.showPicker()
        }
        className="flex h-[51px] w-full items-center justify-between rounded-[14px] 
                   border border-black-300 bg-black-500 px-4 text-sm text-gray-200"
      >
        {/* Show formatted AM/PM time OR placeholder */}
        {selectedTime || filter.label}

        <Clock
          className="h-4 w-4 opacity-70 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            (window as any)[`timeInput_${filter.key}`]?.showPicker();
          }}
        />
      </button>
    </div>
  );
}




          /* 🔽 SELECT FILTER */
          return (
            <Select
              key={filter.key}
              value={selectedFilters[filter.key] || ""}
              onValueChange={(val) => onFilterChange(filter.key, val)}
            >
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                {filter?.options?.map((opt) => (
                  <SelectItem className="w-[150px] py-1" key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        })}
      </div>
    </div>
  );
};

export default FiltersBar;
