"use client";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import clsx from "clsx";

interface PayoutViewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payout?: any;
}

const PayoutViewForm = ({
  open,
  onOpenChange,
  payout,
}: PayoutViewFormProps) => {
  const payoutFields = [
    { label: "Payout ID", key: "payout_id" },
    { label: "Recipient", key: "recipient" },
    { label: "Role", key: "role" },
    { label: "Email", key: "email" },
    { label: "Phone number", key: "phone" },
    { label: "Amount", key: "amount" },
    { label: "Payment method", key: "payment_method" },
    { label: "Requested date", key: "requested_date" },
    { label: "Processed date", key: "processed_date" },
    { label: "Status", key: "status" },
  ];

  const getStatusClasses = (status: string) =>
    clsx("px-3 py-1 rounded-md border text-sm font-medium w-fit", {
      "text-green-400 border border-green-500/30 bg-green-500/10":
        status === "Confirmed",
      "text-blue-400 border border-blue-500/30 bg-blue-500/10":
        status === "Pending",
      "text-red-400 border border-red-500/30 bg-red-500/10":
        status === "Canceled",
    });

  const isConfirmed = payout?.status === "Confirmed";
  const isPending = payout?.status === "Pending";
  const isCanceled = payout?.status === "Canceled";

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Payout Details"
      footer={
        <div className="flex flex-col sm:flex-row w-full gap-3">
          {isConfirmed && (
            <Button
              className="flex-1"
              onClick={() => alert("Download Receipt")}
            >
              Download Receipt
            </Button>
          )}
            {isPending && (
            <Button
              className="flex-1"
              onClick={() => alert("Payout Approved")}
            >
              Approve
            </Button>
          )}
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
      <div className="space-y-4">
        {payoutFields.map((field) => (
          <div
            key={field.key}
            className="flex justify-between items-center text-sm"
          >
            <span className="text-white">{field.label}</span>
            {field.key === "status" ? (
              <div className="flex flex-col items-end">
                <span className={getStatusClasses(payout?.[field.key])}>
                  {payout?.[field.key]}
                </span>
                {isCanceled && (
                  <span className="text-red-400 text-xs mt-1">
                    Invalid bank account details provided.
                  </span>
                )}
              </div>
            ) : (
              <span className="text-white">
                {payout?.[field.key] || "-"}
              </span>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default PayoutViewForm;
