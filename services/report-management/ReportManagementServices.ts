import api from "@/lib/axios";

export const getReportMangementList = async (page = 1, limit = 10) => {
  return await api.get("/reports/admin/list", { params: { page, limit } });
};

export const reportSendWarning = async (id: string) => {
  const response = await api.patch(`/reports/${id}/send-warning`);
  return response.data;
};

export const reportResolved = async (id: string, adminNotes: string) => {
  return api.patch(`/reports/${id}/resolve`, { adminNotes });
};

// DISMISS
export const reportDismissal = async (id: string, adminNotes: string) => {
  return api.patch(`/reports/${id}/dismiss`, { adminNotes });
};

export const SuspendAccount = async (
  id: string,
  payload: { duration: string; suspendedReason: string }
) => {
  const response = await api.patch(`/reports/${id}/suspend-account`, payload);
  return response.data;
};

// Freezes the conversation between the reporter and the reported user. Both
// accounts stay active - only this chat stops accepting new messages.
export const SuspendChat = async (
  id: string,
  payload: { reason: string }
) => {
  const response = await api.patch(`/reports/${id}/suspend-chat`, payload);
  return response.data;
};
