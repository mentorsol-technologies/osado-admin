import api from "@/lib/axios";

export interface CategoryPayload {
  name: string;
  status: string;
  description?: string;
  categoryID?: number;
  iconUrl?: string;
  iconId?: string;
}
// ✅ Get All Categories
export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data; // assuming API returns array of categories
};
export const createCategory = async (data: CategoryPayload) => {
  const response = await api.post("/categories", data);
  return response;
};
// ✅ Update/Edit a category
export const updateCategory = async (
  categoryId: number,
  data: Partial<CategoryPayload>
) => {
  const response = await api.patch(`/categories/${categoryId}`, data);
  return response;
};

// ✅ Delete a category
export const deleteCategory = async (id: number) => {
  const response = await api.delete(`/categories/${id}`);
  return response;
};


// ✅ FIXED VERSION - Direct S3 Upload
export const getCategoryUploadLink = async (fileType: string) => {
  const response = await api.post("/categories/upload-link?linkType=photo", { fileType });
  const data = response.data ?? response;
  if (!data?.url || !data?.fields) throw new Error("Upload link missing URL or fields");
  return data; // { url, fields, uploadId }
};