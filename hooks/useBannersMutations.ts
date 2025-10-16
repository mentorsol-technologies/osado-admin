import { createBanner, deleteBanner, getBanner, getBannerUploadLink, suspendedBanner, updateBanner } from "@/services/banners/bannersService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";


//  Fetch all Sub Admins
export const useGetBannersQuery = () => {
    return useQuery({
        queryKey: ["banners"],
        queryFn: getBanner,
    });
};

//  Create Sub Admin
export const useCreateBannersMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBanner,
        onSuccess: () => {
            toast.success("Banners created successfully!");
            queryClient.invalidateQueries({ queryKey: ["banners"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to create Sub Admin");
        },
    });
};

//  Update Sub Admin
export const useUpdateBannersMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            updateBanner(id, data),
        onSuccess: () => {
            toast.success("Banners updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["banners"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update Sub Admin");
        },
    });
};
        export const useSuspendBannerMutation = () => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: ({ id, data }: { id: string | number; data: any }) =>
            suspendedBanner(id, data),
            onSuccess: () => {
            toast.success("Banner suspended successfully!");
            queryClient.invalidateQueries({ queryKey: ["banners"] });
            },
            onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to suspend banner");
            },
        });
        };

//  Delete Sub Admin
export const useDeleteBannersMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string | number) => deleteBanner(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["banners"] });
        },
        onError: (error: any) => {
        },
    });
};
//  upload link for Banner image
export const useUploadBannersFileMutation = () => {
    return useMutation({
        mutationFn: (file: File) => getBannerUploadLink(file.type),
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