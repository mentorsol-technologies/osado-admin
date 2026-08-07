import { getWalletTransactions } from "@/services/walletTransactions/walletTransactionServices";
import { useQuery } from "@tanstack/react-query";

export const useGetWalletTransactionsQuery = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["wallet-transactions", page, limit],
    queryFn: () => getWalletTransactions(page, limit),
  });
};
