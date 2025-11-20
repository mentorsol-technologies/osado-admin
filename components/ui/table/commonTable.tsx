"use client";

import React, { useState, useMemo, ReactNode } from "react";
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

    // 🎛 Apply filters
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (!value) return;

      const filterConfig = filters.find((f) => f.key === key);
      const mappedKey = filterConfig?.mapTo || key;

      // If filter is for sorting
      if (filterConfig?.sortBy) {
        if (filterConfig.customSort) {
          result.sort((a, b) => filterConfig.customSort!(a, b, value));
        } else {
          result.sort((a, b) => {
            switch (value) {
              case "Newest":
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              case "Oldest":
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              case "A–Z":
                return a.name.localeCompare(b.name);
              case "Z–A":
                return b.name.localeCompare(a.name);
              default:
                return 0;
            }
          });
        }
        return; // skip further filtering
      }

      // Otherwise, apply value filter
      result = result.filter(
        (row) =>
          String(row[mappedKey] ?? "")
            .toLowerCase()
            .includes(value.toLowerCase())
      );
    });

    return result;
  }, [data, search, selectedFilters, filters]);


  const totalPages = Math.ceil(filteredData?.length / rowsPerPage);

  const paginated = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData?.slice(start, start + rowsPerPage);
  }, [page, filteredData, rowsPerPage]);

  return (
    <div className="w-[100vw] md:w-auto rounded-md bg-black-500 p-2 text-white">
      {/* Title & Action */}
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="text-2xl font-semibold">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}

      {/* FiltersBar */}
      {(filters?.length > 0 || searchable) && (
        <FiltersBar
          filters={filters}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          searchable={searchable}
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
        />
      )}

      {/* Mobile Card Layout */}
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
                  {renderCardActions ? (
                    renderCardActions(row)
                  ) : (
                    <>
                      {/* <Button
                        className="flex-1"
                        onClick={() => onEditClick?.(row)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => onSuspendClick?.(row)}
                      >
                        Suspend
                      </Button> */}
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-400">No data found</div>
          )}
        </div>
      )}

      {/* Desktop Table Layout */}
      <div
        className={`${mobileView === "card" ? "hidden sm:block" : "block"} relative h-[610px]`}
      >
        {/* Scrollable table body */}
        <div className="overflow-y-auto h-full">
          <Table className="w-full border-collapse text-sm">
            <TableHeader>
              <TableRow className="text-left border-b border-black-500">
                {columns.map((col) => {
                  if (col.key === "actions")
                    return (
                      <TableHead
                        key={col.key as string}
                        className="py-3 px-4 whitespace-nowrap"
                      />
                    );
                  return (
                    <TableHead
                      key={col.key as string}
                      className="py-3 px-4 font-normal whitespace-nowrap"
                    >
                      {col.label}
                    </TableHead>
                  );
                })}
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

        {/* Fixed Pagination */}
        <div className="absolute bottom-[-30px] left-0 w-full bg-black-500 py-3 border-t border-black-400">
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
