import api from "@/lib/axios";

export const getSubscriptionPlans = async (page = 1, limit = 10) => {
  return await api.get("/subscription-plans", { params: { page, limit } });
};

export const createSubscriptionPlan = async (data: any) => {
  const response = await api.post("/subscription-plans", data);
  return response;
};

export const updateSubscriptionPlan = async (id: string, data: any) => {
  const response = await api.patch(`/subscription-plans/${id}`, data);
  return response;
};

export const deleteSubscriptionPlan = async (id: string) => {
  const response = await api.delete(`/subscription-plans/${id}`);
  return response;
};
