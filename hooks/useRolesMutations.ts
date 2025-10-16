import { getRoles } from "@/services/roles/rolesService";
import { useQuery } from "@tanstack/react-query";



export const useRolesQuery = () => {
    return useQuery({
        queryKey: ["roles"],
        queryFn: getRoles,
        staleTime: 1000 * 60 * 2,
    });
};
