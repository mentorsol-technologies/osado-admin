"use client";

import React, { useState, useMemo, ReactNode } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import CommonInput from "../input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "./table";

export interface Column<T> {
  key: keyof T | string;
  label?: ReactNode;
  render?: (item: T) => ReactNode;
}

interface FilterConfig {
  key: string;
  label: string;
  options: string[];
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  rowsPerPage?: number;
  filters?: FilterConfig[];
  searchable?: boolean;
  title?: string;
  action?: React.ReactNode;
}

export function CommonTable<T extends { [key: string]: any }>({
  data,
  columns,
  rowsPerPage = 8,
  filters = [],
  searchable = true,
  title,
  action,
}: Props<T>) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string>
  >({});

  const handleFilterChange = (key: string, value: string) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      if (
        search &&
        !Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;

      for (const [key, value] of Object.entries(selectedFilters)) {
        if (!value) continue;

        if (key === "month") {
          const monthName = new Date(row.date).toLocaleString("default", {
            month: "long",
          });
          if (monthName !== value) return false;
        } else {
          if (row[key]?.toString() !== value) return false;
        }
      }

      return true;
    });
  }, [data, search, selectedFilters]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginated = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [page, filteredData, rowsPerPage]);

  return (
    <div className="w-[100vw] md:w-auto rounded-md bg-black-500 p-4 text-gray-100">
      {/* Title & Action */}
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}

      {/* Filters & Search */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <Select
              key={filter.key}
              value={selectedFilters[filter.key] || ""}
              onValueChange={(val) => handleFilterChange(filter.key, val)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        {searchable && (
          <CommonInput
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            icon={<Search />}
            className="border-black-200 md:w-64"
          />
        )}
      </div>

      {/* Table (old responsive rendering) */}
     <div className="w-full overflow-x-auto">
  <Table className="w-full border-collapse text-sm">
    <TableHeader>
      <TableRow className="text-left border-b border-black-500">
        {columns.map((col) => (
          <TableHead key={col.key as string} className="py-3 px-4 whitespace-nowrap">
            {col.label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
    <TableBody>
      {paginated.length > 0 ? (
        paginated.map((row, idx) => (
          <TableRow key={idx} className="border-b border-black-500">
            {columns.map((col) => (
              <TableCell key={col.key as string} className="py-3 px-4 whitespace-nowrap">
                {col.render ? col.render(row) : row[col.key]}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="py-6 text-center">
            No data found
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</div>


      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <div>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded bg-gray-800 p-2 disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        <div className="flex gap-1 overflow-x-auto">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`rounded px-3 py-1 whitespace-nowrap ${
                page === i + 1
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded bg-gray-800 p-2 disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}


