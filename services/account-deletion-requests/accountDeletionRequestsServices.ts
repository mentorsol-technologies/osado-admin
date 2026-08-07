import api from "@/lib/axios";

export const getAccountDeletionRequests = async (page = 1, limit = 10) => {
  return await api.get("/account-deletion-requests", {
    params: { page, limit },
  });
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
