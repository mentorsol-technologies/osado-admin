"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useReportDismissalMutation, useReportResolvedMutation, useSendWarningMutation } from "@/hooks/useReportManagementMutations";
import { toast } from "react-toastify";
import StatusReportModal from "@/components/ui/commonComponent/StatusReportModal";
import SuspendChatModal from "./suspendReportManagement";

interface Role {
    id: string;
    role: string;
    roleDescription: string;
    iconId?: string;
    iconURL?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface User {
    name: string;
    role: Role;
    email: string;
}

interface ReportDetails {
    reporterId: string;
    category: string;
    createdAt: string;
    status: string;
    reporter: User;
    reportedUser: User;
    description: string;
    id: string;
}

interface ReportViewModalProps {
    report: ReportDetails | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ReportViewModal: React.FC<ReportViewModalProps> = ({
    report,
    open,
    onOpenChange,
}) => {
    const { mutate: sendWarning, isPending } = useSendWarningMutation();
    const { mutate: resolveReport, isPending: resolving } = useReportResolvedMutation();
    const { mutate: dismissReport, isPending: dismissing } = useReportDismissalMutation();
    const [resolvedModalOpen, setResolvedModalOpen] = useState(false);
    const [dismissedModalOpen, setDismissedModalOpen] = useState(false);
    const [suspendOpen, setSuspendOpen] = useState(false);


    if (!report) return null;

    // Once a report has been actioned to a final outcome there is nothing left
    // to do with it, so the action buttons come off. `pending` and `warning`
    // stay open on purpose - a warning doesn't close the case, the admin can
    // still escalate it to a suspension or resolve/dismiss it afterwards.
    // The backend agrees: suspendUserAccount rejects an already-suspended user
    // with a 400, so offering the button again could only ever fail.
    const status = report.status?.toLowerCase();
    const isClosed =
        status === "suspended" || status === "dismissed" || status === "resolved";

    const handleSendWarning = () => {
        sendWarning(report.id, {
            onSuccess: () => {
                toast.success("Warning sent successfully");
                // Unlike resolve/dismiss there's no follow-up success dialog to
                // land on, so close straight out to the list - the toast is the
                // confirmation and the row's status refreshes behind it.
                onOpenChange(false);
            },
            onError: () => {
                toast.error("Failed to send warning");
            },
        });
    };

    // =============================
    // RESOLVE HANDLER
    // =============================
    const handleResolve = () => {
        resolveReport(
            { id: report.id, adminNotes: "Report has been resolved" },
            {
                onSuccess: () => {
                    setResolvedModalOpen(true);
                    toast.success("Report marked as resolved");
                },
            }
        );
    };

    const handleDismiss = () => {
        dismissReport(
            { id: report.id, adminNotes: "Report has been dismissed" },
            {
                onSuccess: () => {
                    setDismissedModalOpen(true);
                    toast.success("Report dismissed successfully");
                },
            }
        );
    };
    return (
        <>
            <Modal
                open={open}
                onOpenChange={onOpenChange}
                title="Report Info"
                size="lg"
                footer={
                    isClosed ? (
                        <p className="mt-4 w-full text-center text-sm text-gray-400">
                            This report is already {capitalizeFirstLetter(status)} — no
                            further action is available.
                        </p>
                    ) : (
                        <div className="flex items-center gap-4 mt-4 w-full">
                            <Button
                                variant="default"
                                className="flex-1"
                                onClick={() => setSuspendOpen(true)}
                            >
                                Suspend Chat
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={handleDismiss}
                                disabled={dismissing}
                            >
                                {dismissing ? "Dismissing..." : "Dismiss Report"}
                            </Button>
                        </div>
                    )
                }
            >
                <div className="space-y-6 text-white">
                    {/* Report Information */}
                    <div>
                        <h3 className="font-semibold mb-2">Report Information</h3>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 w-40">Category</span>
                                <span>{report.category}</span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 w-40">Date Submitted</span>
                                <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 w-40">Status</span>
                                <span
                                    className={`rounded px-2 py-1 text-xs ${report.status === "resolved"
                                        ? "text-green-400 border border-green-500/30"
                                        : report.status === "dismissed"
                                            ? "text-purple-400 border border-purple-500/30"
                                            : "text-blue-400 border border-blue-500/30"
                                        }`}
                                >
                                    {capitalizeFirstLetter(report.status)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Reporter Details */}
                    <div>
                        <h3 className="font-semibold mb-2">Reporter Details</h3>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 w-40">Name</span>
                                <span>{report.reporter.name}</span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 w-40">Role</span>
                                <span>{report.reporter.role.role}</span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 w-40">Email</span>
                                <span>{report.reporter.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Reported User Details */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold ">Reported User Details</h3>
                            {!isClosed && (
                                <div className=" flex gap-3">
                                    <Button onClick={handleSendWarning} disabled={isPending}>
                                        {isPending ? "Sending..." : "Send Warning"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleResolve}
                                        disabled={resolving}
                                    >
                                        {resolving ? "Resolving..." : "Mark as Resolved"}
                                    </Button>
                                </div>
                            )}
                        </div>



                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 w-40">Name</span>
                                <span>{report.reportedUser.name}</span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 w-40">Role</span>
                                <span>{report.reportedUser.role.role}</span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 w-40">Email</span>
                                <span>{report.reportedUser.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-sm">{report.description}</p>
                    </div>
                </div>

                {/* ==============================
                RESOLVED SUCCESS MODAL
            =============================== */}
                <StatusReportModal
                    open={resolvedModalOpen}
                    onClose={() => setResolvedModalOpen(false)}
                    onViewReport={() => {
                        setResolvedModalOpen(false);
                        onOpenChange(false);
                    }}
                    title="Report Marked as Resolved"
                    description="The report has been successfully marked as resolved."
                />

                {/* ==============================
                DISMISSED SUCCESS MODAL
            =============================== */}
                <StatusReportModal
                    open={dismissedModalOpen}
                    onClose={() => setDismissedModalOpen(false)}
                    onViewReport={() => {
                        setDismissedModalOpen(false);
                        onOpenChange(false);
                    }}
                    title="Report Dismissed"
                    description="The report has been dismissed and no further action will be taken."
                />

            </Modal >
            <SuspendChatModal
                open={suspendOpen}
                onOpenChange={setSuspendOpen}
                onConfirm={() => {
                    // Toast is handled inside SuspendChatModal; closing the
                    // report dialog too lands the admin back on the refreshed
                    // list, same as Send Warning.
                    setSuspendOpen(false);
                    onOpenChange(false);
                }}
                reportId={report?.id || ""}
            />
        </>
    );
};

export default ReportViewModal;
