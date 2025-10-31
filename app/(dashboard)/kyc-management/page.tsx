"use client";
import { useState } from "react";
import { CommonTable } from "@/components/ui/table/commonTable";
import { Eye } from "lucide-react";
import { BiStop } from "react-icons/bi";
import KYCViewModal from "./KYCViewModalForm";
import { useDeleteKycMutation, useGetKYCListQuery } from "@/hooks/useKycManagementMutations";
import { capitalizeFirstLetter } from "@/lib/utils";
import DeleteConfirmModal from "@/components/ui/commonComponent/DeleteConfirmModal";

export default function ServiceBookingPage() {
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedKYC, setSelectedKYC] = useState<any>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const { data: kycList, isLoading, isError } = useGetKYCListQuery();
    const { mutate: deleteKyc, isPending } = useDeleteKycMutation();



    const columns = [
        { key: "name", label: "Name" },
        { key: "documentType", label: "Document Type" },
        { key: "nationality", label: "Nationality" },
        {
            key: "status",
            label: "KYC Status",
            render: (row: any) => (
                <span
                    className={`rounded px-2 py-1 text-xs ${row.status === "approved"
                        ? "text-green-400 border border-green-500/30"
                        : row.status === "rejected"
                            ? "text-red-400 border border-red-500/30"
                            : "text-blue-400 border border-blue-500/30"
                        }`}
                >
                    {capitalizeFirstLetter(row.status)}
                </span>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (row: any) => (
                <div className="flex justify-center gap-3">
                    <button
                        className="p-1 border border-gray-600 rounded-md hover:bg-gray-700"
                        onClick={() => {
                            setSelectedKYC(row);
                            setOpenViewModal(true);
                        }}
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => {
                            setSelectedKYC(row);
                            setDeleteOpen(true);
                        }}
                        className="p-1 rounded-md bg-red-600 hover:bg-red-700 text-white"  >
                        <BiStop size={16} />
                    </button>
                </div>
            ),
        },
    ];


    const filters = [
        {
            key: "sort_by",
            label: "Sort by",
            options: ["Newest", "Oldest", "A–Z", "Z–A"],
        },
        {
            key: "kyc_status",
            label: "KYC Status",
            options: ["Approved", "Pending", "Rejected"],
        },
    ];

    const handleApprove = () => {
        console.log("Approved:", selectedKYC);
        setOpenViewModal(false);
    };

    const handleReject = () => {
        console.log("Rejected:", selectedKYC);
        setOpenViewModal(false);
    };

    const handleDelete = () => {
        if (!selectedKYC?.id) return;

        deleteKyc(selectedKYC.id, {
            onSuccess: () => {
                setDeleteOpen(false);
                setSelectedKYC(true);
            },
        });
    };

    return (
        <div className="p-4 bg-black-500 min-h-[calc(100vh-120px)] rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                <h2 className="lg:text-3xl text-xl font-medium text-white">
                    KYC Management
                </h2>
            </div>

            <div className="w-full">
                <CommonTable
                    mobileView="card"
                    data={kycList}
                    columns={columns}
                    rowsPerPage={5}
                    filters={filters}
                    searchable
                />
            </div>

            <KYCViewModal
                open={openViewModal}
                onOpenChange={setOpenViewModal}
                kyc={selectedKYC}
                onApprove={handleApprove}
                onReject={handleReject}
            />
            {/* Delete Modal */}
            <DeleteConfirmModal
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={handleDelete}
                title="Delete KYC "
                description={`Are you sure you want to delete "${selectedKYC?.name}"? This action cannot be undone.`}
            />
        </div>
    );
}
