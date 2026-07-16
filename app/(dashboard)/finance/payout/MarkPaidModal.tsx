"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import CommonInput from "@/components/ui/input";
import { useMarkWithdrawalRequestPaidMutation } from "@/hooks/useWithdrawalRequestMutations";

interface MarkPaidModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  withdrawalRequestId?: string | null;
  onSuccess?: () => void;
}

export default function MarkPaidModal({
  open,
  onOpenChange,
  withdrawalRequestId,
  onSuccess,
}: MarkPaidModalProps) {
  const [transactionId, setTransactionId] = useState("");
  const { mutate: markPaid, isPending } = useMarkWithdrawalRequestPaidMutation();

  const handleSubmit = () => {
    if (!withdrawalRequestId || !transactionId.trim()) return;
    markPaid(
      { id: withdrawalRequestId, transactionId: transactionId.trim() },
      {
        onSuccess: () => {
          setTransactionId("");
          onOpenChange(false);
          onSuccess?.();
        },
      },
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Mark Withdrawal as Paid"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={isPending || !transactionId.trim()}
          >
            {isPending ? "Saving..." : "Confirm Paid"}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-white p-2">
        <div>
          <label className="block text-sm mb-1">Bank Transaction ID</label>
          <CommonInput
            placeholder="e.g. TXN-20260715-001"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-1">
            Enter the reference ID from the manual bank transfer you completed. This will be shown to the provider.
          </p>
        </div>
      </div>
    </Modal>
  );
}
