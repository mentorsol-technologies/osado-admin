"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AlertTriangle, Clock, Info } from "lucide-react";

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
import {
  useBookingRefundQuoteQuery,
  useCreateRefundMutation,
} from "@/hooks/useRefundMutations";
import { RefundReason } from "@/services/refunds/RefundServices";

const REASONS: { value: RefundReason; label: string }[] = [
  { value: "SERVICE_NOT_PROVIDED", label: "Service Not Provided" },
  { value: "PROVIDER_CANCELLED", label: "Provider Cancelled" },
  { value: "CUSTOMER_REQUEST", label: "Customer Request" },
  { value: "OTHER", label: "Other" },
];

interface RefundBookingModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCancelClick: () => void;
  bookingId?: string;
  onSaved?: () => void;
}

/**
 * Admin refund dialog.
 *
 * The refund policy is decided on the backend, so this dialog reads the quote
 * rather than recomputing the windows here - two implementations of the same
 * rules would eventually disagree, and the one the customer is shown must be
 * the one that actually gets paid.
 */
export default function RefundBookingModal({
  open,
  setOpen,
  onCancelClick,
  bookingId,
  onSaved,
}: RefundBookingModalProps) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState<RefundReason>("CUSTOMER_REQUEST");
  const [comment, setComment] = useState("");

  const {
    data: quote,
    isLoading: quoteLoading,
    isError: quoteError,
  } = useBookingRefundQuoteQuery(bookingId || "", open);

  const { mutate: refund, isPending } = useCreateRefundMutation();

  // Default the amount to whatever the policy allows, so the common case is
  // one click and the admin only types when overriding downwards.
  useEffect(() => {
    if (quote?.refundableAmount) {
      setAmount(String(quote.refundableAmount));
    }
  }, [quote?.refundableAmount]);

  const resetForm = () => {
    setAmount("");
    setReason("CUSTOMER_REQUEST");
    setComment("");
  };

  const close = () => {
    resetForm();
    setOpen(false);
  };

  const notRefundable =
    !quote || quote.eligibility === "NONE" || quote.refundableAmount <= 0;

  const handleSubmit = async () => {
    if (!quote?.paymentId) {
      toast.error("No payment was found for this booking");
      return;
    }

    if (!bookingId) {
      toast.error("No booking ID found for this refund");
      return;
    }

    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      toast.error("Enter a refund amount greater than zero");
      return;
    }
    if (value > quote.refundableAmount) {
      toast.error(
        `The refund policy allows at most ${quote.refundableAmount} for this booking`,
      );
      return;
    }

    refund(
      {
        paymentId: quote.paymentId,
        amount: value,
        reason,
        comment: comment.trim() || undefined,
        bookingId, // Include booking ID so backend knows to cancel it
      },
      {
        onSuccess: () => {
          toast.success(
            "Booking cancelled and refund approved. The customer has been notified.",
          );
          onSaved?.();
          close();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to process the refund",
          );
        },
      },
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        setOpen(isOpen);
      }}
      title="Review Refund Request"
      description="The amount below is what the platform's refund policy allows for this booking. Confirming issues the refund and notifies the customer."
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={isPending || quoteLoading || notRefundable}
          >
            {isPending ? "Processing..." : "Approve & Refund"}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              onCancelClick();
              close();
            }}
          >
            Cancel
          </Button>
        </div>
      }
    >
      {/* Policy summary - the admin sees the rule that produced the number,
          not just the number, so an unexpected figure is self-explaining. */}
      {quoteLoading ? (
        <p className="text-sm text-gray-400">Checking the refund policy...</p>
      ) : quoteError ? (
        <div className="flex gap-2 rounded-[14px] border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-300">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <span>Could not read the refund policy for this booking.</span>
        </div>
      ) : quote ? (
        <div
          className={`flex gap-2 rounded-[14px] border p-3 text-sm ${
            notRefundable
              ? "border-red-500/30 bg-red-500/5 text-red-300"
              : "border-purple-500/30 bg-purple-500/5 text-gray-200"
          }`}
        >
          {notRefundable ? (
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          ) : (
            <Info size={16} className="shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <p>{quote.reason}</p>
            {!notRefundable && (
              <>
                <p className="text-white">
                  Refundable: <strong>{quote.refundableAmount}</strong>
                </p>
                {quote.commissionWithheld > 0 && (
                  <p className="text-gray-400">
                    Platform commission withheld: {quote.commissionWithheld}
                  </p>
                )}
              </>
            )}
            <p className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={12} className="shrink-0" />
              {Math.round(quote.hoursSinceBooking)} hours since the booking was
              created
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
        <div className="flex-1">
          <label className="block text-sm mb-1">Refund Amount</label>
          <CommonInput
            type="number"
            placeholder="Amount"
            value={amount}
            disabled={notRefundable}
            onChange={(e: any) => setAmount(e.target.value)}
          />
          {quote && !notRefundable && (
            <p className="mt-1 text-xs text-gray-500">
              Maximum allowed by policy: {quote.refundableAmount}
            </p>
          )}
        </div>

        <div className="flex-1">
          <label className="block text-sm mb-1">Refund Reason</label>
          <Select
            value={reason}
            onValueChange={(value) => setReason(value as RefundReason)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select reason" />
            </SelectTrigger>
            <SelectContent>
              {REASONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm mb-1">Comment</label>
        <Textarea
          rows={4}
          placeholder="(Optional) Internal note, also sent to the payment gateway"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="rounded-[14px] border-black-300 bg-black-500 px-4 py-3 text-sm text-gray-200 placeholder:text-gray-500 resize-none focus-visible:border-purple-500 focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:ring-offset-0"
        />
      </div>
    </Modal>
  );
}
