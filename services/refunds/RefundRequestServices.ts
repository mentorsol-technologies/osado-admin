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
export const getRefundRequest = async (
  id: string,
): Promise<{ request: RefundRequest; quote: RefundQuote | null }> => {
  return (await api.get(`/refund-requests/${id}`)) as unknown as {
    request: RefundRequest;
    quote: RefundQuote | null;
  };
};

export const approveRefundRequest = async (id: string, notes?: string) => {
  return await api.patch(`/refund-requests/${id}/approve`, { notes });
};

export const rejectRefundRequest = async (id: string, reason: string) => {
  return await api.patch(`/refund-requests/${id}/reject`, { reason });
};
