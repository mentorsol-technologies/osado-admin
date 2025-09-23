"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  className,
}) => {
  const renderPages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      // Show all if few pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Middle pages
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <section
      role="navigation"
      aria-label="pagination"
      className={cn("flex items-center justify-between gap-2", className)}
    >
      {/* Left: Previous + Pages */}

      {/* Previous */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 text-white transition hover:bg-gray-800 disabled:opacity-40 cursor-pointer"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {renderPages().map((page, i) =>
          page === "..." ? (
            <span
              key={i}
              className="flex h-9 w-9 items-center justify-center text-gray-500"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            <button
              key={i}
              onClick={() => onPageChange(Number(page))}
              aria-current={currentPage === page ? "page" : undefined}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition cursor-pointer",
                currentPage === page
                  ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
                  : "border-gray-700 text-gray-300 hover:bg-gray-800"
              )}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Right: Next */}
      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 text-white  transition hover:bg-gray-800 disabled:opacity-40"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </section>
  );
};

export default Pagination;
