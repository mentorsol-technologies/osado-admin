"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useSuspendChatMutation } from "@/hooks/useReportManagementMutations";

interface SuspendChatModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (data: { reason: string }) => void;
    reportId: string;
}

/**
 * Freezes the conversation between the reporter and the reported user.
 *
 * Deliberately has no duration field: unlike an account suspension there is no
 * expiry concept behind this - the chat stays frozen until an admin lifts it -
 * so offering a duration would be a control that does nothing.
 */
export default function SuspendChatModal({
    open,
    onOpenChange,
    onConfirm,
    reportId,
}: SuspendChatModalProps) {
    const [reason, setReason] = useState("");

    const { mutate: suspendChat, isPending } = useSuspendChatMutation();

    // The modal stays mounted between openings, so without this the next report
    // opens with the previous admin's reason still filled in.
    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setReason("");
        }
        onOpenChange(isOpen);
    };

    const handleConfirm = () => {
        if (!reason.trim()) {
            toast.error("Please provide a reason.");
            return;
        }
        suspendChat(
            { id: reportId, payload: { reason: reason.trim() } },
            {
                onSuccess: () => {
                    toast.success("Chat suspended successfully");
                    onConfirm({ reason: reason.trim() });
                    setReason("");
                    onOpenChange(false);
                },
                onError: (error: any) => {
                    toast.error(
                        error?.response?.data?.message || "Failed to suspend chat"
                    );
                },
            }
        );
    };

    return (
        <Modal
            open={open}
            onOpenChange={handleOpenChange}
            title="Suspend Chat"
            description="This stops the two users from messaging each other. Their accounts stay active and every other conversation keeps working."
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
                        onClick={() => handleOpenChange(false)}
                    >
                        Close
                    </Button>
                </div>
            }
        >
            {/* Matches the app's field styling (same radius, border, background
                and purple focus ring as SelectTrigger). This text is sent to the
                reported user in their notification, so the placeholder must not
                suggest it's an internal-only note. */}
            <div className="flex flex-col gap-2">
                <label className="text-white text-[16px]">
                    Reason for Suspension
                </label>
                <Textarea
                    value={reason}
                    placeholder="Explain why this chat is being suspended. The user will see this."
                    className="min-h-[130px] resize-none rounded-[14px] border-black-300 bg-black-500 px-4 py-3 text-sm text-gray-200 placeholder:text-gray-500 transition-colors focus-visible:border-purple-500 focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:ring-offset-0"
                    onChange={(e) => setReason(e.target.value)}
                />
            </div>
        </Modal>
    );
}
