"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/ui/customeSelect";
import { toast } from "react-toastify";
import { useSuspendAccountMutation } from "@/hooks/useReportManagementMutations";

interface SuspendUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (data: { duration: string; reason: string }) => void;
    reportId: string;
}

export default function SuspendUserModal({
    open,
    onOpenChange,
    onConfirm,
    reportId,
}: SuspendUserModalProps) {
    const [duration, setDuration] = useState("");
    const [reason, setReason] = useState("");


    const { mutate: suspendAccount, isPending } = useSuspendAccountMutation();

    const handleConfirm = () => {
        if (!duration || !reason) {
            toast.error("Please select a duration and provide a reason.");
            return;
        }
        suspendAccount(
            { id: reportId, payload: { duration, suspendedReason: reason } },
            {
                onSuccess: () => {
                    toast.success("User suspended successfully");
                    onConfirm({ duration, reason });
                    onOpenChange(false);
                },
                onError: (error: any) => {
                    toast.error(error?.response?.data?.message || "Failed to suspend user");
                },
            }
        );
    };

    return (
        <>
            <Modal
                open={open}
                onOpenChange={onOpenChange}
                title="Suspend User Account"
                description="Are you sure you want to suspend this user’s account? Please select the suspension duration below."
                size="lg"
                footer={
                    <div className="flex justify-between gap-4 w-full mt-4">
                        <Button
                            className="flex-1"
                            onClick={handleConfirm}
                            disabled={isPending}
                        >
                            {isPending ? "Suspending..." : "Confirm Suspension"}
                        </Button>

                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                        >
                            Close
                        </Button>
                    </div>
                }
            >
                {/* Suspension Duration */}
                <div className="flex flex-col gap-2">
                    <label className="text-white text-[16px]">Suspension Duration</label>
                    <CustomSelect
                        placeholder="Select duration"
                        options={[
                            "24 hours",
                            "3 days",
                            "7 days",
                            "30 days",
                            "Permanent Ban",
                        ]}
                        onChange={(value) => setDuration(value)}
                    />
                </div>

                {/* Reason */}
                <div className="flex flex-col gap-2 mt-4">
                    <label className="text-white text-[16px]">Reason for Suspension</label>
                    <Textarea
                        placeholder="Add a note for internal reference..."
                        className="bg-black-300 text-white border border-gray-700 rounded-lg min-h-[130px] resize-none"
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>
            </Modal>
        </>
    );
}
