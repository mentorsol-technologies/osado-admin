import api from "@/lib/axios";

export const getWithdrawalRequests = async () => {
  const response = await api.get("/withdrawal-requests");
  return response.data;
};

export const markWithdrawalRequestPaid = async (id: string, transactionId: string) => {
  const response = await api.patch(`/withdrawal-requests/${id}/mark-paid`, { transactionId });
  return response;
};

export const rejectWithdrawalRequest = async (id: string, reason: string) => {
  const response = await api.patch(`/withdrawal-requests/${id}/reject`, { reason });
  return response;
};
