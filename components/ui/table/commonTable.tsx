"use client";

import React, { useState, useMemo, ReactNode, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "./table";
import FiltersBar from "../commonComponent/FiltersBar";
import { Button } from "../button";
import Pagination from "../pagination";

export interface Column<T> {
  key: keyof T | string;
  label?: ReactNode;
  render?: (item: T) => ReactNode;
}

export interface FilterConfig {
  key: string;
  label: string;
  options?: string[];
  type?: "date";
  sortBy?: boolean;
  mapTo?: string;
  customSort?: (a: any, b: any, value: string) => number;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  rowsPerPage?: number;
  filters?: FilterConfig[];
  searchable?: boolean;
  title?: string;
  action?: React.ReactNode;
  mobileView?: "scroll" | "card";
  onSuspendClick?: (row: T) => void;
  onEditClick?: (row: T) => void;
  renderCardActions?: (row: T) => ReactNode;
}

export function CommonTable<T extends { [key: string]: any }>({
  data,
  columns,
  rowsPerPage = 15,
  filters = [],
  searchable = true,
  title,
  action,
  mobileView = "scroll",
  onSuspendClick,
  onEditClick,
  renderCardActions,
}: Props<T>) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string>
  >({});

  // ------------------ Helper functions ------------------

  const getValue = (row: any, key: string) =>
    String(row?.[key] ?? "").toLowerCase();

  const sortByValue = (a: any, b: any, key: string, order: "asc" | "desc") => {
    const valA = a?.[key];
    const valB = b?.[key];

    if (valA == null || valB == null) return 0;

    // If date
    if (!isNaN(Date.parse(valA)) && !isNaN(Date.parse(valB))) {
      return order === "asc"
        ? new Date(valA).getTime() - new Date(valB).getTime()
        : new Date(valB).getTime() - new Date(valA).getTime();
    }

    // Treat as string
    return order === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  };

  const filterHandlers: Record<string, Function> = {
    category: (row: any, value: string) =>
      row.categories?.some(
        (cat: any) => cat.name.toLowerCase() === value.toLowerCase()
      ),
  };

  // ------------------ Filter & Sort ------------------

  const handleFilterChange = (key: string, value: string) => {
    setSelectedFilters((prev) => {
      if (value === "All" || !value) {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      }
      return { ...prev, [key]: value };
    });
    setPage(1);
  };

  const filteredData = useMemo(() => {
    let result = [...(data || [])];

    // 🔍 Search
    if (search) {
      result = result.filter((row) =>
        Object.values(row).some((val) =>
          val?.toString().toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // 🎛 Filters
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (!value) return;
      const filterConfig = filters.find((f) => f.key === key);
      const mappedKey = filterConfig?.mapTo || key;

      // Sorting
      if (filterConfig?.sortBy) {
        if (filterConfig.customSort) {
          result.sort((a, b) => filterConfig.customSort!(a, b, value));
        } else {
          result.sort((a, b) => {
            switch (value) {
              case "Newest":
                return sortByValue(a, b, mappedKey, "desc");
              case "Oldest":
                return sortByValue(a, b, mappedKey, "asc");
              case "A–Z":
                return sortByValue(a, b, mappedKey, "asc");
              case "Z–A":
                return sortByValue(a, b, mappedKey, "desc");
              default:
                return 0;
            }
          });
        }
        return;
      }

      // Filtering
      const handler = filterHandlers[key];
      result = result.filter((row) =>
        handler
          ? handler(row, value)
          : getValue(row, mappedKey).includes(value.toLowerCase())
      );
    });

    return result;
  }, [data, search, selectedFilters, filters]);

  const totalPages = Math.ceil(filteredData?.length / rowsPerPage);

  const paginated = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData?.slice(start, start + rowsPerPage);
  }, [page, filteredData, rowsPerPage]);

  // Reset page on filter/search change
  useEffect(() => {
    setPage(1);
  }, [search, selectedFilters]);

  // ------------------ Render ------------------

  return (
    <div className="w-[100vw] md:w-auto rounded-md bg-black-500 p-2 text-white">
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="text-2xl font-semibold">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}

      {(filters?.length > 0 || searchable) && (
        <FiltersBar
          filters={filters}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          searchable={searchable}
          search={search}
          onSearchChange={(val) => setSearch(val)}
        />
      )}

      {/* Mobile card layout */}
      {mobileView === "card" && (
        <div className="grid gap-4 sm:hidden">
          {paginated?.length > 0 ? (
            paginated.map((row, idx) => (
              <div
                key={idx}
                className="rounded-lg bg-black-300 p-4 shadow space-y-3"
              >
                {columns.map((col) => {
                  if (col.key === "actions") return null;
                  return (
                    <div
                      key={col.key as string}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-white">{col.label}</span>
                      <span className="text-white">
                        {col.render ? col.render(row) : row[col.key]}
                      </span>
                    </div>
                  );
                })}
                <div className="flex justify-between gap-3 w-full">
                  {renderCardActions ? renderCardActions(row) : null}
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-400">No data found</div>
          )}
        </div>
      )}

      {/* Desktop table layout */}
      <div
        className={`${mobileView === "card" ? "hidden sm:block" : "block"} relative h-[610px]`}
      >
        <div className="overflow-y-auto h-full">
          <Table className="w-full border-collapse text-sm">
            <TableHeader>
              <TableRow className="text-left border-b border-black-500">
                {columns.map((col) => (
                  <TableHead
                    key={col.key as string}
                    className={`py-3 px-4 ${col.key === "actions" ? "whitespace-nowrap" : "font-normal whitespace-nowrap"}`}
                  >
                    {col.key !== "actions" && col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated?.length > 0 ? (
                paginated.map((row, idx) => (
                  <TableRow key={idx} className="border-b border-black-300">
                    {columns.map((col) => (
                      <TableCell
                        key={col.key as string}
                        className="py-3 px-4 whitespace-nowrap"
                      >
                        {col.render ? col.render(row) : row[col.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns?.length}
                    className="py-6 text-center"
                  >
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div
          className={`absolute left-0 w-full bg-black-500 py-3 border-t border-black-400 ${mobileView === "card" ? "bottom-[-50px]" : "bottom-[-8px]"}`}
        >
          <Pagination
            totalPages={totalPages || 1}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
