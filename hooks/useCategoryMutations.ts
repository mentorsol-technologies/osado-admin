import { CategoryPayload, createCategory, deleteCategory, getCategories, updateCategory, getCategoryUploadLink } from "@/services/categories/categoriesService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';


export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CategoryPayload) => createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to create category";
      toast.error(message);
    },
  });
};
export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 2, // cache for 2 minutes
  });
};

// ✅ Update Category Mutation
export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: number;
      data: Partial<CategoryPayload>;
    }) => updateCategory(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update category";
      toast.error(message);
    },
  });
};

// ✅ Delete Category Mutation
export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to delete category";
      toast.error(message);
    },
  });
};

export const useUploadCategoryFileMutation = () => {
  return useMutation({
    mutationFn: (file: File) => getCategoryUploadLink(file.type),
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
