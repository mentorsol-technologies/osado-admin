import api from "@/lib/axios";

export interface SubCategoryPayload {
  name: string;
  status: string;
  nameInArabic?: string;
  description?: string;
  descriptionInArabic?: string;
  subCategoryID?: number;
  iconUrl?: string;
  iconId?: string;
  categoryId?: string; // UUID as per your payload
}

// Create a new SubCategory
export const createSubCategory = async (data: SubCategoryPayload) => {
  const response = await api.post("/sub-categories", data);
  return response;
};

// Get All SubCategories
export const getSubCategories = async () => {
  const response = await api.get("/sub-categories");
  return response.data;
};

// Update/Edit a SubCategory
export const updateSubCategory = async (
  subCategoryId: string | number,
  data: Partial<SubCategoryPayload>
) => {
  const response = await api.patch(`/sub-categories/${subCategoryId}`, data);
  return response;
};

// Delete a SubCategory
export const deleteSubCategory = async (subCategoryId: string | number) => {
  const response = await api.delete(`/sub-categories/${subCategoryId}`);
  return response;
};


export const getSubCategoryUploadLink = async (fileType: string) => {
  const response = await api.post("/sub-categories/upload-link?linkType=photo", { fileType });
  const data = response.data ?? response;
  if (!data?.url || !data?.fields) throw new Error("Upload link missing URL or fields");
  return data; 
};
