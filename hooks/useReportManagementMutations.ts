import {
  getReportMangementList,
  reportDismissal,
  reportResolved,
  reportSendWarning,
  SuspendAccount,
  SuspendChat,
} from "@/services/report-management/ReportManagementServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetReportManagementListQuery = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["reportManagement", page, limit],
    queryFn: () => getReportMangementList(page, limit),
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
};

export const useSuspendAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { duration: string; suspendedReason: string };
    }) => SuspendAccount(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportManagement"] });
    },
  });
};

export const useSuspendChatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { reason: string } }) =>
      SuspendChat(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportManagement"] });
      // The chat screens render conversation status, so they need to re-read
      // once a conversation has been frozen. Both the list and any open
      // conversation (["chatConversation", id] matches by prefix).
      queryClient.invalidateQueries({ queryKey: ["chatConversations"] });
      queryClient.invalidateQueries({ queryKey: ["chatConversation"] });
    },
  });
};
