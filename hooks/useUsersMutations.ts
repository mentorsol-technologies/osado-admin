import { getCurrentUser, getUsersList } from "@/services/users/userServices";
import { useQuery } from "@tanstack/react-query";

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
