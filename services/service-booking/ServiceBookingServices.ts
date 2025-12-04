import api from "@/lib/axios";

export const ServiceBookingList = async () => {
  const response = await api.get("/admin-bookings");
  return response.data;
};

export const CreateServiceBooking = async (data: any) => {
  const response = await api.post("/admin-bookings/create", data);
  return response.data;
};

export const PopulatedBookingDetails = async (id: string) => {
  const response = await api.get(`/admin-bookings/${id}`);
  return response.data;
};
export const UpdateServiceBooking = async (id: string, data: any) => {
  const response = await api.patch(`/admin-bookings/${id}`, data);
  return response.data;
};

export const ViewServiceBookingDetails = async (id: string) => {
  const response = await api.get(`/admin-bookings/${id}`);
  return response.data;
};

export const GetServicesName = async (id: string) => {
  const response = await api.get(
    `/provider-portfolio/user/${id}/portfolios-with-packages`
  );
  return response as any;
};

export const GetServiceProviderList = async ({
  searchQuery = "",
  bookingDate,
  bookingTime,
  page = 1,
  limit = 5,
}: {
  searchQuery?: string;
  bookingDate?: string;
  bookingTime?: string;
  page?: number;
  limit?: number;
}) => {
  const params = new URLSearchParams({
    searchQuery,
    page: page.toString(),
    limit: limit.toString(),
  });

  if (bookingDate) params.append("bookingDate", bookingDate);
  if (bookingTime) params.append("bookingTime", bookingTime);

  const response = await api.get(
    `/admin-bookings/service-providers?${params.toString()}`
  );
  return response as any;
};

export const GetServiceUsersList = async ({
  searchQuery = "",
  page = 1,
  limit = 5,
}: {
  searchQuery?: string;
  page?: number;
  limit?: number;
}) => {
  const params = new URLSearchParams({
    searchQuery,
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await api.get(`/admin-bookings/users?${params.toString()}`);

  return response.data;
};

export const SuspendBookingService = async (id: string, reason: string) => {
  const response = await api.patch(`/admin-bookings/${id}/suspend`, {
    reason,
  });
  return response.data;
};
