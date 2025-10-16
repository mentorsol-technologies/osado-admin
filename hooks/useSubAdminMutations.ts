import { createSubAdmin, deleteSubAdmin, getSubAdmin, updateSubAdmin } from "@/services/users/userServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";


// 🔹 Fetch all Sub Admins
export const useGetSubAdminsQuery = () => {
    return useQuery({
        queryKey: ["subAdmins"],
        queryFn: getSubAdmin,
    });
};

// 🔹 Create Sub Admin
export const useCreateSubAdminMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSubAdmin,
        onSuccess: () => {
            toast.success("Sub Admin created successfully!");
            queryClient.invalidateQueries({ queryKey: ["subAdmins"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to create Sub Admin");
        },
    });
};

// 🔹 Update Sub Admin
export const useUpdateSubAdminMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string | number; data: any }) =>
            updateSubAdmin(id, data),
        onSuccess: () => {
            toast.success("Sub Admin updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["subAdmins"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update Sub Admin");
        },
    });
};

// 🔹 Delete Sub Admin
export const useDeleteSubAdminMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string | number) => deleteSubAdmin(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subAdmins"] });
        },
        onError: (error: any) => {
        },
    });
};
