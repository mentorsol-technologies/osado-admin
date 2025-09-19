"use client";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import clsx from "clsx";

interface BookingViewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: any;
  onRefundClick: () => void;
}

const BookingViewForm = ({
  open,
  onOpenChange,
  booking,
  onRefundClick,
}: BookingViewFormProps) => {
  const bookingFields = [
    { label: "Booking ID", key: "booking_id" },
    { label: "Service", key: "service_name" },
    { label: "Customer", key: "customer" },
    { label: "Status", key: "status" },
  ];

  const getStatusClasses = (status: string) =>
    clsx("px-3 py-1 rounded-md border text-sm font-medium w-fit", {
      "text-green-400 text-green-400 border border-green-500/30": status === "Confirmed",
      "text-blue-400 border border-blue-500/30": status === "Pending",
      "border border-red-500 text-red-500 ": status === "Canceled",
    });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Service Booking"
      footer={
        <div className="flex flex-col lg:flex-row w-full gap-2">
          <Button
            className="flex-1"
            onClick={() => {
              onOpenChange(false); // close booking modal
              onRefundClick(); // open refund modal
            }}
          >
            Cancel and Refund
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
      <div className="space-y-3">
        {bookingFields.map((field) => (
          <div key={field.key} className="flex justify-between items-center">
            <span className="font-medium">{field.label}</span>
            {field.key === "status" ? (
              <span className={getStatusClasses(booking?.[field.key])}>
                {booking?.[field.key]}
              </span>
            ) : (
              <span>{booking?.[field.key]}</span>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default BookingViewForm;
