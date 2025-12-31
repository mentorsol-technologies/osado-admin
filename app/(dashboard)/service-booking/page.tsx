"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CommonTable, FilterConfig } from "@/components/ui/table/commonTable";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { MdOutlineEdit } from "react-icons/md";
import { BiStop } from "react-icons/bi";
import BookingViewForm from "./BookingViewForm";
import RefundBookingModal from "./RefundBookingForm";
import SuspendedBookingModal from "./SuspendedBookingForm";
import EditBookingModal from "./EditBookingForm";
import AddBookingModal from "./AddNewBookingForm";
import {
  useGetAllServiceBookingListQuery,
  useSuspendBookingMutation,
} from "@/hooks/useServiceBookingMutations";

export default function ServiceBookingPage() {
  const { data, isLoading } = useGetAllServiceBookingListQuery();
  const { mutate: suspendBooking } = useSuspendBookingMutation();

  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [refundOpen, setRefundOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [AddOpen, setAddOpen] = useState(false);

  const columns = [
    { key: "serviceName", label: "Service Name" },
    { key: "provider", label: "Provider" },
    {
      key: "name",
      label: "Name",
      render: (row: any) => row.customer?.name || "-",
    },
    { key: "bookingDate", label: "Booking Date" },
    { key: "bookingTime", label: "Booking Time" },

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
          <button
            className="p-1 rounded-md bg-red-600"
            onClick={() => {
              setSelectedBooking(row);
              setSuspendOpen(true);
            }}
          >
            <BiStop size={16} />
          </button>
        </div>
      ),
    },
  ];

  const filters: FilterConfig[] = [
    {
      key: "sort_by",
      label: "Sort by",
      sortBy: true,
      options: ["All", "Newest", "Oldest", "A–Z", "Z–A"],
    },
    {
      key: "status",
      label: "Status",
      mapTo: "status",
      options: ["All", "Accepted", "Pending", "Cancelled", "Suspended"],
    },

    {
      key: "provider",
      label: "Provider",
      options: [
        "All",
        "service_provider",
        "admin",
        "subAdmin",
        "business_owner",
        "user",
      ],
    },
    {
      key: "date",
      label: "Date",
      type: "date",
    },
  ];
  const handleRefundSubmit = (data: any) => {
    console.log("Refund Data:", data);

    setRefundOpen(false);
    setSuspendOpen(true);
  };
  const handleEditSave = (data: any) => {
    console.log("Edited Booking Data:", data);
    setEditOpen(false);
  };

  const handleSuspendSubmit = (data: any) => {
    suspendBooking(
      {
        id: selectedBooking?.id,
        reason: data.reason,
      },
      {
        onSuccess: () => {
          setSuspendOpen(false);
        },
      }
    );
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
          rowsPerPage={10}
          filters={filters}
          searchable
          renderCardActions={(row) => (
            <div className="flex gap-2 w-full">
              <Button
                className="flex-1"
                onClick={() => {
                  setSelectedBooking(row);
                  setEditOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSelectedBooking(row);
                  setSuspendOpen(true);
                }}
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
        bookingId={selectedBooking?.id}
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
          service: "",
          bookingDate: "",
          bookingTime: "",
          location: "",
          city: "",
          country: "",
          status: "Confirmed",
          providerId: "",
          userId: "",
        }}
        providerId={selectedBooking?.providerId}
        onSave={(data: any) => {
          console.log("New Booking Data:", data);
          setAddOpen(false);
        }}
      />
      {/* Edit Modal */}
      <EditBookingModal
        open={editOpen}
        setOpen={setEditOpen}
        selectedBookingId={selectedBooking?.id}
        onSave={(updated) => {
          console.log("Edited Booking Data:", updated);
          // REFRESH your list or re-fetch query here (e.g. react-query refetch)
          setEditOpen(false);
        }}
      />
    </div>
  );
}
