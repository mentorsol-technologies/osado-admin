import {
  getCurrentAdminService,
  getDashboardEventsDataService,
  updateProfileService,
  type UpdateProfilePayload,
} from "@/services/auth-services/authService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuthStore } from "@/app/store/authStore";

export const useCurrentAdminQuery = () => {
  return useQuery({
    queryKey: ["currentAdmin"],
    queryFn: getCurrentAdminService,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetDashboardStatsQuery = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardEventsDataService,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => updateProfileService(data),
    onSuccess: (response) => {
      toast.success("Profile updated successfully!");
      // Invalidate and refetch current admin data
      queryClient.invalidateQueries({ queryKey: ["currentAdmin"] });
      // Update user in auth store if response contains user data
      // Handle both response structures: direct data or nested { data: {...} }
      const userData = response?.data || response;
      if (userData) {
        setUser(userData);
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update profile!",
      );
    },
  });
};
