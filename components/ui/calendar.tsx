"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 relative z-[999999]", className)}
      classNames={{
        months:
          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 text-white",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center text-white",
        caption_label: "text-sm font-medium text-white",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent border-none p-0 text-white hover:text-red-500 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-white rounded-md w-9 font-normal text-[0.9rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal text-white hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white"
        ),
        day_selected:
          "bg-red-600 text-white hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white rounded-md ring-0 shadow-none",
        day_today: "border border-red-600 text-white font-semibold rounded-md",
        day_outside: "text-gray-400 opacity-40",
        day_disabled: "text-gray-500 opacity-40",
        day_range_middle: "bg-red-500 text-white",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <ChevronLeft className="h-4 w-4 text-white" />
        ),
        IconRight: ({ ...props }) => (
          <ChevronRight className="h-4 w-4 text-white" />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
