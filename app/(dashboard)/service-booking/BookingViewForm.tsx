"use client";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";

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
  onRefundClick, // 👈 use it
}: BookingViewFormProps) => {
  const bookingFields = [
    { label: "Booking ID", key: "booking_id" },
    { label: "Service", key: "service_name" },
    { label: "Customer", key: "customer" },
    { label: "Status", key: "status" },
  ];
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
              onRefundClick(); // 👈 open refund modal via parent
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
      <div>
        {bookingFields.map((field) => (
          <p key={field.key} className="flex justify-between space-y-3">
            <span>{field.label}</span>
            <span>{booking?.[field.key]}</span>
          </p>
        ))}
      </div>
    </Modal>
  );
};

export default BookingViewForm;
