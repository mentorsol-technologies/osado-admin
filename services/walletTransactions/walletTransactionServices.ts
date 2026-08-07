import api from "@/lib/axios";

export const getWalletTransactions = async (page = 1, limit = 10) => {
  return await api.get("/wallet/transactions", { params: { page, limit } });
};
