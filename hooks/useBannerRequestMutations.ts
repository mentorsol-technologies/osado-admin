import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveBanner,
  getBannerById,
  getBannerRequests,
  rejectBanner,
} from "@/services/banners/bannersService";

export const useBannerRequestsQuery = (
  page = 1,
  limit = 10,
  status?: string,
) => {
  return useQuery({
    queryKey: ["bannerRequests", page, limit, status ?? "pending"],
    queryFn: () => getBannerRequests(page, limit, status),
  });
};

export const useBannerQuery = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["banner", id],
    queryFn: () => getBannerById(id),
    enabled: Boolean(id) && enabled,
  });
};

/** Everything a decision touches, invalidated together. */
const invalidateAfterReview = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ["bannerRequests"] });
  queryClient.invalidateQueries({ queryKey: ["banners"] });
  queryClient.invalidateQueries({ queryKey: ["banner"] });
};

export const useApproveBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, price }: { id: string; price?: number }) =>
      approveBanner(id, price),
    onSuccess: () => invalidateAfterReview(queryClient),
  });
};

export const useRejectBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectBanner(id, reason),
    onSuccess: () => invalidateAfterReview(queryClient),
  });
};
