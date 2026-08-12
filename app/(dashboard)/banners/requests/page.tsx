"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { CommonTable } from "@/components/ui/table/commonTable";
import { Badge } from "@/components/ui/badge";
import { useBannerRequestsQuery } from "@/hooks/useBannerRequestMutations";
import { FormatDate } from "@/lib/utils";
import ReviewBannerRequestModal from "./ReviewBannerRequestModal";

const STATUS_CLASSES: Record<string, string> = {
  pending: "text-yellow-400 border border-yellow-500/30",
  approved: "text-blue-400 border border-blue-500/30",
  active: "text-green-400 border border-green-500/30",
  rejected: "text-gray-400 border border-gray-500/30",
};

const TABS: { label: string; value?: string }[] = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Active", value: "active" },
  { label: "Rejected", value: "rejected" },
];

export default function BannerRequestsPage() {
  // Defaults to Pending: this screen is a review queue, so the things
  // awaiting a decision are what an admin comes here for.
  const [status, setStatus] = useState<string | undefined>("pending");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const limit = 10;

  const { data, isLoading } = useBannerRequestsQuery(page, limit, status);
  // Cheap lookup just for the badge count, not a separate stats endpoint.
  const { data: pendingData } = useBannerRequestsQuery(1, 1, "pending");

  const rows = (data as any)?.data ?? [];
  const total = (data as any)?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const pendingCount = (pendingData as any)?.total ?? 0;

  const columns = [
    {
      key: "ownerName",
      label: "Requested By",
      render: (row: any) => row.ownerName || "------",
    },
    {
      key: "bannerId",
      label: "Banner ID",
      render: (row: any) => row.bannerId || "------",
    },
    {
      key: "price",
      label: "Price",
      render: (row: any) => (row.price != null ? `KWD ${row.price}` : "------"),
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <span
          className={`rounded px-2 py-1 text-xs capitalize ${
            STATUS_CLASSES[row.status] ?? "text-gray-400 border border-gray-500/30"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Submitted",
      render: (row: any) => FormatDate(row.createdAt),
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
          Banner Requests
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
            {tab.value === "pending" && pendingCount > 0 && ` (${pendingCount})`}
          </button>
        ))}
      </div>

      <div className="w-full flex-1">
        {isLoading ? (
          <p className="text-white">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-gray-400">
            No banner requests {status ? `with status ${status}` : ""}.
          </p>
        ) : (
          <CommonTable
            mobileView="card"
            data={rows}
            columns={columns}
            rowsPerPage={limit}
            currentPage={page}
            onPageChange={setPage}
            totalPages={totalPages}
          />
        )}
      </div>

      <ReviewBannerRequestModal
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        requestId={selectedId}
      />
    </div>
  );
}
