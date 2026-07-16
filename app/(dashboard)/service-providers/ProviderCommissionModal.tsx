"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import CommonInput from "@/components/ui/input";
import {
  useGetProviderCommissionQuery,
  useSetProviderCommissionMutation,
} from "@/hooks/useProviderCommissionMutations";

interface ProviderCommissionModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  providerId?: string | null;
  providerName?: string;
}

export default function ProviderCommissionModal({
  open,
  setOpen,
  providerId,
  providerName,
}: ProviderCommissionModalProps) {
  const [rate, setRate] = useState<string>("");

  const { data } = useGetProviderCommissionQuery(providerId || "", open && Boolean(providerId));
  const { mutate: setCommission, isPending } = useSetProviderCommissionMutation();

  useEffect(() => {
    if (open) {
      setRate(data?.rate != null ? String(data.rate) : "0");
    }
  }, [open, data]);

  const handleSubmit = () => {
    if (!providerId) return;
    const parsed = Number(rate);
    if (Number.isNaN(parsed) || parsed < 0 || parsed > 100) return;

    setCommission(
      { providerId, rate: parsed },
      { onSuccess: () => setOpen(false) },
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title={`Commission Rate${providerName ? ` — ${providerName}` : ""}`}
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button onClick={handleSubmit} className="flex-1" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-white p-2">
        <div>
          <label className="block text-sm mb-1">Commission (%)</label>
          <CommonInput
            type="number"
            placeholder="15"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-1">
            Percentage deducted from this provider&apos;s booking payments before crediting their wallet. 0% means they keep the full amount.
          </p>
        </div>
      </div>
    </Modal>
  );
}
