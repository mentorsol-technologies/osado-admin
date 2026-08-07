import api from "@/lib/axios";

export const getDiscountCodes = async (page = 1, limit = 10) => {
  return await api.get("/discount-codes", { params: { page, limit } });
};

export const createDiscountCode = async (data: any) => {
  const response = await api.post("/discount-codes", data);
  return response;
};

export const updateDiscountCode = async (id: string, data: any) => {
  const response = await api.patch(`/discount-codes/${id}`, data);
  return response;
};

export const deleteDiscountCode = async (id: string) => {
  const response = await api.delete(`/discount-codes/${id}`);
  return response;
};
