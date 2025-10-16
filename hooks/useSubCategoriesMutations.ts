
import { SubCategoryPayload, createSubCategory, deleteSubCategory, getSubCategories, updateSubCategory, getSubCategoryUploadLink } from "@/services/sub-categories/subCategoriesService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ✅ Create SubCategory Mutation
export const useCreateSubCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubCategoryPayload) => createSubCategory(payload),
    onSuccess: () => {
      toast.success("Sub-category created successfully!");
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to create sub-category";
      toast.error(message);
    },
  });
};
// ✅ Get Sub-Categories Query
export const useSubCategoriesQuery = () => {
  return useQuery({
    queryKey: ["sub-categories"],
    queryFn: getSubCategories,
    staleTime: 1000 * 60 * 2, // cache for 2 minutes
  });
};

// ✅ Update SubCategory Mutation
export const useUpdateSubCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subCategoryId,
      data,
    }: {
      subCategoryId: string | number;
      data: Partial<SubCategoryPayload>;
    }) => updateSubCategory(subCategoryId, data),
    onSuccess: () => {
      toast.success("Sub-category updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update sub-category";
      toast.error(message);
    },
  });
};

// ✅ Delete SubCategory Mutation
export const useDeleteSubCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subCategoryId: string | number) =>
      deleteSubCategory(subCategoryId),
    onSuccess: () => {
      toast.success("Sub-category deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to delete sub-category";
      toast.error(message);
    },
  });
};

export const useUploadSubCategoryFileMutation = () => {
  return useMutation({
    mutationFn: (file: File) => getSubCategoryUploadLink(file.type),
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "File upload failed!";
      toast.error(message);
    },
  });
};