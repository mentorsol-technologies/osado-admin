"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import clsx from "clsx";
import MarkPaidModal from "./MarkPaidModal";
import RejectWithdrawalModal from "./RejectWithdrawalModal";

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
  const [markPaidOpen, setMarkPaidOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const payoutFields = [
    { label: "Payout ID", key: "id" },
    { label: "Recipient", key: "providerName" },
    { label: "Email", key: "providerEmail" },
    { label: "Amount", key: "amountDisplay" },
    { label: "Requested date", key: "requestedDate" },
    { label: "Paid date", key: "paidDate" },
    { label: "Status", key: "status" },
    ...(payout?.status === "REJECTED"
      ? [{ label: "Rejection Reason", key: "rejectionReason" }]
      : []),
  ];

  const getStatusClasses = (status: string) =>
    clsx("px-3 py-1 rounded-md border text-sm font-medium w-fit", {
      "text-green-400 border border-green-500/30 bg-green-500/10": status === "PAID",
      "text-blue-400 border border-blue-500/30 bg-blue-500/10": status === "PENDING",
      "text-red-400 border border-red-500/30 bg-red-500/10": status === "REJECTED",
    });

  const isPending = payout?.status === "PENDING";

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title="Withdrawal Request Details"
        footer={
          <div className="flex flex-col sm:flex-row w-full gap-3">
            {isPending && (
              <Button className="flex-1" onClick={() => setMarkPaidOpen(true)}>
                Mark as Paid
              </Button>
            )}
            {isPending && (
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => setRejectOpen(true)}
              >
                Reject
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
                <span className={getStatusClasses(payout?.[field.key])}>
                  {payout?.[field.key]}
                </span>
              ) : (
                <span className="text-white">
                  {payout?.[field.key] || "-"}
                </span>
              )}
            </div>
          ))}
        </div>
      </Modal>

      <MarkPaidModal
        open={markPaidOpen}
        onOpenChange={setMarkPaidOpen}
        withdrawalRequestId={payout?.id}
        onSuccess={() => onOpenChange(false)}
      />

      <RejectWithdrawalModal
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        withdrawalRequestId={payout?.id}
        onSuccess={() => onOpenChange(false)}
      />
    </>
  );
};

export default PayoutViewForm;
