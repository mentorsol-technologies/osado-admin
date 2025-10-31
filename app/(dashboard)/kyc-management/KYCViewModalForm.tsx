"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import { useGetKYCDetailsQuery, useUpdateKycStatusMutation } from "@/hooks/useKycManagementMutations";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { capitalizeFirstLetter } from "@/lib/utils";

interface KYCViewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    kyc?: {
        id: string;
        userId: string;
        user: {
            name: string;
            phone: string | number;
            photoURL?: string;
        };
        dateOfBirth: string;
        gender: string;
        avatar_url?: string;
        frontDocumentURL?: string;
        backDocumentURL?: string;
    };
    onApprove?: () => void;
    onReject?: () => void;
}

export default function KYCViewModal({
    open,
    onOpenChange,
    kyc,
    onApprove,
    onReject,
}: KYCViewModalProps) {
    const { register, getValues } = useForm();
    const { data: KycDetails, isLoading } = useGetKYCDetailsQuery(kyc?.id || "");
    const { mutate: updateStatus, isPending } = useUpdateKycStatusMutation();


    if (!kyc) return null;

    const handleAction = (status: "approved" | "rejected") => {
        const reason = getValues("description") || "";
        const payload = {
            userId: kyc.userId,
            status,
            adminNotes: reason,
        };

        updateStatus(payload);
        onOpenChange(false);
    };

    const data = {
        id: kyc.id || "—",
        name: `${kyc?.user?.name || ""}`.trim() || "—",
        phone: kyc?.user?.phone || "_",
        gender: kyc.gender || "—",
        dateOfBirth: kyc?.dateOfBirth || "_",
        avatarUrl: kyc.user?.photoURL || "https://i.pravatar.cc/150?img=3",
        idFront:
            kyc?.frontDocumentURL ||
            "/images/image 3.png",
        idBack:
            kyc.backDocumentURL ||
            "/images/image 4.png",
    };

    return (
        <Modal open={open} onOpenChange={onOpenChange} title="KYC Details" footer={
            <div className="flex flex-col sm:flex-row gap-3 pt-3 w-full">
                <Button
                    onClick={() => handleAction("approved")}
                    disabled={isPending}
                    className="flex-1"
                >
                    {isPending ? "Approving..." : "Approve"}
                </Button>
                <Button
                    onClick={() => handleAction("rejected")}
                    disabled={isPending}
                    variant="outline"
                    className="flex-1"
                >
                    {isPending ? "Rejecting..." : "Reject"}
                </Button>
            </div>}>
            <div className=" rounded-2xl text-white px-6 py-6 space-y-6  max-h-[70vh] overflow-y-auto">

                {/* Profile Section */}
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                        <Image
                            src={data.avatarUrl}
                            alt={data.name}
                            width={80}
                            height={80}
                            className="object-cover"
                        />
                    </div>
                    <h3 className="mt-3 text-lg font-semibold">{data.name}</h3>
                    <p className="text-sm text-gray-300">ID: {data.id}</p>
                </div>

                {/* Info Section */}
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-white-100">DOB</span>
                        <span>{data.dateOfBirth}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white-100">Phone</span>
                        <span>{data.phone}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white-100">Gender</span>
                        <span>{capitalizeFirstLetter(data?.gender)}</span>
                    </div>
                </div>

                {/* ID Images */}
                <div>
                    <p className="font-medium mb-3">ID Images</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg overflow-hidden border border-gray-700">
                            <Image
                                src={data.idFront}
                                alt="ID Front"
                                width={200}
                                height={120}
                                className="object-cover w-full"
                            />
                        </div>
                        <div className="rounded-lg overflow-hidden border border-gray-700">
                            <Image
                                src={data.idBack}
                                alt="ID Back"
                                width={200}
                                height={120}
                                className="object-cover w-full"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block text-sm mb-1">Reason</label>
                    <Textarea
                        rows={4}
                        placeholder="Write a reason "
                        {...register("description")}
                    />
                </div>
            </div>
        </Modal>
    );
}
