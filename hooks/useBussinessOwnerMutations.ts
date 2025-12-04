import {
  BussinessOwnerService,
  CreateBussinessOwnerService,
  SuspendBussinessOwnerService,
} from "@/services/bussiness-owner/BussinessOwnerService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useBussinessOwnerQuery = () => {
  return useQuery({
    queryKey: ["owner"],
    queryFn: BussinessOwnerService,
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateBussinessOwnerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CreateBussinessOwnerService,
    onSuccess: () => {
      toast.success("Bussiness owner created successfully!");
      queryClient.invalidateQueries({ queryKey: ["owner"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create bussiness owner!"
      );
    },
  });
};

export const useSuspendBussinessOwnerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      SuspendBussinessOwnerService(id, reason),
    onSuccess: () => {
      toast.success("Bussiness owner suspended successfully!");
      queryClient.invalidateQueries({ queryKey: ["owner"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to suspend bussiness owner!"
      );
    },
  });
};
