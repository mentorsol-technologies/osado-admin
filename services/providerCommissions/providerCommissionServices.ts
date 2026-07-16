import api from "@/lib/axios";

export type CommissionType = "BOOKING" | "EVENT";

export const getProviderCommission = async (providerId: string, type: CommissionType) => {
  const response = await api.get(`/provider-commissions/${providerId}`, {
    params: { type },
  });
  return response;
};

export const setProviderCommission = async (
  providerId: string,
  type: CommissionType,
  rate: number,
) => {
  const response = await api.patch(
    `/provider-commissions/${providerId}`,
    { rate },
    { params: { type } },
  );
  return response;
};
