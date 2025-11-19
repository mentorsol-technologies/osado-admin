"use client";

import Image from "next/image";
import { Shield, ArrowRight } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { useBusinessOwnerInfoQuery, useSuspendBussinessMutation } from "@/hooks/useEventManagementMutations";
import { useState } from "react";
import SuspendedEventModal from "./SuspendEventModal";

interface Props {
    ownerId: string;
    open: boolean;
    onOpenChange: (v: boolean) => void;
}

export default function BusinessOwnerDetailsModal({
    ownerId,
    open,
    onOpenChange,
}: Props) {
    const { data, isLoading } = useBusinessOwnerInfoQuery(ownerId);
    const { mutate: suspendOwner } = useSuspendBussinessMutation()
    const [suspendOpen, setSuspendOpen] = useState(false);

    const user = data?.user;
    const events = data?.eventsInfo;

    const handleSuspendSubmit = (reason: string) => {
        if (!events?.creator?.id || !reason) return;

        suspendOwner(
            {
                id: events.creator.id,
                data: { reason },
            },
            {
                onSuccess: () => {
                    setSuspendOpen(false);
                    onOpenChange(false);
                },
            }
        );
    };

    return (
        <>
            <Modal
                open={open}
                onOpenChange={onOpenChange}
                title="Business Owner"
                size="xl"
            >
                {isLoading ? (
                    <p className="text-white text-center py-10">Loading...</p>
                ) : (
                    <div className="text-white">

                        {/* Profile Section */}
                        <div className="flex flex-col items-center">
                            <Image
                                src={user?.photoURL || "/images/event-default.png"}
                                width={90}
                                height={90}
                                alt="profile"
                                className="rounded-full object-cover"
                            />

                            <h2 className="text-[24px] font-semibold mt-3">
                                {user?.name} {user?.surName}
                            </h2>

                            <p className="text-sm text-gray-300">ID: {user?.id}</p>
                        </div>

                        {/* Info Grid */}
                        <div className="mt-10 space-y-4 text-[15px]">
                            {/* Email */}
                            <div className="flex justify-between">
                                <p className="text-gray-300 w-1/3">Email</p>
                                <p className="w-2/3 text-right">{user?.email}</p>
                            </div>

                            {/* Phone */}
                            <div className="flex justify-between">
                                <p className="text-gray-300 w-1/3">Phone number</p>
                                <p className="w-2/3 text-right">
                                    {user?.callingCode} {user?.phoneNumber}
                                </p>
                            </div>

                            {/* Registration Date */}
                            <div className="flex justify-between">
                                <p className="text-gray-300 w-1/3">Registration Date</p>
                                <p className="w-2/3 text-right">
                                    {new Date(user?.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Country */}
                            <div className="flex justify-between">
                                <p className="text-gray-300 w-1/3">Country</p>
                                <p className="w-2/3 text-right">{user?.city || "—"}</p>
                            </div>

                            {/* Status */}
                            <div className="flex justify-between">
                                <p className="text-gray-300 w-1/3">Status</p>
                                <p className="w-2/3 text-right text-green-400 font-medium capitalize">
                                    {user?.status}
                                </p>
                            </div>
                        </div>


                        {/* KYC Status */}
                        {/* <div className="mt-8 flex items-center gap-3">
                        <div className="bg-red-700 p-3 rounded-lg">
                            <Shield size={22} className="text-white" />
                        </div>
                        <div>
                            <p className="text-white font-semibold">Approved</p>
                            <p className="text-gray-400 text-sm">KYC Status</p>
                        </div>
                    </div> */}

                        {/* Events Info */}
                        <div className="mt-10">
                            <div className="flex justify-between items-center">
                                <h3 className="text-[18px] font-semibold">Events Info</h3>

                                <button className="flex items-center gap-1 text-red-400 text-sm">
                                    View all <ArrowRight size={16} />
                                </button>
                            </div>

                            <div className="grid grid-cols-4 mt-4 text-center">
                                <div>
                                    <p className="text-sm">Total</p>
                                    <p className="text-[20px] font-semibold">{events?.totalEvents}</p>
                                </div>

                                <div>
                                    <p className="text-sm">Active</p>
                                    <p className="text-[20px] font-semibold">{events?.activeEvents}</p>
                                </div>

                                <div>
                                    <p className="text-sm">Completed</p>
                                    <p className="text-[20px] font-semibold">{events?.liveEvents}</p>
                                </div>

                                <div>
                                    <p className="text-sm">Cancelled</p>
                                    <p className="text-[20px] font-semibold">{events?.cancelled}</p>
                                </div>
                            </div>
                        </div>

                        {/* Dispute History */}
                        <div className="mt-10">
                            <h3 className="text-[18px] font-semibold">Disputes History</h3>
                            <p className="text-gray-400 mt-2">
                                No disputes raised against this owner
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="mt-12 flex justify-between gap-4">
                            <Button className="flex-1">
                                Chat
                            </Button>

                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setSuspendOpen(true)}
                            >
                                Suspend
                            </Button>

                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => onOpenChange(false)}
                            >
                                Back
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
            <SuspendedEventModal
                open={suspendOpen}
                setOpen={setSuspendOpen}
                onSave={handleSuspendSubmit}
            />
        </>

    );
}
