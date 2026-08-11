"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { AlertTriangle, Clock, Info } from "lucide-react";

import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useApproveRefundRequestMutation,
  useRefundRequestQuery,
  useRejectRefundRequestMutation,
} from "@/hooks/useRefundRequestMutations";
import { FormatDate } from "@/lib/utils";

const REASON_LABELS: Record<string, string> = {
  SERVICE_NOT_PROVIDED: "Service Not Provided",
  PROVIDER_CANCELLED: "Provider Cancelled",
  CUSTOMER_REQUEST: "Customer Request",
  OTHER: "Other",
};

const FIELD_CLASS =
  "min-h-[90px] resize-none rounded-[14px] border-black-300 bg-black-500 px-4 py-3 " +
  "text-sm text-gray-200 placeholder:text-gray-500 transition-colors " +
  "focus-visible:border-purple-500 focus-visible:ring-1 focus-visible:ring-purple-500 " +
  "focus-visible:ring-offset-0";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string | null;
}

/**
 * Admin review of a refund request.
 *
 * Shows the request and the refund policy entitlement side by side, because the
 * two can disagree - someone can ask for a refund after the 72h window, and the
 * admin needs to see that before deciding rather than discovering it when the
 * approval fails.
 */
export default function ReviewRefundRequestModal({
  open,
  onOpenChange,
  requestId,
}: Props) {
  const [rejectReason, setRejectReason] = useState("");
  const [mode, setMode] = useState<"review" | "reject">("review");

  const { data, isLoading } = useRefundRequestQuery(requestId || "", open);
  const { mutate: approve, isPending: approving } =
    useApproveRefundRequestMutation();
  const { mutate: reject, isPending: rejecting } =
    useRejectRefundRequestMutation();

  const request = data?.request;
  const quote = data?.quote;
  const history = data?.history;

  // Worth the admin's attention: a repeat refunder, or someone who has already
  // been refunded for this very service. Per-booking guards can't catch either,
  // because each new booking passes them cleanly.
  const isNotable =
    (history?.sameServiceRefunds ?? 0) > 0 || (history?.completed ?? 0) >= 2;

  const close = () => {
    setRejectReason("");
    setMode("review");
    onOpenChange(false);
  };

  const notRefundable =
    !quote || quote.eligibility === "NONE" || quote.refundableAmount <= 0;

  const handleApprove = () => {
    if (!requestId) return;
    approve(
      { id: requestId },
      {
        onSuccess: () => {
          toast.success(
            "Approved. The refund is being processed and the customer has been notified.",
          );
          close();
        },
        onError: (error: any) =>
          toast.error(
            error?.response?.data?.message || "Failed to approve the request",
          ),
      },
    );
  };

  const handleReject = () => {
    if (!requestId) return;
    if (rejectReason.trim().length < 3) {
      toast.error("Please give a reason - it is sent to the requester");
      return;
    }
    reject(
      { id: requestId, reason: rejectReason.trim() },
      {
        onSuccess: () => {
          toast.success("Request declined. The requester has been notified.");
          close();
        },
        onError: (error: any) =>
          toast.error(
            error?.response?.data?.message || "Failed to decline the request",
          ),
      },
    );
  };

  const isPending = request?.status === "PENDING";

  return (
    <Modal
      open={open}
      onOpenChange={(isOpen) => (isOpen ? onOpenChange(true) : close())}
      title="Review Refund Request"
      size="lg"
      footer={
        !isPending ? (
          <p className="mt-4 w-full text-center text-sm text-gray-400">
            This request is already {request?.status?.toLowerCase()} — no further
            action is available.
          </p>
        ) : mode === "review" ? (
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
            <Button
              className="flex-1"
              onClick={handleApprove}
              disabled={approving || isLoading || notRefundable}
            >
              {approving ? "Processing..." : "Approve & Refund"}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setMode("reject")}
              disabled={approving}
            >
              Reject
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
            <Button
              className="flex-1"
              onClick={handleReject}
              disabled={rejecting}
            >
              {rejecting ? "Declining..." : "Confirm Decline"}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setMode("review")}
              disabled={rejecting}
            >
              Back
            </Button>
          </div>
        )
      }
    >
      {isLoading ? (
        <p className="text-sm text-gray-400">Loading request...</p>
      ) : !request ? (
        <p className="text-sm text-gray-400">Request not found.</p>
      ) : (
        <div className="space-y-5 text-sm text-white">
          {/* The ask */}
          <div className="space-y-2">
            <h3 className="font-semibold">Request</h3>
            <Row label="Requested by">
              {request.requesterName || "------"}{" "}
              <span className="text-xs text-gray-400">
                ({request.requestedByCustomer ? "customer" : "service provider"})
              </span>
            </Row>
            <Row label="Customer">{request.customerName || "------"}</Row>
            <Row label="Reason">
              {REASON_LABELS[request.reason] ?? request.reason}
            </Row>
            <Row label="Submitted">{FormatDate(request.createdAt)}</Row>
            {request.description && (
              <div className="pt-1">
                <p className="text-gray-400 text-xs mb-1">Their explanation</p>
                <p className="rounded-[14px] bg-black-600 px-3 py-2 text-sm">
                  {request.description}
                </p>
              </div>
            )}
          </div>

          {/* What the policy allows - the decisive number */}
          <div
            className={`flex gap-2 rounded-[14px] border p-3 ${
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
              <p className="font-medium text-white">Refund policy</p>
              <p>{quote?.reason ?? "Could not read the policy for this booking."}</p>
              {!notRefundable && (
                <>
                  <p className="text-white">
                    Refundable: <strong>{quote?.refundableAmount}</strong>
                  </p>
                  {(quote?.commissionWithheld ?? 0) > 0 && (
                    <p className="text-gray-400">
                      Platform commission withheld: {quote?.commissionWithheld}
                    </p>
                  )}
                </>
              )}
              {quote && (
                <p className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={12} className="shrink-0" />
                  {Math.round(quote.hoursSinceBooking)} hours since the booking
                  was created
                </p>
              )}
            </div>
          </div>

          {/* Requester track record. Informational, never blocking - a provider
              who genuinely cancelled twice isn't the customer's fault. */}
          {history && history.totalRequests > 0 && (
            <div
              className={`flex gap-2 rounded-[14px] border p-3 ${
                isNotable
                  ? "border-yellow-500/30 bg-yellow-500/5 text-yellow-200"
                  : "border-black-300 bg-black-600 text-gray-300"
              }`}
            >
              {isNotable ? (
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              ) : (
                <Info size={16} className="shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-medium text-white">Requester history</p>
                <p>
                  {history.totalRequests} previous refund
                  {history.totalRequests === 1 ? " request" : " requests"} —{" "}
                  {history.completed} approved, {history.rejected} declined
                </p>
                {history.sameServiceRefunds > 0 && (
                  <p className="text-white">
                    Already refunded for this same service{" "}
                    {history.sameServiceRefunds === 1
                      ? "once"
                      : `${history.sameServiceRefunds} times`}
                    .
                  </p>
                )}
              </div>
            </div>
          )}

          {mode === "review" ? (
            // Nothing to fill in on approval: the refund amount comes from the
            // policy shown above, so the admin's only decision is yes or no.
            isPending && (
              <p className="text-xs text-gray-500">
                Approving refunds{" "}
                <span className="text-gray-300">{quote?.refundableAmount}</span>{" "}
                automatically, as determined by the refund policy above.
              </p>
            )
          ) : (
            <div>
              <label className="block text-sm mb-1">Reason for declining</label>
              <Textarea
                value={rejectReason}
                placeholder="This is sent to the requester, so explain the decision."
                className={FIELD_CLASS}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          )}

          {request.reviewNotes && !isPending && (
            <div>
              <p className="text-gray-400 text-xs mb-1">
                Review note by {request.reviewerName || "------"}
              </p>
              <p className="rounded-[14px] bg-black-600 px-3 py-2 text-sm">
                {request.reviewNotes}
              </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-gray-400 shrink-0">{label}</span>
      <span className="text-right">{children}</span>
    </div>
  );
}
