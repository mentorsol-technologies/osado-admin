import {
    createCountry,
    updateCountry,
    deleteCountry,
    getCountries,
    getCountryUploadLink,
} from "@/services/country/countryService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


// get All countries
export const useCountryQuery = () => {
    return useQuery({
        queryKey: ["countries"],
        queryFn: getCountries,
        staleTime: 1000 * 60 * 2, // cache for 2 minutes
    });
};


// ✅ Create Country Mutation
export const useCreateCountryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCountry,
        onSuccess: () => {
            toast.success("Country created successfully!");
            queryClient.invalidateQueries({ queryKey: ["countries"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to create country!");
        },
    });
};

// ✅ Update Country Mutation
export const useUpdateCountryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ countryId, data }: { countryId: string; data: any }) => {
            const response = await updateCountry(countryId, data);
            return response;
        },
        onSuccess: () => {
            toast.success("Country updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["countries"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update country!");
        },
    });
};

// ✅ Delete Country Mutation
export const useDeleteCountryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCountry,
        onSuccess: () => {
            toast.success("Country deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["countries"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to delete country!");
        },
    });
};

export const useUploadCountryFileMutation = () => {
    return useMutation({
        mutationFn: (file: File) => getCountryUploadLink(file.type),
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

