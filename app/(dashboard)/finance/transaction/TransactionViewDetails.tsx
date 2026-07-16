"use client";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import clsx from "clsx";

interface TransactionViewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: any;
}

const TransactionViewForm = ({
  open,
  onOpenChange,
  transaction,
}: TransactionViewFormProps) => {
  const transactionFields = [
    { label: "Transaction ID", key: "transaction_id" },
    { label: "User name", key: "user_name" },
    { label: "Role", key: "role" },
    { label: "Type", key: "type" },
    { label: "Description", key: "booking_reference" },
    { label: "Time", key: "time" },
    { label: "Date", key: "date" },
    { label: "Amount", key: "amount" },
    { label: "Status", key: "status" },
    ...(transaction?.status === "Rejected"
      ? [{ label: "Rejection Reason", key: "rejectionReason" }]
      : []),
  ];

  const getStatusClasses = (status: string) =>
    clsx("px-3 py-1 rounded-md border text-sm font-medium w-fit", {
      "text-green-400 border border-green-500/30 bg-green-500/10":
        status === "Successful",
      "text-blue-400 border border-blue-500/30 bg-blue-500/10":
        status === "Pending",
      "text-red-400 border border-red-500/30 bg-red-500/10":
        status === "Rejected",
    });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Transaction Details"
      footer={
        <div className="flex w-full">
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
        {transactionFields.map((field) => (
          <div
            key={field.key}
            className="flex justify-between items-center text-sm"
          >
            <span className="text-white">{field.label}</span>
            {field.key === "status" ? (
              <span className={getStatusClasses(transaction?.[field.key])}>
                {transaction?.[field.key]}
              </span>
            ) : (
              <span className="text-white ">
                {transaction?.[field.key] || "-"}
              </span>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default TransactionViewForm;
