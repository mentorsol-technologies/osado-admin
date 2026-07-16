"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/textarea";
import { useRejectWithdrawalRequestMutation } from "@/hooks/useWithdrawalRequestMutations";

interface RejectWithdrawalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  withdrawalRequestId?: string | null;
  onSuccess?: () => void;
}

export default function RejectWithdrawalModal({
  open,
  onOpenChange,
  withdrawalRequestId,
  onSuccess,
}: RejectWithdrawalModalProps) {
  const [reason, setReason] = useState("");
  const { mutate: reject, isPending } = useRejectWithdrawalRequestMutation();

  const handleSubmit = () => {
    if (!withdrawalRequestId || !reason.trim()) return;
    reject(
      { id: withdrawalRequestId, reason: reason.trim() },
      {
        onSuccess: () => {
          setReason("");
          onOpenChange(false);
          onSuccess?.();
        },
      },
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) setReason("");
      }}
      title="Reject Withdrawal Request"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            className="flex-1"
            variant="outline"
            onClick={handleSubmit}
            disabled={isPending || !reason.trim()}
          >
            {isPending ? "Rejecting..." : "Confirm Reject"}
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
          <label className="block text-sm mb-1">Rejection Reason</label>
          <Textarea
            rows={4}
            placeholder="Explain why this withdrawal request is being rejected..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-1">
            The held amount will be credited back to the provider's wallet balance, and they&apos;ll be notified with this reason.
          </p>
        </div>
      </div>
    </Modal>
  );
}
