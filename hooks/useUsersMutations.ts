import {
  getCurrentUser,
  getUsersList,
  getUserUploadLink,
  updateInfluencerServiceProvider,
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
