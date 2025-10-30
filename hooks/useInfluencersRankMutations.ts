
import { createInfluencersRank, deleteInfluencersRank, getInfluencersRank, getInfluencersRankUploadLink, updateInfluencersRank, } from "@/services/influencers-rank-table/InfluencersRankServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


// get All countries
export const useInfluencerRankQuery = () => {
    return useQuery({
        queryKey: ["influencer-rank"],
        queryFn: getInfluencersRank,
        staleTime: 1000 * 60 * 2,
    });
};


// ✅ Create Country Mutation
export const useCreateInfluencerRankMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createInfluencersRank,
        onSuccess: () => {
            toast.success("Influencers Rank created successfully!");
            queryClient.invalidateQueries({ queryKey: ["influencer-rank"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to create influencer rank table!");
        },
    });
};

// ✅ Update Country Mutation
export const useUpdateInfluencerRankMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ rankId, data }: { rankId: string; data: any }) => {
            const response = await updateInfluencersRank(rankId, data);
            return response;
        },
        onSuccess: () => {
            toast.success("Influencer Rank updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["influencer-rank"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update influencers rank !");
        },
    });
};

// ✅ Delete Country Mutation
export const useDeleteInfluencerRankMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteInfluencersRank,
        onSuccess: () => {
            toast.success("Country deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["influencer-rank"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to delete country!");
        },
    });
};

// ✅ Upload Country File Mutation

export const useUploadInfluencerRankFileMutation = () => {
    return useMutation({
        mutationFn: (file: File) => getInfluencersRankUploadLink(file.type),
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
