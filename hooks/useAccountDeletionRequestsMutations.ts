import {
  getAccountDeletionRequests,
  getAccountDeletionRequestDetails,
  approveAccountDeletionRequest,
  rejectAccountDeletionRequest,
} from "@/services/account-deletion-requests/accountDeletionRequestsServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useAccountDeletionRequestsQuery = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["accountDeletionRequests", page, limit],
    queryFn: () => getAccountDeletionRequests(page, limit),
    staleTime: 1000 * 60 * 2,
  });
};

export const useAccountDeletionRequestDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: ["accountDeletionRequests", id],
    queryFn: () => getAccountDeletionRequestDetails(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
};

export const useApproveAccountDeletionRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approveAccountDeletionRequest(id),
    onSuccess: () => {
      toast.success("Account deletion request approved. The account has been deleted.");
      queryClient.invalidateQueries({ queryKey: ["accountDeletionRequests"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to approve account deletion request",
      );
    },
  });
};

export const useRejectAccountDeletionRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rejectionReason }: { id: string; rejectionReason: string }) =>
      rejectAccountDeletionRequest(id, rejectionReason),
    onSuccess: () => {
      toast.success("Account deletion request rejected. The user has been notified.");
      queryClient.invalidateQueries({ queryKey: ["accountDeletionRequests"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to reject account deletion request",
      );
    },
  });
};
