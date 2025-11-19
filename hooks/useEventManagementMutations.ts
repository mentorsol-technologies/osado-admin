import { GetAllEventsLIst, UploadEventLink, ViewEventsDetails, getCategories, createEvents, updateEvent, suspendedEvent, deleteEvent, BussinessOwnerInfo,ownerSuspended } from "@/services/event-management/EventManagementServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";



export const useGetAllEventsQuery = () => {
    return useQuery({
        queryKey: ["events"],
        queryFn: GetAllEventsLIst,
    });
};

export const useViewEventDetailsQuery = (id: string) => {
    return useQuery({
        queryKey: ["events", id],
        queryFn: () => ViewEventsDetails(id),
        enabled: !!id,
    });
};

export const useUploadEventFileMutation = () => {
    return useMutation({
        mutationFn: (file: File) => UploadEventLink(file.type),
        onSuccess: (result) => result,
        onError: (error: any) => {
            const message = error?.response?.data?.message || "File upload failed!";
            toast.error(message);
        },
    });
};

export const useCategoriesQuery = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
        staleTime: 1000 * 60 * 2,
    });
};

export const useCreateEventMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => createEvents(data),
        onSuccess: () => {
            toast.success("Event created successfully!");
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to create event");
        },
    });
};

export const useUpdateEventMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            updateEvent(id, data),
        onSuccess: () => {
            toast.success("Event updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update event");
        },
    });
};

export const useSuspendEventMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => suspendedEvent(data),
        onSuccess: () => {
            toast.success("Event suspended successfully!");
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to suspend event");
        },
    });
};

export const useSuspendBussinessMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => ownerSuspended(id,data),
        onSuccess: () => {
            toast.success("Bussiness Owner suspended successfully!");
            queryClient.invalidateQueries({ queryKey: ["business-owner-info"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to suspend bussiness owner");
        },
    });
};

export const useDeleteEventMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string | number) => deleteEvent(id),
        onSuccess: () => {
            toast.success("Event deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to delete event");
        },
    });
};

export const useBusinessOwnerInfoQuery = (id: string) => {
    return useQuery({
        queryKey: ["business-owner-info", id],
        queryFn: () => BussinessOwnerInfo(id),
        enabled: !!id,
    });
};