import api from "@/lib/axios";

export const getProviderCommission = async (providerId: string) => {
  const response = await api.get(`/provider-commissions/${providerId}`);
  return response;
};

export const setProviderCommission = async (providerId: string, rate: number) => {
  const response = await api.patch(`/provider-commissions/${providerId}`, { rate });
  return response;
};
