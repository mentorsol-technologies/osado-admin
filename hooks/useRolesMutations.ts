import { getRoles, createRole, updateRole, deleteRole, uploadRoleIcon } from "@/services/roles/rolesService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";



export const useRolesQuery = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: ["roles", page, limit],
        queryFn: () => getRoles(page, limit),
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
            toast.error(error?.response?.data?.message || "Failed to create role");
        },
    });
};

export const useUpdateRoleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateRole(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update role");
        },
    });
};

export const useDeleteRoleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteRole(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to delete role");
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