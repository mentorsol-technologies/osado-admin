import api from "@/lib/axios";



export const getRoles = async (page = 1, limit = 10) => {
    return await api.get("/roles", { params: { page, limit } });
};

export const createRole = async (data: any)=>{
    const response = await api.post("/roles",data);
    return response.data;
}

export const updateRole = async (id: string, data: any) => {
    const response = await api.patch(`/roles/${id}`, data);
    return response.data;
};

export const deleteRole = async (id: string) => {
    const response = await api.delete(`/roles/${id}`);
    return response.data;
};

export const uploadRoleIcon = async (fileType: string) => {
  const response = await api.post("/roles/upload-link?linkType=icon", { fileType });
  const data = response.data ?? response;
  if (!data?.url || !data?.fields) throw new Error("Upload link missing URL or fields");
  return data; 
};