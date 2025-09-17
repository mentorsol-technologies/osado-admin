"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

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
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("flex items-center justify-center gap-2", className)}
    >
      {/* Previous */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "rounded-md"
        )}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          aria-current={currentPage === page ? "page" : undefined}
          className={cn(
            buttonVariants({
              variant: currentPage === page ? "default" : "ghost",
              size: "icon",
            }),
            currentPage === page
              ? "bg-red-600 text-white hover:bg-red-700"
              : "hover:bg-gray-800"
          )}
        >
          {page}
        </button>
      ))}

      {/* Ellipsis (optional if many pages) */}
      {totalPages > 5 && currentPage < totalPages - 2 && (
        <span className="flex h-9 w-9 items-center justify-center">
          <MoreHorizontal className="h-4 w-4" />
        </span>
      )}

      {/* Next */}
      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "rounded-md"
        )}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
};

export default Pagination;
