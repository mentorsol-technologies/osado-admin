"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CommonTable } from "@/components/ui/table/commonTable";
import { Plus, Eye, Edit, Trash2,File } from "lucide-react";
import TransactionViewForm from "./TransactionViewDetails";


export default function TransactionPage() {
   const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

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

  const data = [
    {
      transaction_id: "TXN1001",
      user_name: "John Doe",
      role: "Influencer",
      type: "Credit",
      booking_reference: "Wedding Package",
      time: "10:30 AM",
      date: "2025-09-10",
      amount: "$250.00",
      status: "Confirmed",
    },
    {
      transaction_id: "TXN1002",
      user_name: "Jane Smith",
      role: "Business Owner",
      type: "Debit",
      booking_reference: "Wedding Package",
      time: "02:45 PM",
      date: "2025-09-11",
      amount: "$120.00",
      status: "Pending",
    },
    {
      transaction_id: "TXN1003",
      user_name: "Michael Brown",
      role: "Influencer",
      type: "Credit",
      booking_reference: "Wedding Package",
      time: "09:15 AM",
      date: "2025-09-12",
      amount: "$500.00",
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
        <h2 className="lg:text-3xl text-xl  font-medium text-white">
          Transactions
        </h2>
        <Button
          leftIcon={<File size={18} />}
          className="w-full sm:w-auto"
          //   onClick={() => setAddOpen(true)}
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
          rowsPerPage={5}
          filters={filters}
          searchable
        
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
