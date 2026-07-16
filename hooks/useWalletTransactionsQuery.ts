import { getWalletTransactions } from "@/services/walletTransactions/walletTransactionServices";
import { useQuery } from "@tanstack/react-query";

export const useGetWalletTransactionsQuery = () => {
  return useQuery({
    queryKey: ["wallet-transactions"],
    queryFn: getWalletTransactions,
  });
};
