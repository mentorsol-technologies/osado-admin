import api from "@/lib/axios";

export const createSubAdmin = async (data: any) => {
  const response = await api.post("/users/create/sub-admin", data);
  return response;
};

export const getCurrentUser = async () => {
  const response = await api.get("/users/me");
  return response;
};

// Get All SubCategories
export const getSubAdmin = async () => {
  const response = await api.get("/users/sub-admin");
  return response.data;
};

// Get All Users
export const getUsersList = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const updateSubAdmin = async (id: string | number, data: any) => {
  const response = await api.patch(`/users/sub-admin/${id}`, data);
  return response;
};

// Delete a SubCategory
export const deleteSubAdmin = async (id: string | number) => {
  const response = await api.delete(`/users/sub-admin/${id}`);
  return response;
};

export const getUserUploadLink = async (fileType: string) => {
  const response = await api.post("/users/profile/upload-link?linkType=photo", {
    fileType,
  });
  const data = response.data ?? response;
  if (!data?.url || !data?.fields)
    throw new Error("Upload link missing URL or fields");
  return data;
};
