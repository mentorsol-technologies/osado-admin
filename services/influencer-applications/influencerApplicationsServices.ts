import api from "@/lib/axios";

// Admin: fetch every influencer application (proposal) across events, with an
// optional status filter. The axios interceptor already unwraps response.data,
// so this returns { data, total, page, limit }.
export const GetInfluencerApplications = async ({
  status = "",
  page = 1,
  limit = 100,
}: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (status) params.append("status", status);

  const response = await api.get(
    `/proposals/admin/list-all?${params.toString()}`,
  );
  return response as any;
};
