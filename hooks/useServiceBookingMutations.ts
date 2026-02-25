import {
  CreateServiceBooking,
  GetServiceProviderList,
  GetServicesName,
  GetServiceUsersList,
  PopulatedBookingDetails,
  ProviderDetailsInformation,
  ServiceBookingList,
  SuspendBookingService,
  UpdateServiceBooking,
  ViewServiceBookingDetails,
} from "@/services/service-booking/ServiceBookingServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useGetAllServiceBookingListQuery = () => {
  return useQuery({
    queryKey: ["serviceBookings"],
    queryFn: ServiceBookingList,
  });
};
export const useCreateServiceBookingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CreateServiceBooking,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["serviceBookings"] });
    },
    onError: (error: any) => {
      console.error("Error creating Service Booking:", error);
    },
  });
};

export const usePopulatedBookingDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: ["populatedBookingDetails", id],
    queryFn: () => PopulatedBookingDetails(id),
    enabled: !!id, // only fetch if id is provided
    refetchOnWindowFocus: false,
  });
};

export const useUpdateServiceBookingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      UpdateServiceBooking(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["serviceBookings"] });
      queryClient.invalidateQueries({
        queryKey: ["serviceBookingDetails", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["populatedBookingDetails", variables.id],
      });
    },
    onError: (error) => {
      console.error("Error updating Service Booking:", error);
    },
  });
};

export const useGetServiceBookingDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: ["serviceBookingDetails", id],
    queryFn: () => ViewServiceBookingDetails(id),
    enabled: !!id,
  });
};

export const GetServiceListQuery = (id: string) => {
  return useQuery({
    queryKey: ["servicesList", id],
    queryFn: () => GetServicesName(id),
    enabled: !!id,
  });
};

export const useGetServiceProviderListQuery = (
  {
    searchQuery,
    bookingDate,
    bookingTime,
  }: {
    searchQuery?: string;
    bookingDate?: string;
    bookingTime?: string;
  },
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ["serviceProviders", searchQuery, bookingDate, bookingTime],
    queryFn: () =>
      GetServiceProviderList({ searchQuery, bookingDate, bookingTime }),
    enabled,
    refetchOnWindowFocus: false,
  });
};

export const useGetServiceUsersListQuery = (
  {
    searchQuery,
    page,
    limit,
  }: {
    searchQuery?: string;
    page?: number;
    limit?: number;
  },
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ["serviceUsersList", searchQuery, page, limit],
    queryFn: () => GetServiceUsersList({ searchQuery, page, limit }),
    enabled,
    refetchOnWindowFocus: false,
  });
};

export const useSuspendBookingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      SuspendBookingService(id, reason),
    onSuccess: (_, variables) => {
      toast.success("Service Booking suspended successfully!");
      queryClient.invalidateQueries({ queryKey: ["serviceBookings"] });
      queryClient.invalidateQueries({
        queryKey: ["serviceBookingDetails", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["populatedBookingDetails", variables.id],
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to suspend Service Booking!"
      );
    },
  });
};

export const useGetProviderDetailsInformationQuery = (id: string) => {
  return useQuery({
    queryKey: ["providerDetailsInformation", id],
    queryFn: () => ProviderDetailsInformation(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};
