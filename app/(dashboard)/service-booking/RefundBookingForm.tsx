"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Modal from "@/components/ui/Modal";
import CommonInput from "@/components/ui/input";

// ✅ Updated schema
const schema = z.object({
  amount: z.string().min(2, "Refund amount is required"),
  reason: z.enum([
    "Service Not Provided",
    "Provider Canceled",
    "Customer Request",
    "Other",
  ]),
  comment: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface RefundBookingModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCancelClick: () => void;
  selectedRefund?: {
    amount: string;
    reason: string;
    comment?: string;
  };
  onSave: (data: FormData) => void;
}

export default function RefundBookingModal({
  open,
  setOpen,
  selectedRefund,
  onSave,
  onCancelClick,
}: RefundBookingModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: selectedRefund?.amount || "",
      reason:
        (selectedRefund?.reason as
          | "Service Not Provided"
          | "Provider Canceled"
          | "Customer Request"
          | "Other") || "Service Not Provided",
      comment: selectedRefund?.comment || "",
    },
  });

  const handleResetForm = () => {
    reset({
      amount: "",
      reason: "Service Not Provided",
      comment: "",
    });
  };

  const onSubmit = (data: FormData) => {
    handleResetForm();
    onSave(data);
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleResetForm();
        }
        setOpen(isOpen);
      }}
      title="Give Refund"
      description="Are you sure you want to cancel this booking and issue a refund?"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button onClick={handleSubmit(onSubmit)} className="flex-1">
            Submit
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              handleResetForm();
              onCancelClick();
              setOpen(false);
            }}
          >
            Cancel
          </Button>
        </div>
      }
    >
      {/* Two-column row */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="flex-1 flex-col sm:flex-row">
          <label className="block text-sm mb-1">Refund Amount</label>
          <CommonInput placeholder="Write amount" {...register("amount")} />
          {errors.amount && (
            <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>
          )}
        </div>

        <div className="flex-1 flex-col sm:flex-row">
          <label className="block text-sm mb-1">Refund Reason</label>
          <Select
            defaultValue={selectedRefund?.reason || "Service Not Provided"}
            onValueChange={(val) =>
              setValue(
                "reason",
                val as
                  | "Service Not Provided"
                  | "Provider Canceled"
                  | "Customer Request"
                  | "Other"
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Service Not Provided">
                Service Not Provided
              </SelectItem>
              <SelectItem value="Provider Canceled">
                Provider Canceled
              </SelectItem>
              <SelectItem value="Customer Request">Customer Request</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.reason && (
            <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>
          )}
        </div>
      </div>

      {/* Comment */}
      <div className="mt-4">
        <label className="block text-sm mb-1">Comment</label>
        <Textarea rows={4} placeholder="(Optional)" {...register("comment")} />
      </div>
    </Modal>
  );
}
