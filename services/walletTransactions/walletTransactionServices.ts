import api from "@/lib/axios";

export const getWalletTransactions = async () => {
  const response = await api.get("/wallet/transactions");
  return response.data;
};
