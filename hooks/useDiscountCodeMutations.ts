import {
  getDiscountCodes,
  createDiscountCode,
  updateDiscountCode,
  deleteDiscountCode,
} from "@/services/discountCodes/discountCodeServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useGetDiscountCodesQuery = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["discount-codes", page, limit],
    queryFn: () => getDiscountCodes(page, limit),
  });
};

export const useCreateDiscountCodeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createDiscountCode(data),
    onSuccess: () => {
      toast.success("Discount code created successfully!");
      queryClient.invalidateQueries({ queryKey: ["discount-codes"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to create discount code!";
      toast.error(message);
    },
  });
};

export const useUpdateDiscountCodeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateDiscountCode(id, data),
    onSuccess: () => {
      toast.success("Discount code updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["discount-codes"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update discount code!";
      toast.error(message);
    },
  });
};

export const useDeleteDiscountCodeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDiscountCode(id),
    onSuccess: () => {
      toast.success("Discount code deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["discount-codes"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to delete discount code!";
      toast.error(message);
    },
  });
};
