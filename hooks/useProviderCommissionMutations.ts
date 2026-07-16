import {
  getProviderCommission,
  setProviderCommission,
} from "@/services/providerCommissions/providerCommissionServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useGetProviderCommissionQuery = (providerId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["provider-commission", providerId],
    queryFn: () => getProviderCommission(providerId),
    enabled,
  });
};

export const useSetProviderCommissionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ providerId, rate }: { providerId: string; rate: number }) =>
      setProviderCommission(providerId, rate),
    onSuccess: (_data, { providerId }) => {
      toast.success("Commission rate updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["provider-commission", providerId] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update commission rate!";
      toast.error(message);
    },
  });
};
