"use client";

import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CommonInput from "../input";

interface Filter {
  key: string;
  label: string;
  options: string[];
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
  return (
    <div
      className={`mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between ${className}`}
    >
      {/* Search (mobile: on top, desktop: right side) */}
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

      {/* Filters */}
      <div className="grid grid-cols-2 gap-3 md:order-1 md:flex md:flex-wrap">
        {filters.map((filter) => (
          <Select
            key={filter.key}
            value={selectedFilters[filter.key] || ""}
            onValueChange={(val) => onFilterChange(filter.key, val)}
          >
            <SelectTrigger className="w-full md:w-[160px]">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((opt) => (
                <SelectItem className="w-[150px] py-1" key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>
    </div>
  );
};

export default FiltersBar;
