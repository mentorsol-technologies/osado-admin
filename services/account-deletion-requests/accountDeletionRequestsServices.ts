import api from "@/lib/axios";

export const getAccountDeletionRequests = async () => {
  const response = await api.get("/account-deletion-requests", {
    params: { limit: 100 },
  });
  return response.data;
};

export const getAccountDeletionRequestDetails = async (id: string) => {
  const response = await api.get(`/account-deletion-requests/${id}`);
  return response as any;
};

export const approveAccountDeletionRequest = async (id: string) => {
  const response = await api.patch(`/account-deletion-requests/${id}/approve`, {});
  return response as any;
};

export const rejectAccountDeletionRequest = async (
  id: string,
  rejectionReason: string,
) => {
  const response = await api.patch(`/account-deletion-requests/${id}/reject`, {
    rejectionReason,
  });
  return response as any;
};
