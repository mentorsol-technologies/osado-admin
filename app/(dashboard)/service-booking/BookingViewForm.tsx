"use client";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import { useGetServiceBookingDetailsQuery } from "@/hooks/useServiceBookingMutations";
import clsx from "clsx";

interface BookingViewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId?: string;
  onRefundClick: () => void;
}

const BookingViewForm = ({
  open,
  onOpenChange,
  bookingId,
  onRefundClick,
}: BookingViewFormProps) => {
  const { data: bookingView, isLoading } = useGetServiceBookingDetailsQuery(
    bookingId || "",
  );

  const getStatusClasses = (status: string) =>
    clsx("px-3 py-1 rounded-md border text-sm font-medium w-fit", {
      "text-green-400 border border-green-500/30": status === "Confirmed",
      "text-blue-400 border border-blue-500/30": status === "Pending",
      "text-red-500 border border-red-500/30": status === "Canceled",
    });

  if (isLoading) return <p className="p-4 text-white">Loading...</p>;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Service Booking Details"
      footer={
        <div className="flex flex-col lg:flex-row w-full gap-2">
          <Button
            className="flex-1"
            onClick={() => {
              onOpenChange(false);
              onRefundClick();
            }}
          >
            Cancel & Refund
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Back
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-sm">
        {/* Booking ID */}
        <div className="flex justify-between">
          <span className="font-medium">Booking ID</span>
          <span>{bookingView?.[0]?.id}</span>
        </div>

        {/* Service Name */}
        <div className="flex justify-between">
          <span className="font-medium">Service</span>
          <span>{bookingView?.[0]?.serviceName}</span>
        </div>

        {/* Customer */}
        <div className="flex justify-between">
          <span className="font-medium">Customer</span>
          <span>{bookingView?.[0]?.customer?.name}</span>
        </div>

        {/* Provider */}
        <div className="flex justify-between">
          <span className="font-medium">Provider</span>
          <span>{bookingView?.[0]?.provider}</span>
        </div>

        {/* Date */}
        <div className="flex justify-between">
          <span className="font-medium">Booking Date</span>
          <span>{bookingView?.[0]?.bookingDate}</span>
        </div>

        {/* Time */}
        <div className="flex justify-between">
          <span className="font-medium">Booking Time</span>
          <span>{bookingView?.[0]?.bookingTime}</span>
        </div>

        {/* Amount */}
        <div className="flex justify-between">
          <span className="font-medium">Amount</span>
          <span>{bookingView?.[0]?.amount}</span>
        </div>

        {/* Category */}
        <div className="flex justify-between">
          <span className="font-medium">Category</span>
          <span>
            {bookingView?.[0]?.category?.length
              ? bookingView?.[0].category.map((c: any) => c.name).join(", ")
              : "-"}
          </span>
        </div>

        {/* Status */}
        <div className="flex justify-between">
          <span className="font-medium">Status</span>
          <span className={getStatusClasses(bookingView?.[0].status)}>
            {bookingView?.[0].status}
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default BookingViewForm;
