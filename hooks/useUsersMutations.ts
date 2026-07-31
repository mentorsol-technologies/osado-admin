import {
  getCurrentUser,
  deleteInfluencer,
  deleteServiceProvider,
  getUsersList,
  getUserUploadLink,
  updateInfluencerServiceProvider,
  updateUserStatus,
} from "@/services/users/userServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useGetUsersListQuery = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsersList,
  });
};

export const useGetCurrentUserQuery = () => {
  return useQuery({
    queryKey: ["currentUsers"],
    queryFn: getCurrentUser,
  });
};

export const useUploadUsersFileMutation = () => {
  return useMutation({
    mutationFn: (file: File) => getUserUploadLink(file.type),
    onSuccess: (result) => {
      return result;
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "File upload failed!";
      toast.error(message);
    },
  });
};

export const useUpdateInfluencerServiceProviderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: any }) =>
      updateInfluencerServiceProvider(id, data),

    onSuccess: () => {
      toast.success("User updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Update failed!";
      toast.error(message);
    },
  });
};

export const useDeleteInfluencerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInfluencer(id),
    onSuccess: () => {
      toast.success("Influencer deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to delete influencer!";
      toast.error(message);
    },
  });
};

export const useDeleteServiceProviderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteServiceProvider(id),
    onSuccess: () => {
      toast.success("Service provider deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to delete service provider!";
      toast.error(message);
    },
  });
};

export const useUpdateUserStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateUserStatus(id, status),
    onSuccess: () => {
      toast.success("User status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update user status!";
      toast.error(message);
    },
  });
};
