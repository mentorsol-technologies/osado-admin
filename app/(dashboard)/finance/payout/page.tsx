"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CommonTable } from "@/components/ui/table/commonTable";
import { Eye, File } from "lucide-react";
import PayoutViewForm from "./PayoutViewDetails";
import MarkPaidModal from "./MarkPaidModal";
import { exportToCsv } from "@/lib/utils";
import { useGetWithdrawalRequestsQuery } from "@/hooks/useWithdrawalRequestMutations";

export default function PayoutPage() {
  const [openViewModal, setOpenViewModal] = useState(false);
  const [markPaidOpen, setMarkPaidOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<any>(null);

  const { data: requests } = useGetWithdrawalRequestsQuery();

  const columns = [
    { key: "id", label: "Payout ID" },
    { key: "providerName", label: "Recipient" },
    { key: "amountDisplay", label: "Amount" },
    { key: "requestedDate", label: "Requested date" },
    { key: "paidDate", label: "Paid date" },
    { key: "transactionId", label: "Transaction ID" },
    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <span
          className={`rounded px-2 py-1 text-xs ${
            row.status === "PAID"
              ? "text-green-400 border border-green-500/30"
              : "text-blue-400 border border-blue-500/30"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "approval",
      label: "Approval",
      render: (row: any) => {
        if (row.status === "PAID") {
          return (
            <button className="px-3 py-1 text-xs rounded bg-gray-500 text-white cursor-not-allowed">
              Paid
            </button>
          );
        }
        return (
          <button
            className="px-3 py-1 text-xs rounded bg-purple-600 text-white"
            onClick={() => {
              setSelectedPayout(row);
              setMarkPaidOpen(true);
            }}
          >
            Mark as Paid
          </button>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: any) => (
        <div className="flex justify-center gap-3">
          <button
            className="p-1 border border-black-600"
            onClick={() => {
              setSelectedPayout(row);
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
    requests?.map((request: any) => ({
      id: request.id,
      providerName: request.providerName || "--",
      providerEmail: request.providerEmail || "--",
      amountDisplay: `${Number(request.amount).toFixed(3)} KWD`,
      requestedDate: new Date(request.createdAt).toLocaleDateString(),
      paidDate: request.paidAt ? new Date(request.paidAt).toLocaleDateString() : "--",
      transactionId: request.transactionId || "--",
      status: request.status,
    })) || [];

  const filters = [
    {
      key: "sort_by",
      label: "Sort by",
      options: ["Newest", "Oldest"],
    },
    {
      key: "status",
      label: "Status",
      options: ["PENDING", "PAID"],
    },
  ];

  return (
    <div className="p-4 bg-black-500 !min-h-[calc(100vh-120px)] rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h2 className="lg:text-3xl text-xl  font-medium text-white">Payouts</h2>
        <Button
          leftIcon={<File size={18} />}
          className="w-full sm:w-auto"
          onClick={() => exportToCsv("payouts.csv", data)}
        >
          Generate CSV Report
        </Button>
      </div>

      <div className="w-full">
        <CommonTable
          mobileView="card"
          data={data}
          columns={columns}
          rowsPerPage={5}
          searchable
          filters={filters}
        />
      </div>

      <PayoutViewForm
        open={openViewModal}
        onOpenChange={setOpenViewModal}
        payout={selectedPayout}
      />

      <MarkPaidModal
        open={markPaidOpen}
        onOpenChange={setMarkPaidOpen}
        withdrawalRequestId={selectedPayout?.id}
      />
    </div>
  );
}
