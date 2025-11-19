import api from "@/lib/axios";


export const ServiceBookingList = async () => {
    const response = await api.get("/admin-bookings");
    return response.data;
};

export const ViewServiceBookingDetails = async (id: string) => {
    const response = await api.get(`/admin-bookings/${id}`);
    console.log("view details", response)
    return response.data;
};