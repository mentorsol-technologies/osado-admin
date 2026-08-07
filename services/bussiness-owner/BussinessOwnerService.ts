import api from "@/lib/axios";

export const BussinessOwnerService = async (page = 1, limit = 10) => {
  return await api.get("/admin/business-owners", { params: { page, limit } });
};

export const CreateBussinessOwnerService = async (data: any) => {
  const response = await api.post("/admin/business-owners", data);
  return response.data;
};

export const SuspendBussinessOwnerService = async (
  id: string,
  suspendedReason: string,
) => {
  const response = await api.patch(`/admin/business-owners/${id}/suspend`, {
    suspendedReason,
  });
  return response.data;
};
