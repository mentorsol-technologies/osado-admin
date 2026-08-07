import api from "@/lib/axios";

export const getWithdrawalRequests = async (page = 1, limit = 10) => {
  return await api.get("/withdrawal-requests", { params: { page, limit } });
};

export const markWithdrawalRequestPaid = async (id: string, transactionId?: string) => {
  const response = await api.patch(`/withdrawal-requests/${id}/mark-paid`, { transactionId });
  return response;
};

export const rejectWithdrawalRequest = async (id: string, reason: string) => {
  const response = await api.patch(`/withdrawal-requests/${id}/reject`, { reason });
  return response;
};
