import {
  getSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} from "@/services/subscriptions/subscriptionServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useGetSubscriptionPlansQuery = () => {
  return useQuery({
    queryKey: ["subscription-plans"],
    queryFn: getSubscriptionPlans,
  });
};

export const useCreateSubscriptionPlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createSubscriptionPlan(data),
    onSuccess: () => {
      toast.success("Subscription plan created successfully!");
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to create subscription plan!";
      toast.error(message);
    },
  });
};

export const useUpdateSubscriptionPlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateSubscriptionPlan(id, data),
    onSuccess: () => {
      toast.success("Subscription plan updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update subscription plan!";
      toast.error(message);
    },
  });
};

export const useDeleteSubscriptionPlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSubscriptionPlan(id),
    onSuccess: () => {
      toast.success("Subscription plan deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to delete subscription plan!";
      toast.error(message);
    },
  });
};
