"use client";

import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeRangePickerProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  mode?: "single" | "range";
  placeholder?: string;
}

export default function TimeRangePicker({
  label,
  value,
  onChange,
  error,
  mode = "range",
  placeholder = "Select Time",
}: TimeRangePickerProps) {
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [singleTime, setSingleTime] = useState<string>("");

  useEffect(() => {
    if (mode === "range") {
      if (value && value.includes("-")) {
        const [startVal, endVal] = value.split("-").map((t) => t.trim());
        setStart(startVal);
        setEnd(endVal);
      } else {
        setStart("");
        setEnd("");
      }
    } else {
      // Single mode
      setSingleTime(value || "");
    }
  }, [value, mode]);

  const handleTimeChange = (type: "start" | "end", newTime: string) => {
    const otherTime = type === "start" ? end : start;

    if (newTime === otherTime) {
      return;
    }

    if (type === "start") {
      setStart(newTime);
      if (end) onChange(`${newTime} - ${end}`);
    } else {
      setEnd(newTime);
      if (start) onChange(`${start} - ${newTime}`);
    }
  };

  const handleSingleTimeChange = (newTime: string) => {
    setSingleTime(newTime);
    onChange(newTime);
  };

  // Single time mode
  if (mode === "single") {
    return (
      <div>
        {label && (
          <label className="block text-white-100 text-[16px] font-medium">
            {label}
          </label>
        )}
        <TimePickerInput
          value={singleTime}
          onChange={handleSingleTimeChange}
          placeholder={placeholder}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  // Range mode
  return (
    <div>
      {label && (
        <label className="block text-white-100 text-[16px] font-medium">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <TimePickerInput
          value={start}
          onChange={(val) => handleTimeChange("start", val)}
          placeholder="Start Time"
          disabledTime={end}
        />
        <span className="text-gray-400">to</span>
        <TimePickerInput
          value={end}
          onChange={(val) => handleTimeChange("end", val)}
          placeholder="End Time"
          disabledTime={start}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

interface TimePickerInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabledTime?: string;
}

function TimePickerInput({
  value,
  onChange,
  placeholder,
  disabledTime,
}: TimePickerInputProps) {
  const [open, setOpen] = useState(false);

  const [selectedHour, setSelectedHour] = useState<string>("12");
  const [selectedMinute, setSelectedMinute] = useState<string>("00");
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">("AM");

  useEffect(() => {
    if (value) {
      const [timePart, periodPart] = value.split(" ");
      if (timePart && periodPart) {
        const [h, m] = timePart.split(":");
        setSelectedHour(h);
        setSelectedMinute(m);
        setSelectedPeriod(periodPart as "AM" | "PM");
      } else {
        if (value.includes(":")) {
          const [h, m] = value.split(":");
          let hourInt = parseInt(h);
          let period: "AM" | "PM" = "AM";
          if (hourInt >= 12) {
            period = "PM";
            if (hourInt > 12) hourInt -= 12;
          } else if (hourInt === 0) {
            hourInt = 12;
          }
          setSelectedHour(hourInt.toString().padStart(2, "0"));
          setSelectedMinute(m);
          setSelectedPeriod(period);
        }
      }
    }
  }, [value]);

  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const allMinutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const periods = ["AM", "PM"];

  const handleSelect = (h: string, m: string, p: string) => {
    const newVal = `${h}:${m} ${p}`;
    if (newVal === disabledTime) return;
    onChange(newVal);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center min-h-[51px] w-full rounded-[14px] border border-black-300 bg-black-500 px-[14px] gap-2",
            "text-white-100 text-sm font-normal focus:outline-none focus:ring-1 focus:ring-black-300",
            !value && "text-gray-400"
          )}
        >
          <span className="flex-1 text-left">{value || placeholder}</span>
          <Clock size={18} className="text-white-100 opacity-70" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 bg-black-500 border border-black-300 rounded-md shadow-xl w-[240px] z-[999999]"
        align="start"
      >
        <div className="flex h-[300px] text-white">
          {/* Hours Column */}
          <div className="flex-1 overflow-y-auto border-r border-black-400 scrollbar-hide">
            <div className="p-2 text-center text-xs font-semibold text-gray-400 sticky top-0 bg-black-500">
              Hour
            </div>
            <div className="flex flex-col p-1 gap-1">
              {hours.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => {
                    setSelectedHour(h);
                    handleSelect(h, selectedMinute, selectedPeriod);
                  }}
                  className={cn(
                    "p-2 rounded hover:bg-black-400 text-sm transition-colors",
                    selectedHour === h
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "text-white-100"
                  )}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Minutes Column */}
          <div className="flex-1 overflow-y-auto border-r border-black-400 scrollbar-hide">
            <div className="p-2 text-center text-xs font-semibold text-gray-400 sticky top-0 bg-black-500">
              Min
            </div>
            <div className="flex flex-col p-1 gap-1">
              {allMinutes.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setSelectedMinute(m);
                    handleSelect(selectedHour, m, selectedPeriod);
                  }}
                  disabled={
                    `${selectedHour}:${m} ${selectedPeriod}` === disabledTime
                  }
                  className={cn(
                    "p-2 rounded hover:bg-black-400 text-sm transition-colors",
                    selectedMinute === m
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "text-white-100",
                    `${selectedHour}:${m} ${selectedPeriod}` === disabledTime &&
                      "opacity-50 cursor-not-allowed hover:bg-transparent"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* AM/PM Column */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="p-2 text-center text-xs font-semibold text-gray-400 sticky top-0 bg-black-500">
              Am/Pm
            </div>
            <div className="flex flex-col p-1 gap-1">
              {periods.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setSelectedPeriod(p as "AM" | "PM");
                    handleSelect(selectedHour, selectedMinute, p);
                  }}
                  disabled={
                    `${selectedHour}:${selectedMinute} ${p}` === disabledTime
                  }
                  className={cn(
                    "p-2 rounded hover:bg-black-400 text-sm transition-colors",
                    selectedPeriod === p
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "text-white-100",
                    `${selectedHour}:${selectedMinute} ${p}` === disabledTime &&
                      "opacity-50 cursor-not-allowed hover:bg-transparent"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
