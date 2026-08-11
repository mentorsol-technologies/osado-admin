import { DeleteKyc, getKYCList, getKycDetails, updateKycStatus } from "@/services/kyc-management/kycManagementServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";



export const useGetKYCListQuery = () => {
    return useQuery({
        queryKey: ["kycList"],
        queryFn: getKYCList,
        staleTime: 1000 * 60 * 2,
    });
};

export const useGetKYCDetailsQuery = (id: string) => {
    return useQuery({
        queryKey: ["kycList", id],
        queryFn: () => getKycDetails(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 2,
    });
};

export const useUpdateKycStatusMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateKycStatus,
        onSuccess: (_data, variables: any) => {
            queryClient.invalidateQueries({ queryKey: ["kycList"] });
            toast.success(
                `KYC ${variables?.status === "rejected" ? "rejected" : "approved"} successfully!`
            );
        },
        onError: (error: any) => {
            const message = Array.isArray(error?.response?.data?.message)
                ? error.response.data.message.join(", ")
                : error?.response?.data?.message || "Failed to update KYC status.";
            toast.error(message);
        },
    });
};

export const useDeleteKycMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string | number) => DeleteKyc(id),
        onSuccess: () => {
            toast.success("KYC record deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["kycList"] });
        },
        onError: () => {
            toast.error("Failed to delete KYC record.");
        },
    });
};