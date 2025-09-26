"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CommonTable } from "@/components/ui/table/commonTable";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { MdOutlineEdit } from "react-icons/md";
import { BiStop } from "react-icons/bi";
import BookingViewForm from "./BookingViewForm";
import RefundBookingModal from "./RefundBookingForm";
import SuspendedBookingModal from "./SuspendedBookingForm";
import EditBookingModal from "./EditBookingForm";
import AddBookingModal from "./AddNewBookingForm";

export default function ServiceBookingPage() {
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [refundOpen, setRefundOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [AddOpen, setAddOpen] = useState(false);

  const columns = [
    { key: "booking_id", label: "Booking ID" },
    { key: "service_name", label: "Service Name" },
    { key: "provider", label: "Provider" },
    { key: "customer", label: "Customer" },
    { key: "date_time", label: "Date & Time" },
    { key: "amount", label: "Amount" },

    {
      key: "category",
      label: "Category",
      render: (row: any) => (
        <span className="rounded bg-gray-700/40 px-2 py-1 text-xs">
          {row.category}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <span
          className={`rounded px-2 py-1 text-xs ${
            row.status === "Confirmed"
              ? " text-green-400 border border-green-500/30"
              : row.status === "Canceled"
              ? " text-red-400 border border-red-500/30"
              : " text-blue-400 border border-blue-500/30"
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
              setSelectedBooking(row);
              setOpenViewModal(true);
            }}
          >
            <Eye size={16} />
          </button>
          <button
            className="p-1 border border-black-600"
            onClick={() => {
              setSelectedBooking(row);
              setEditOpen(true);
            }}
          >
            <MdOutlineEdit size={16} />
          </button>
          <button className="p-1 rounded-md  bg-red-600">
             <BiStop size={16} />
          </button>
        </div>
      ),
    },
  ];

  const data = [
    {
      booking_id: "EV123",
      service_name: "Launch Party",
      provider: "Photographer",
      customer: "Keith White",
      date_time: "2025/09/15 18:00",
      amount: "KWD 1200",
      category: "Music",
      status: "Confirmed",
    },
    {
      booking_id: "EV456",
      service_name: "Tech Demo",
      provider: "Photographer",
      customer: "Keith White",
      date_time: "2025/09/20 14:00",
      amount: "KWD 1200",
      category: "Tech",
      status: "Pending",
    },
    {
      booking_id: "EV451",
      service_name: "Tech Demo",
      provider: "Photographer",
      customer: "Keith White",
      date_time: "2025/09/20 14:00",
      amount: "KWD 1200",
      category: "Technology",
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
      options: ["Confirmed", "Pending", "Canceled"],
    },

    {
      key: "provider",
      label: "Provider",
      options: ["John Doe", "Jane Smith", "Waheed"],
    },
    {
      key: "date",
      label: "Date",
      options: ["2025-09-15", "2025-09-20"],
    },
  ];
  const handleRefundSubmit = (data: any) => {
    console.log("Refund Data:", data);

    // Close refund modal and open suspended modal
    setRefundOpen(false);
    setSuspendOpen(true);
  };
  const handleEditSave = (data: any) => {
    console.log("Edited Booking Data:", data);
    setEditOpen(false);
  };

  // 👇 handler when suspended booking is submitted
  const handleSuspendSubmit = (data: any) => {
    console.log("Suspended Booking Reason:", data);
  };

  return (
    <div className="p-4 bg-black-500 !min-h-[calc(100vh-120px)] rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h2 className="lg:text-3xl text-xl  font-medium text-white">
          Service Booking
        </h2>
        <Button
          leftIcon={<Plus size={18} />}
          className="w-full sm:w-auto"
          onClick={() => setAddOpen(true)}
        >
          Add New Booking
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
              <Button className="flex-1" onClick={() => { setSelectedBooking(row); setEditOpen(true); }}>
                Edit
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setSelectedBooking(row); setSuspendOpen(true); }}
              >
                Suspend
              </Button>
            </div>
          )}
        />

      </div>
      {/* Modal for viewing booking */}
      <BookingViewForm
        open={openViewModal}
        onOpenChange={setOpenViewModal}
        booking={selectedBooking}
        onRefundClick={() => setRefundOpen(true)}
      />
      <RefundBookingModal
        open={refundOpen}
        setOpen={setRefundOpen}
        selectedRefund={{
          amount: selectedBooking?.amount ?? "",
          reason: selectedBooking?.reason ?? "Service Not Provided",
          comment: "",
        }}
        onSave={handleRefundSubmit}
        onCancelClick={() => setRefundOpen(false)}
      />

      {/* Suspended modal */}
      <SuspendedBookingModal
        open={suspendOpen}
        setOpen={setSuspendOpen}
        onSave={handleSuspendSubmit}
      />
      {/* Add new Booking Modal */}
      <AddBookingModal
        open={AddOpen}
        setOpen={setAddOpen}
        selectedBooking={{
          bookingId: "",
          serviceName: "",
          amount: "",
          status: "Confirmed",
        }}
        onSave={(data: any) => {
          console.log("New Booking Data:", data);
          setAddOpen(false); // close modal after save
        }}
      />
      {/* Edit Modal */}
      <EditBookingModal
        open={editOpen}
        setOpen={setEditOpen}
        selectedBooking={{
          bookingId: selectedBooking?.booking_id ?? "",
          serviceName: selectedBooking?.service_name ?? "",
          amount: selectedBooking?.amount ?? "",
          status: selectedBooking?.status ?? "Confirmed",
        }}
        onSave={handleEditSave}
      />
    </div>
  );
}
