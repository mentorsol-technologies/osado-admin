import api from "@/lib/axios";

export const getKYCList = async () => {
  const response = await api.get("/kyc/list");
  return response as any;
};

export const getKycDetails = async (id: string) => {
  const response = await api.get(`/kyc/${id}`);
  return response.data;
};

export const updateKycStatus = async (data: any) => {
  const response = await api.patch("/kyc/status", data);
  return response;
};

export const DeleteKyc = async (id: string | number) => {
  const { data } = await api.delete(`/kyc/${id}`);
  return data;
};
