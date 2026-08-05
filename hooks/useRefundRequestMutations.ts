import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveRefundRequest,
  getRefundRequest,
  getRefundRequests,
  getRefundRequestStats,
  rejectRefundRequest,
  ApproveRefundPayload,
  RefundRequestStatus,
} from "@/services/refunds/RefundRequestServices";

export const useRefundRequestsQuery = (
  page = 1,
  limit = 10,
  status?: RefundRequestStatus,
) => {
  return useQuery({
    queryKey: ["refundRequests", page, limit, status ?? "ALL"],
    queryFn: () => getRefundRequests(page, limit, status),
  });
};

export const useRefundRequestStatsQuery = () => {
  return useQuery({
    queryKey: ["refundRequestStats"],
    queryFn: getRefundRequestStats,
  });
};

/**
 * A single request plus its policy quote.
 *
 * `staleTime: 0` because the quote depends on how long ago the booking was
 * created - a cached figure could offer a full refund after the 24h window has
 * closed.
 */
export const useRefundRequestQuery = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["refundRequest", id],
    queryFn: () => getRefundRequest(id),
    enabled: Boolean(id) && enabled,
    staleTime: 0,
    retry: false,
  });
};

/** Everything a decision touches, invalidated together. */
const invalidateAfterReview = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ["refundRequests"] });
  queryClient.invalidateQueries({ queryKey: ["refundRequestStats"] });
  queryClient.invalidateQueries({ queryKey: ["refundRequest"] });
  // Approving issues a refund, so the refunds list changes too.
  queryClient.invalidateQueries({ queryKey: ["refunds"] });
};

export const useApproveRefundRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: { id: string } & ApproveRefundPayload) =>
      approveRefundRequest(id, payload),
    onSuccess: () => invalidateAfterReview(queryClient),
  });
};

export const useRejectRefundRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectRefundRequest(id, reason),
    onSuccess: () => invalidateAfterReview(queryClient),
  });
};
