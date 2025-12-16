import {
  getCurrentUser,
  getUsersList,
  getUserUploadLink,
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
    queryKey: ["users"],
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
