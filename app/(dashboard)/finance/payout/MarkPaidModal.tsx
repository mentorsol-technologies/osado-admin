"use client";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
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
  const { mutate: markPaid, isPending } = useMarkWithdrawalRequestPaidMutation();

  const handleSubmit = () => {
    if (!withdrawalRequestId) return;
    markPaid(
      { id: withdrawalRequestId },
      {
        onSuccess: () => {
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
            disabled={isPending}
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
      <p className="text-sm text-gray-300 p-2">
        Confirm that you've sent this provider their withdrawal via bank transfer.
        This marks the request as paid and notifies the provider.
      </p>
    </Modal>
  );
}
