"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CommonTable } from "@/components/ui/table/commonTable";
import { Eye, File } from "lucide-react";
import TransactionViewForm from "./TransactionViewDetails";
import { exportToCsv } from "@/lib/utils";
import { useGetWalletTransactionsQuery } from "@/hooks/useWalletTransactionsQuery";

const ROLE_LABELS: Record<string, string> = {
  service_provider: "Service Provider",
  admin: "Admin",
  subAdmin: "Sub Admin",
  influencer: "Influencer",
  business_owner: "Business Owner",
  user: "User",
};

export default function TransactionPage() {
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: response } = useGetWalletTransactionsQuery(page, limit);
  const transactions = (response as any)?.data ?? [];
  const total = (response as any)?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const columns = [
    { key: "transaction_id", label: "Transaction ID" },
    { key: "user_name", label: "User Name" },
    { key: "role", label: "Role" },
    { key: "type", label: "Type" },
    { key: "booking_reference", label: "Event / Booking reference" },
    { key: "time", label: "Time" },
    { key: "date", label: "Date" },
    { key: "amount", label: "Amount" },

    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <span
          className={`rounded px-2 py-1 text-xs ${
            row.status === "Successful"
              ? "text-green-400 border border-green-500/30"
              : row.status === "Rejected"
                ? "text-red-400 border border-red-500/30"
                : "text-blue-400 border border-blue-500/30"
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
            className="p-1 border border-black-600"
            onClick={() => {
              setSelectedTransaction(row);
              setOpenViewModal(true);
            }}
          >
            <Eye size={16} />
          </button>
        </div>
      ),
    },
  ];

  const data =
    transactions?.map((transaction: any) => {
      const createdAt = new Date(transaction.createdAt);
      return {
        transaction_id: transaction.id,
        user_name: transaction.userName || "--",
        role: ROLE_LABELS[transaction.role] || transaction.role || "--",
        type: transaction.type === "EARNING" ? "Credit" : "Debit",
        booking_reference: transaction.description || "--",
        time: createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        date: createdAt.toLocaleDateString(),
        amount: `${Number(transaction.amount).toFixed(3)} KWD`,
        status:
          transaction.status === "SUCCESSFUL"
            ? "Successful"
            : transaction.status === "REJECTED"
              ? "Rejected"
              : "Pending",
        rejectionReason: transaction.rejectionReason || "--",
      };
    }) || [];

  const filters = [
    {
      key: "sort_by",
      label: "Sort by",
      options: ["Newest", "Oldest", "A–Z", "Z–A"],
    },
    {
      key: "status",
      label: "Status",
      options: ["Successful", "Pending", "Rejected"],
    },
    {
      key: "type",
      label: "Type",
      options: ["Credit", "Debit"],
    },
  ];

  return (
    <div className="p-4 bg-black-500 !min-h-[calc(100vh-120px)] rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h2 className="lg:text-3xl text-xl  font-medium text-white">
          Transactions
        </h2>
        <Button
          leftIcon={<File size={18} />}
          className="w-full sm:w-auto"
          onClick={() => exportToCsv("transactions.csv", data)}
        >
          Generate CSV Report
        </Button>
      </div>

      {/* Make it responsive */}
      <div className="w-full">
        <CommonTable
          mobileView="card"
          data={data}
          columns={columns}
          rowsPerPage={limit}
          filters={filters}
          searchable
          currentPage={page}
          onPageChange={setPage}
          totalPages={totalPages}
        />
      </div>
      <TransactionViewForm
        open={openViewModal}
        onOpenChange={setOpenViewModal}
        transaction={selectedTransaction}
      />
    </div>
  );
}
