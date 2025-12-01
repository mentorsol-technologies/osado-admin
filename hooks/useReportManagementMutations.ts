import { getReportMangementList, reportDismissal, reportResolved, reportSendWarning } from "@/services/report-management/ReportManagementServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useGetReportManagementListQuery = () => {
    return useQuery({
        queryKey: ["reportManagement"],
        queryFn: getReportMangementList,
        staleTime: 1000 * 60 * 2,
    });
};
export const useSendWarningMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => reportSendWarning(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reportManagement"] });
        },
    });
};

export const useReportResolvedMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, adminNotes }: { id: string; adminNotes: string }) =>
            reportResolved(id, adminNotes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reportManagement"] });
        },
    });
};

export const useReportDismissalMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, adminNotes }: { id: string; adminNotes: string }) =>
            reportDismissal(id, adminNotes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reportManagement"] });
        },
    });
}
