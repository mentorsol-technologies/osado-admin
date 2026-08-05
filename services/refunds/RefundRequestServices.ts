import api from "@/lib/axios";
import { RefundQuote } from "./RefundServices";

export type RefundRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED"
  | "FAILED";

export interface RefundRequest {
  id: string;
  bookingId: string;
  status: RefundRequestStatus;
  reason: string;
  description: string | null;
  requestedBy: string;
  requesterName: string | null;
  requestedByCustomer: boolean;
  bookingDate: string | null;
  bookingStatus: string | null;
  customerName: string | null;
  reviewedBy: string | null;
  reviewerName: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  refundId: string | null;
  refundedAmount: number | null;
  createdAt: string;
}

export const getRefundRequests = async (
  page = 1,
  limit = 10,
  status?: RefundRequestStatus,
) => {
  return await api.get("/refund-requests", {
    params: { page, limit, ...(status ? { status } : {}) },
  });
};

/** Counts per status, used for the pending badge in the sidebar/header. */
export const getRefundRequestStats = async (): Promise<
  Record<string, number>
> => {
  return (await api.get("/refund-requests/stats")) as unknown as Record<
    string,
    number
  >;
};

/**
 * A single request together with the refund policy quote for its booking, so
 * the admin reviews the ask and the entitlement on one screen.
 */
/** The requester's refund track record, shown to the reviewing admin. */
export interface RefundRequesterHistory {
  /** Their other refund requests, excluding the one being reviewed. */
  totalRequests: number;
  completed: number;
  rejected: number;
  /** Completed refunds they've already had on this same service package. */
  sameServiceRefunds: number;
}

export const getRefundRequest = async (
  id: string,
): Promise<{
  request: RefundRequest;
  quote: RefundQuote | null;
  history: RefundRequesterHistory | null;
}> => {
  return (await api.get(`/refund-requests/${id}`)) as unknown as {
    request: RefundRequest;
    quote: RefundQuote | null;
    history: RefundRequesterHistory | null;
  };
};

export interface ApproveRefundPayload {
  notes?: string;
  /** True when the admin has already paid the refund outside the gateway. */
  manual?: boolean;
  manualReference?: string;
}

export const approveRefundRequest = async (
  id: string,
  payload: ApproveRefundPayload = {},
) => {
  return await api.patch(`/refund-requests/${id}/approve`, payload);
};

export const rejectRefundRequest = async (id: string, reason: string) => {
  return await api.patch(`/refund-requests/${id}/reject`, { reason });
};
