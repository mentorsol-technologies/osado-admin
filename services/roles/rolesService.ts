import api from "@/lib/axios";



export const getRoles = async () => {
    const response = await api.get("/roles");
    return response.data;
};

export const createRole = async ()=>{
    const response = await api.post("/roles");
    return response.data;
}

export const uploadRoleIcon = async (fileType: string) => {
  const response = await api.post("/roles/upload-link?linkType=icon", { fileType });
  const data = response.data ?? response;
  if (!data?.url || !data?.fields) throw new Error("Upload link missing URL or fields");
  return data; 
};