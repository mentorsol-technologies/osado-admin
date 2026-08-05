"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { CommonTable } from "@/components/ui/table/commonTable";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/ui/pagination";
import {
  useRefundRequestsQuery,
  useRefundRequestStatsQuery,
} from "@/hooks/useRefundRequestMutations";
import { RefundRequestStatus } from "@/services/refunds/RefundRequestServices";
import { FormatDate } from "@/lib/utils";
import ReviewRefundRequestModal from "./ReviewRefundRequestModal";

const STATUS_CLASSES: Record<string, string> = {
  PENDING: "text-yellow-400 border border-yellow-500/30",
  APPROVED: "text-blue-400 border border-blue-500/30",
  COMPLETED: "text-green-400 border border-green-500/30",
  REJECTED: "text-gray-400 border border-gray-500/30",
  FAILED: "text-red-400 border border-red-500/30",
};

const REASON_LABELS: Record<string, string> = {
  SERVICE_NOT_PROVIDED: "Service Not Provided",
  PROVIDER_CANCELLED: "Provider Cancelled",
  CUSTOMER_REQUEST: "Customer Request",
  OTHER: "Other",
};

const TABS: { label: string; value?: RefundRequestStatus }[] = [
  { label: "All", value: undefined },
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Declined", value: "REJECTED" },
  { label: "Failed", value: "FAILED" },
];

export default function RefundRequestsPage() {
  // Defaults to Pending: this screen is a review queue, so the things awaiting
  // a decision are what an admin comes here for.
  const [status, setStatus] = useState<RefundRequestStatus | undefined>("PENDING");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const limit = 10;

  const { data, isLoading } = useRefundRequestsQuery(page, limit, status);
  const { data: stats } = useRefundRequestStatsQuery();

  const rows = (data as any)?.data ?? [];
  const total = (data as any)?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const pendingCount = stats?.PENDING ?? 0;

  const columns = [
    {
      key: "createdAt",
      label: "Submitted",
      render: (row: any) => FormatDate(row.createdAt),
    },
    {
      key: "customerName",
      label: "Customer",
      render: (row: any) => row.customerName || "------",
    },
    {
      // Who asked matters: a provider-raised request warrants different
      // scrutiny from a customer-raised one.
      key: "requesterName",
      label: "Requested By",
      render: (row: any) => (
        <div className="flex flex-col">
          <span>{row.requesterName || "------"}</span>
          {/* <span className="text-xs text-gray-500">
            {row.requestedByCustomer ? "customer" : "service provider"}
          </span> */}
        </div>
      ),
    },
    {
      key: "reason",
      label: "Reason",
      render: (row: any) => REASON_LABELS[row.reason] ?? row.reason ?? "------",
    },
    {
      key: "refundedAmount",
      label: "Refunded",
      render: (row: any) =>
        row.refundedAmount != null ? row.refundedAmount : "------",
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
      key: "actions",
      label: "Actions",
      render: (row: any) => (
        <div className="flex justify-center gap-3">
          <button
            className="p-1 border border-gray-600 rounded-md hover:bg-gray-700"
            onClick={() => {
              setSelectedId(row.id);
              setReviewOpen(true);
            }}
          >
            <Eye size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 bg-black-500 min-h-[calc(100vh-120px)] rounded-lg flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h2 className="lg:text-3xl text-xl font-medium text-white">
          Refund Requests
        </h2>
        {pendingCount > 0 && (
          <Badge className="w-fit">{pendingCount} awaiting review</Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
            }}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              status === tab.value
                ? "bg-purple-600 text-white"
                : "bg-black-600 text-gray-300 hover:bg-black-400"
            }`}
          >
            {tab.label}
            {tab.value === "PENDING" && pendingCount > 0 && ` (${pendingCount})`}
          </button>
        ))}
      </div>

      <div className="w-full flex-1">
        {isLoading ? (
          <p className="text-white">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-gray-400">
            No refund requests {status ? `with status ${status}` : ""}.
          </p>
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

      <ReviewRefundRequestModal
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        requestId={selectedId}
      />
    </div>
  );
}
