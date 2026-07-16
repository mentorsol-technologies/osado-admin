import {
  getProviderCommission,
  setProviderCommission,
  type CommissionType,
} from "@/services/providerCommissions/providerCommissionServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useGetProviderCommissionQuery = (
  providerId: string,
  type: CommissionType,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: ["provider-commission", providerId, type],
    queryFn: () => getProviderCommission(providerId, type),
    enabled,
  });
};

export const useSetProviderCommissionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      providerId,
      type,
      rate,
    }: {
      providerId: string;
      type: CommissionType;
      rate: number;
    }) => setProviderCommission(providerId, type, rate),
    onSuccess: (_data, { providerId, type }) => {
      toast.success("Commission rate updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["provider-commission", providerId, type] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update commission rate!";
      toast.error(message);
    },
  });
};
