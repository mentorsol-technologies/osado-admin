"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CommonTable } from "@/components/ui/table/commonTable";
import { Eye, File } from "lucide-react";
import PayoutViewForm from "./PayoutViewDetails";

export default function PayoutPage() {
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<any>(null);

  const columns = [
    { key: "payout_id", label: "Payout ID" },
    { key: "recipient", label: "Recipient" },
    { key: "role", label: "Role" },
    { key: "amount", label: "Amount" },
    { key: "payment_method", label: "Payment method" },
    { key: "requested_date", label: "Requested date" },
    { key: "processed_date", label: "Processed date" },
    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <span
          className={`rounded px-2 py-1 text-xs ${
            row.status === "Confirmed"
              ? "text-green-400 border border-green-500/30"
              : row.status === "Canceled"
              ? "text-red-400 border border-red-500/30"
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
        if (row.status === "Confirmed") {
          return (
            <button className="px-3 py-1 text-xs rounded bg-gray-500 text-white cursor-not-allowed">
              Approved
            </button>
          );
        }
        if (row.status === "Pending") {
          return (
            <button className="px-3 py-1 text-xs rounded bg-red-600 text-white">
              Approved
            </button>
          );
        }
        return null; // No button for canceled
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

  const data = [
    {
      payout_id: "TXN1001",
      recipient: "John Doe",
      role: "Influencer",
      amount: "$250.00",
      payment_method: "Bank Transfer",
      requested_date: "2025-09-10",
      processed_date: "2025-09-11",
      status: "Confirmed",
    },
    {
      payout_id: "TXN1002",
      recipient: "Jane Smith",
      role: "Business Owner",
      amount: "$120.00",
      payment_method: "PayPal",
      requested_date: "2025-09-11",
      processed_date: "2025-09-13",
      status: "Pending",
    },
    {
      payout_id: "TXN1003",
      recipient: "Michael Brown",
      role: "Influencer",
      amount: "$500.00",
      payment_method: "Credit Card",
      requested_date: "2025-09-12",
      processed_date: "2025-09-13",
      status: "Canceled",
    },
  ];
   const filters = [
    {
      key: "sort_by",
      label: "Sort by",
      options: ["Newest", "Oldest", "A–Z", "Z–A"],
    },
    {
      key: "status",
      label: "Status",
      options: ["Confirmed", "Pending", "Cancelled"],
    },
    {
      key: "role",
      label: "Role",
      options: ["Influencer", "Business Owner"],
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
        <h2 className="lg:text-3xl text-xl  font-medium text-white">Payouts</h2>
        <Button leftIcon={<File size={18} />} className="w-full sm:w-auto">
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
    </div>
  );
}
