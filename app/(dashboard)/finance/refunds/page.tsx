"use client";

import { useState } from "react";
import { CommonTable } from "@/components/ui/table/commonTable";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/ui/pagination";
import { useRefundsQuery } from "@/hooks/useRefundMutations";
import { FormatDate } from "@/lib/utils";

const STATUS_CLASSES: Record<string, string> = {
  COMPLETED: "text-green-400 border border-green-500/30",
  PROCESSING: "text-blue-400 border border-blue-500/30",
  PENDING: "text-yellow-400 border border-yellow-500/30",
  FAILED: "text-red-400 border border-red-500/30",
};

const REASON_LABELS: Record<string, string> = {
  SERVICE_NOT_PROVIDED: "Service Not Provided",
  PROVIDER_CANCELLED: "Provider Cancelled",
  CUSTOMER_REQUEST: "Customer Request",
  OTHER: "Other",
};

export default function RefundsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useRefundsQuery(page, limit);

  const rows = (data as any)?.data ?? [];
  const total = (data as any)?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const columns = [
    {
      key: "createdAt",
      label: "Date",
      render: (row: any) => FormatDate(row.createdAt),
    },
    {
      key: "amount",
      label: "Refunded",
      render: (row: any) => `${row.amount} ${row.currency ?? ""}`.trim(),
    },
    {
      // Shows where the money came from - without this the admin can't tell a
      // full refund from one where the platform kept its commission.
      key: "split",
      label: "Provider / Platform",
      render: (row: any) => (
        <span className="text-xs text-gray-400">
          {row.providerClawback ?? 0} / {row.commissionRefunded ?? 0}
        </span>
      ),
    },
    {
      key: "reason",
      label: "Reason",
      render: (row: any) => REASON_LABELS[row.reason] ?? row.reason ?? "------",
    },
    {
      key: "initiatedByName",
      label: "Issued By",
      render: (row: any) => row.initiatedByName || "------",
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <span
          className={`rounded px-2 py-1 text-xs ${
            STATUS_CLASSES[row.status] ?? "text-gray-400 border border-gray-500/30"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "failureReason",
      label: "Note",
      render: (row: any) => (
        <span className="text-xs text-gray-400">
          {row.failureReason || row.comment || "------"}
        </span>
      ),
    },
  ];

  return (
    <div className="p-4 bg-black-500 min-h-[calc(100vh-120px)] rounded-lg flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h2 className="lg:text-3xl text-xl font-medium text-white">Refunds</h2>
        {total > 0 && (
          <Badge variant="secondary" className="w-fit">
            {total} total
          </Badge>
        )}
      </div>

      <div className="w-full flex-1">
        {isLoading ? (
          <p className="text-white">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-gray-400">No refunds have been issued yet.</p>
        ) : (
          <CommonTable
            mobileView="card"
            data={rows}
            columns={columns}
            rowsPerPage={limit}
          />
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-auto pt-8">
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
