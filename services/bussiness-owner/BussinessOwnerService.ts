import api from "@/lib/axios";

export const BussinessOwnerService = async () => {
  const response = await api.get("/admin/business-owners");
  return response.data;
};

export const CreateBussinessOwnerService = async (data: any) => {
  const response = await api.post("/admin/business-owners", data);
  return response.data;
};

export const SuspendBussinessOwnerService = async (
  id: string,
  reason: string
) => {
  const response = await api.patch(`/admin/business-owners/${id}`, {
    reason,
  });
  return response.data;
};
