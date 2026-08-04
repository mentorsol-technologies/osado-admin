import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRefund,
  CreateRefundPayload,
  getBookingRefundQuote,
  getRefunds,
} from "@/services/refunds/RefundServices";

/**
 * The policy quote for a booking.
 *
 * `staleTime: 0` on purpose: the quote depends on how long ago the booking was
 * created, so it changes as the 24h/72h windows elapse. A cached figure could
 * offer a full refund minutes after the window closed.
 */
export const useBookingRefundQuoteQuery = (bookingId: string, enabled = true) => {
  return useQuery({
    queryKey: ["bookingRefundQuote", bookingId],
    queryFn: () => getBookingRefundQuote(bookingId),
    enabled: Boolean(bookingId) && enabled,
    staleTime: 0,
    retry: false,
  });
};

export const useRefundsQuery = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["refunds", page, limit],
    queryFn: () => getRefunds(page, limit),
  });
};

export const useCreateRefundMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRefundPayload) => createRefund(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["refunds"] });
      // The quote changes once a refund lands (the payment may now be fully
      // refunded), and the booking list shows its status.
      queryClient.invalidateQueries({ queryKey: ["bookingRefundQuote"] });
      queryClient.invalidateQueries({ queryKey: ["serviceBookingList"] });
    },
  });
};
