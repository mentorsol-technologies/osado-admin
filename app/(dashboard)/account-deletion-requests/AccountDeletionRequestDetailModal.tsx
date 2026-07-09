"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import {
  useAccountDeletionRequestDetailsQuery,
  useApproveAccountDeletionRequestMutation,
  useRejectAccountDeletionRequestMutation,
} from "@/hooks/useAccountDeletionRequestsMutations";
import { capitalizeFirstLetter } from "@/lib/utils";

interface AccountDeletionRequestDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId?: string;
}

export default function AccountDeletionRequestDetailModal({
  open,
  onOpenChange,
  requestId,
}: AccountDeletionRequestDetailModalProps) {
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: request, isLoading } = useAccountDeletionRequestDetailsQuery(
    requestId || "",
  );
  const { mutate: approve, isPending: isApproving } =
    useApproveAccountDeletionRequestMutation();
  const { mutate: reject, isPending: isRejecting } =
    useRejectAccountDeletionRequestMutation();

  if (!requestId) return null;

  const isPending = request?.status === "pending";
  const hasOpenItems =
    (request?.totalBookingsCount ?? 0) > 0 || (request?.pendingReportsCount ?? 0) > 0;

  const handleApprove = () => {
    approve(requestId, {
      onSuccess: () => {
        setRejectionReason("");
        onOpenChange(false);
      },
    });
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejecting this request.");
      return;
    }

    reject(
      { id: requestId, rejectionReason: rejectionReason.trim() },
      {
        onSuccess: () => {
          setRejectionReason("");
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) setRejectionReason("");
      }}
      title="Account Deletion Request"
      footer={
        isPending ? (
          <div className="flex flex-col sm:flex-row gap-3 pt-3 w-full">
            <Button
              onClick={handleApprove}
              disabled={isApproving || isRejecting}
              className="flex-1"
            >
              {isApproving ? "Approving..." : "Approve & Delete Account"}
            </Button>
            <Button
              onClick={handleReject}
              disabled={isApproving || isRejecting}
              variant="outline"
              className="flex-1"
            >
              {isRejecting ? "Rejecting..." : "Reject"}
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        )
      }
    >
      {isLoading || !request ? (
        <p className="text-white text-center py-6">Loading...</p>
      ) : (
        <div className="rounded-2xl text-white px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Profile Section */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-black-300">
              {request.user?.photoURL && (
                <Image
                  src={request.user.photoURL}
                  alt={request.user?.name || "User"}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <h3 className="mt-3 text-lg font-semibold">
              {request.user?.name || "—"} {request.user?.surName || ""}
            </h3>
            <p className="text-sm text-gray-300">
              {request.user?.role?.role
                ? capitalizeFirstLetter(request.user.role.role)
                : "—"}
            </p>
          </div>

          {/* Info Section */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white-100">Phone</span>
              <span>{request.user?.phoneNumber || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white-100">Email</span>
              <span>{request.user?.email || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white-100">Requested On</span>
              <span>{new Date(request.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white-100">Status</span>
              <span
                className={`rounded px-2 py-1 text-xs ${
                  request.status === "approved"
                    ? "text-green-400 border border-green-500/30"
                    : request.status === "rejected"
                      ? "text-purple-400 border border-purple-500/30"
                      : request.status === "withdrawn"
                        ? "text-gray-400 border border-gray-500/30"
                        : "text-blue-400 border border-blue-500/30"
                }`}
              >
                {capitalizeFirstLetter(request.status)}
              </span>
            </div>
          </div>

          {/* User's stated reason */}
          {request.reason && (
            <div>
              <p className="font-medium mb-1">User's Reason</p>
              <p className="text-sm text-gray-300">{request.reason}</p>
            </div>
          )}

          {/* Review context - open bookings / reports */}
          {isPending && (
            <div
              className={`rounded-lg border p-4 space-y-2 ${
                hasOpenItems
                  ? "border-yellow-500/40 bg-yellow-500/5"
                  : "border-gray-700"
              }`}
            >
              <p className="font-medium text-sm">
                Before approving, review this account for open items:
              </p>
              <div className="flex justify-between text-sm">
                <span>Total bookings on record</span>
                <span>{request.totalBookingsCount ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pending complaints against this user</span>
                <span>{request.pendingReportsCount ?? 0}</span>
              </div>
              {hasOpenItems && (
                <p className="text-xs text-yellow-400">
                  This account has open bookings or complaints. Confirm they're resolved
                  before approving deletion.
                </p>
              )}
            </div>
          )}

          {/* Already-reviewed context */}
          {request.status === "rejected" && request.rejectionReason && (
            <div>
              <p className="font-medium mb-1">Rejection Reason</p>
              <p className="text-sm text-gray-300">{request.rejectionReason}</p>
            </div>
          )}

          {request.status === "withdrawn" && (
            <p className="text-sm text-gray-400">
              The user withdrew this request themselves before it was reviewed.
            </p>
          )}

          {/* Reject reason input */}
          {isPending && (
            <div className="mt-4">
              <label className="block text-sm mb-1">
                Rejection Reason (required to reject)
              </label>
              <Textarea
                rows={4}
                placeholder="Explain why this request can't be approved yet..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
