import { ServiceBookingList, ViewServiceBookingDetails } from "@/services/service-booking/ServiceBookingServices";
import { useQuery } from "@tanstack/react-query";



export const useGetAllServiceBookingListQuery = () => {
    return useQuery({
        queryKey: ["serviceBookings"],
        queryFn: ServiceBookingList,
    });
};

export const useGetServiceBookingDetailsQuery = (id: string) => {
    return useQuery({
        queryKey: ["serviceBookingDetails", id],
        queryFn: () => ViewServiceBookingDetails(id),
        enabled: !!id,
    });
};
