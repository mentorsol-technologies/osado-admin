import { createBanner, deleteBanner, getBanner, getBannerUploadLink, suspendedBanner, updateBanner } from "@/services/banners/bannersService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";


//  Fetch all Sub Admins
export const useGetBannersQuery = (page = 1, limit = 6, searchQuery?: string) => {
    return useQuery({
        queryKey: ["banners", page, limit, searchQuery],
        queryFn: () => getBanner(page, limit, searchQuery),
    });
};

// A banner that came from a business-owner request can appear on both "All
// Banners" (["banners"]) and the "Requests" review queue/detail (
// ["bannerRequests"]/["banner"]) - every mutation that changes a banner
// needs to invalidate all three, or one of those screens just keeps showing
// stale data until a full reload.
const invalidateBannerQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
    queryClient.invalidateQueries({ queryKey: ["banners"] });
    queryClient.invalidateQueries({ queryKey: ["bannerRequests"] });
    queryClient.invalidateQueries({ queryKey: ["banner"] });
};

//  Create Sub Admin
export const useCreateBannersMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBanner,
        onSuccess: () => {
            toast.success("Banner created successfully!");
            invalidateBannerQueries(queryClient);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to create banner");
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
            toast.success("Banner updated successfully!");
            invalidateBannerQueries(queryClient);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update banner");
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
            invalidateBannerQueries(queryClient);
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
            toast.success("Banner deleted successfully!");
            invalidateBannerQueries(queryClient);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to delete banner");
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