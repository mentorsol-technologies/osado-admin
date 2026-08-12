"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";

import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useApproveBannerMutation,
  useBannerQuery,
  useRejectBannerMutation,
} from "@/hooks/useBannerRequestMutations";
import { FormatDate } from "@/lib/utils";

const FIELD_CLASS =
  "min-h-[90px] resize-none rounded-[14px] border-black-300 bg-black-500 px-4 py-3 " +
  "text-sm text-gray-200 placeholder:text-gray-500 transition-colors " +
  "focus-visible:border-purple-500 focus-visible:ring-1 focus-visible:ring-purple-500 " +
  "focus-visible:ring-offset-0";

const INPUT_CLASS =
  "w-full rounded-[14px] border border-black-300 bg-black-500 px-4 py-2 " +
  "text-sm text-gray-200 placeholder:text-gray-500 transition-colors " +
  "focus-visible:outline-none focus-visible:border-purple-500 focus-visible:ring-1 " +
  "focus-visible:ring-purple-500";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string | null;
}

/** Admin review of a business-owner banner request: approve the content (no
 * payment happens here - price is pre-filled with the platform default but
 * editable per request) or reject it with a reason the requester will see. */
export default function ReviewBannerRequestModal({
  open,
  onOpenChange,
  requestId,
}: Props) {
  const [rejectReason, setRejectReason] = useState("");
  const [mode, setMode] = useState<"review" | "reject">("review");
  const [price, setPrice] = useState("");

  const { data: banner, isLoading } = useBannerQuery(requestId || "", open);
  const { mutate: approve, isPending: approving } = useApproveBannerMutation();
  const { mutate: reject, isPending: rejecting } = useRejectBannerMutation();

  // Pre-fill from the banner's price once it loads - the backend already
  // previews the platform default here for a still-pending request, so this
  // starts as "the default" and becomes "what the admin typed" the moment
  // they touch it.
  useEffect(() => {
    if (banner?.price != null) {
      setPrice(String(banner.price));
    }
  }, [banner?.price]);

  const close = () => {
    setRejectReason("");
    setMode("review");
    onOpenChange(false);
  };

  const handleApprove = () => {
    if (!requestId) return;
    const parsedPrice = price.trim() === "" ? undefined : Number(price);
    if (parsedPrice !== undefined && (Number.isNaN(parsedPrice) || parsedPrice < 0)) {
      toast.error("Enter a valid price");
      return;
    }
    approve(
      { id: requestId, price: parsedPrice },
      {
        onSuccess: () => {
          toast.success("Approved. The requester can now pay to activate it.");
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

  const isPending = banner?.status === "pending";

  return (
    <Modal
      open={open}
      onOpenChange={(isOpen) => (isOpen ? onOpenChange(true) : close())}
      title="Review Banner Request"
      size="lg"
      footer={
        !isPending ? (
          <p className="mt-4 w-full text-center text-sm text-gray-400 capitalize">
            This request is already {banner?.status} - no further action is
            available.
          </p>
        ) : mode === "review" ? (
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
            <Button
              className="flex-1"
              onClick={handleApprove}
              disabled={approving || isLoading}
            >
              {approving ? "Approving..." : "Approve"}
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
            <Button className="flex-1" onClick={handleReject} disabled={rejecting}>
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
      ) : !banner ? (
        <p className="text-sm text-gray-400">Request not found.</p>
      ) : (
        <div className="space-y-5 text-sm text-white">
          {banner.photoURL && (
            <div className="relative h-40 w-full rounded-[14px] overflow-hidden">
              <Image
                src={banner.photoURL}
                alt={banner.bannerTitle || "Banner"}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="space-y-2">
            <Row label="Requested by">{banner.ownerName || "------"}</Row>
            <Row label="Banner ID">{banner.bannerId || "------"}</Row>
            <Row label="Link">{banner.link || "------"}</Row>
            <Row label="Start Date">
              {banner.startDate ? FormatDate(banner.startDate) : "------"}
            </Row>
            <Row label="End Date">
              {banner.endDate ? FormatDate(banner.endDate) : "------"}
            </Row>
            <Row label="Target Audience">
              {Array.isArray(banner.displayCategories)
                ? banner.displayCategories.join(", ")
                : banner.displayCategories || "------"}
            </Row>
            <Row label="Submitted">{FormatDate(banner.createdAt)}</Row>
          </div>

          {isPending && mode === "review" && (
            <div>
              <label className="block text-sm mb-1">Price (KWD)</label>
              <input
                type="number"
                min={0}
                step="0.001"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Platform default"
                className={INPUT_CLASS}
              />
              <p className="text-xs text-gray-500 mt-1">
                Pre-filled with the platform&apos;s default banner price -
                change it to charge something different for this request.
              </p>
            </div>
          )}

          {mode === "reject" && (
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

          {banner.status === "approved" && banner.price != null && (
            <Row label="Price">KWD {banner.price}</Row>
          )}

          {banner.status === "rejected" && banner.rejectionReason && (
            <div>
              <p className="text-gray-400 text-xs mb-1">
                Review note by {banner.reviewedByName || "------"}
              </p>
              <p className="rounded-[14px] bg-black-600 px-3 py-2 text-sm">
                {banner.rejectionReason}
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
