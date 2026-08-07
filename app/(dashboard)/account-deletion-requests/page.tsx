"use client";
import { useState } from "react";
import { CommonTable } from "@/components/ui/table/commonTable";
import { Eye } from "lucide-react";
import AccountDeletionRequestDetailModal from "./AccountDeletionRequestDetailModal";
import { useAccountDeletionRequestsQuery } from "@/hooks/useAccountDeletionRequestsMutations";
import { capitalizeFirstLetter } from "@/lib/utils";

export default function AccountDeletionRequestsPage() {
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: response, isLoading, isError } = useAccountDeletionRequestsQuery(page, limit);
  const requests = (response as any)?.data ?? [];
  const total = (response as any)?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const columns = [
    {
      key: "user",
      label: "User",
      render: (row: any) => (
        <span>{row.user?.name || "—"} {row.user?.surName || ""}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (row: any) => (
        <span>{row.user?.phoneNumber || row.user?.email || "—"}</span>
      ),
    },
    {
      key: "reason",
      label: "Reason",
      render: (row: any) => (
        <span className="line-clamp-1 max-w-[220px] inline-block">
          {row.reason || "—"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Requested On",
      render: (row: any) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <span
          className={`rounded px-2 py-1 text-xs ${
            row.status === "approved"
              ? "text-green-400 border border-green-500/30"
              : row.status === "rejected"
                ? "text-purple-400 border border-purple-500/30"
                : row.status === "withdrawn"
                  ? "text-gray-400 border border-gray-500/30"
                  : "text-blue-400 border border-blue-500/30"
          }`}
        >
          {capitalizeFirstLetter(row.status)}
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
              setSelectedRequestId(row.id);
              setOpenViewModal(true);
            }}
          >
            <Eye size={16} />
          </button>
        </div>
      ),
    },
  ];

  const filters = [
    {
      key: "sort_by",
      label: "Sort by",
      options: ["All", "Newest", "Oldest"],
      sortBy: true,
    },
    {
      key: "request_status",
      mapTo: "status",
      label: "Status",
      options: ["All", "Pending", "Approved", "Rejected", "Withdrawn"],
    },
  ];

  return (
    <div className="p-4 bg-black-500 min-h-[calc(100vh-120px)] rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h2 className="lg:text-3xl text-xl font-medium text-white">
          Account Deletion Requests
        </h2>
      </div>

      <div className="w-full">
        <CommonTable
          mobileView="card"
          data={requests}
          columns={columns}
          rowsPerPage={limit}
          filters={filters}
          searchable
          currentPage={page}
          onPageChange={setPage}
          totalPages={totalPages}
        />
      </div>

      <AccountDeletionRequestDetailModal
        open={openViewModal}
        onOpenChange={setOpenViewModal}
        requestId={selectedRequestId || undefined}
      />
    </div>
  );
}
