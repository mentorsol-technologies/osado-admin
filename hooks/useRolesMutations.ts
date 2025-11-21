import { getRoles, createRole, uploadRoleIcon } from "@/services/roles/rolesService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";



export const useRolesQuery = () => {
    return useQuery({
        queryKey: ["roles"],
        queryFn: getRoles,
        staleTime: 1000 * 60 * 2,
    });
};

export const useCreateRoleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createRole,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
        onError: (error: any) => {
            console.error("Error creating role:", error);
        },
    });
};

export const useuploadRoleIconMutation = () => {
    return useMutation({
        mutationFn: (file: File) => uploadRoleIcon(file.type),
        onSuccess: (result) => {
            return result
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.message || "File upload failed!";
            toast.error(message);
        },
    });
};