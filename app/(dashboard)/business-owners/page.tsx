"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CommonTable } from "@/components/ui/table/commonTable";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import SuspendedBusinessOwnerModal from "./SuspendedBussinessOwnerForm";
import AddBusinessOwnerModal from "./CreateBussinessOwnerForm";
import OwnerViewModal from "./BussinessOwnerViewForm";

export default function ServiceBookingPage() {
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [AddOpen, setAddOpen] = useState(false);

  // 👇 handler when suspended booking is submitted
  const handleSuspendSubmit = (data: any) => {
    console.log("Suspended Booking Reason:", data);
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "full_name", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "registration_date", label: "Registration Date" },
    {
      key: "kyc_status",
      label: "KYC Status",
      render: (row: any) => (
        <span
          className={`rounded px-2 py-1 text-xs ${
            row.kyc_status === "Approved"
              ? " text-green-400 border border-green-500/30"
              : row.kyc_status === "Rejected"
                ? " text-red-400 border border-red-500/30"
                : " text-blue-400 border border-blue-500/30"
          }`}
        >
          {row.kyc_status}
        </span>
      ),
    },
    { key: "active_events", label: "Active Events" },
    { key: "disputes", label: "Disputes" },

    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <span
          className={`rounded px-2 py-1 text-xs ${
            row.status === "Active"
              ? "text-green-400 border border-green-500/30"
              : "text-red-400 border border-red-500/30"
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
              setSelectedBusiness(row);
              setOpenViewModal(true);
            }}
          >
            <Eye size={16} />
          </button>

          <button className="p-1 rounded-md  bg-red-600">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const data = [
    {
      id: "U001",
      full_name: "John Doe",
      email: "john.doe@example.com",
      registration_date: "2025-09-10",
      kyc_status: "Approved",
      active_events: 1225,
      disputes: 0,
      status: "Active",
    },
    {
      id: "U002",
      full_name: "Jane Smith",
      email: "jane.smith@example.com",
      registration_date: "2025-08-25",
      kyc_status: "Pending",
      active_events: 2,
      disputes: 0,
      status: "Suspended",
    },
    {
      id: "U003",
      full_name: "Michael Brown",
      email: "michael.brown@example.com",
      registration_date: "2025-07-15",
      kyc_status: "Rejected",
      active_events: 0,
      disputes: 2,
      status: "Active",
    },
  ];

  const filters = [
    {
      key: "sort_by",
      label: "Sort by",
      options: ["Newest", "Oldest", "A–Z", "Z–A"],
    },
    {
      key: "kyc_status",
      label: "KYC Status",
      options: ["Verified", "Pending", "Rejected"],
    },
    {
      key: "status",
      label: "Status",
      options: ["Confirmed", "Pending", "Canceled"],
    },
    {
      key: "total_events",
      label: "Total Events",
      options: ["0–10", "11–50", "51–100", "100+"],
    },
  ];

  return (
    <div className="p-4 bg-black-500 !min-h-[calc(100vh-120px)] rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Business owners
        </h2>
        <Button
          leftIcon={<Plus size={18} />}
          className="w-full sm:w-auto"
          onClick={() => setAddOpen(true)}
        >
          Add Business owner
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
          renderCardActions={(row) => (
            <div className="flex gap-2 w-full">
              <Button
                className="flex-1"
                onClick={() => {
                  setSelectedBusiness(row);
                  setSuspendOpen(true);
                }}
              >
                Suspend
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSelectedBusiness(row);
                  setOpenViewModal(true);
                }}
              >
                View more
              </Button>
            </div>
          )}
        />
      </div>
      {/* Modal for viewing bussiness owner */}
      <OwnerViewModal
        open={openViewModal}
        onOpenChange={setOpenViewModal}
        owner={selectedBusiness}
        onApprove={() => console.log("approve", selectedBusiness)}
        onReject={() => console.log("reject", selectedBusiness)}
        onSuspend={() => console.log("suspend", selectedBusiness)}
      />

      {/* Suspended modal */}
      <SuspendedBusinessOwnerModal
        open={suspendOpen}
        setOpen={setSuspendOpen}
        onSave={handleSuspendSubmit}
      />
      {/* Add new Booking Modal */}
      <AddBusinessOwnerModal
        open={AddOpen}
        setOpen={setAddOpen}
        onSave={(data: any) => {
          console.log("New Bussiness Owner Data:", data);
          setAddOpen(false); // close modal after save
        }}
      />
    </div>
  );
}
