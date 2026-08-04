import api from "@/lib/axios";

export type RefundReason =
  | "SERVICE_NOT_PROVIDED"
  | "PROVIDER_CANCELLED"
  | "CUSTOMER_REQUEST"
  | "OTHER";

export interface RefundQuote {
  eligibility: "FULL" | "PARTIAL_MINUS_COMMISSION" | "NONE";
  refundableAmount: number;
  commissionWithheld: number;
  commissionRefundable: boolean;
  hoursSinceBooking: number;
  reason: string;
  bookingId: string;
  paymentId: string | null;
  alreadyRefunded: boolean;
}

export interface CreateRefundPayload {
  paymentId: string;
  amount?: number;
  reason: RefundReason;
  comment?: string;
}

/**
 * What the refund policy allows for this booking right now. Read-only, so it is
 * safe to call whenever the admin opens the dialog - it never moves money.
 */
export const getBookingRefundQuote = async (
  bookingId: string,
): Promise<RefundQuote> => {
  return (await api.get(
    `/refunds/booking/${bookingId}/quote`,
  )) as unknown as RefundQuote;
};

/** Issues the refund. Admin-only on the backend. */
export const createRefund = async (payload: CreateRefundPayload) => {
  return await api.post("/refunds", payload);
};

export const getRefunds = async (page = 1, limit = 10) => {
  return await api.get("/refunds", { params: { page, limit } });
};

export const getRefundsForPayment = async (paymentId: string) => {
  return await api.get(`/refunds/payment/${paymentId}`);
};
