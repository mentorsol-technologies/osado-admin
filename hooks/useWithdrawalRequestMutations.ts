import {
  getWithdrawalRequests,
  markWithdrawalRequestPaid,
  rejectWithdrawalRequest,
} from "@/services/withdrawalRequests/withdrawalRequestServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useGetWithdrawalRequestsQuery = () => {
  return useQuery({
    queryKey: ["withdrawal-requests"],
    queryFn: getWithdrawalRequests,
  });
};

export const useMarkWithdrawalRequestPaidMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, transactionId }: { id: string; transactionId: string }) =>
      markWithdrawalRequestPaid(id, transactionId),
    onSuccess: () => {
      toast.success("Withdrawal marked as paid!");
      queryClient.invalidateQueries({ queryKey: ["withdrawal-requests"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to mark withdrawal as paid!";
      toast.error(message);
    },
  });
};

export const useRejectWithdrawalRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectWithdrawalRequest(id, reason),
    onSuccess: () => {
      toast.success("Withdrawal request rejected!");
      queryClient.invalidateQueries({ queryKey: ["withdrawal-requests"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to reject withdrawal request!";
      toast.error(message);
    },
  });
};
