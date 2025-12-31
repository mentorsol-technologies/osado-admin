import api from "@/lib/axios";

export const getReportMangementList = async () => {
  const response = await api.get("/reports/admin/list");
  return response.data;
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
