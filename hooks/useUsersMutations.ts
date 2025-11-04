import { getUsersList } from "@/services/users/userServices";
import { useQuery } from "@tanstack/react-query";

export const useGetUsersListQuery = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: getUsersList,
    });
};