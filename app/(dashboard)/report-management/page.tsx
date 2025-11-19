"use client";
import { useState } from "react";
import { CommonTable } from "@/components/ui/table/commonTable";
import { Eye } from "lucide-react";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useGetReportManagementListQuery } from "@/hooks/useReportManagementMutations";
import ReportViewModal from "./ReportViewModal";

export default function ReportManagementPage() {
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [openViewModal, setOpenViewModal] = useState(false);

    const { data, isLoading } = useGetReportManagementListQuery();

    const columns = [
        {
            key: "reporter",
            label: "Reporter",
            render: (row: any) => row.reporter?.name || "-",
        },
        {
            key: "reportedUser",
            label: "Reported User",
            render: (row: any) => row.reportedUser?.name || "-",
        },
        { key: "category", label: "Category" },
        {
            key: "createdAt",
            label: "Date Submitted",
            render: (row: any) =>
                row.createdAt
                    ? new Date(row.createdAt).toLocaleString()
                    : "-",
        },
        {
            key: "status",
            label: "Status",
            render: (row: any) => (
                <span
                    className={`rounded px-2 py-1 text-xs ${row.status === "resolved"
                        ? "text-green-400 border border-green-500/30"
                        : row.status === "dismissed"
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
                            setSelectedReport(row); // set current row to state
                            setOpenViewModal(true); // open modal
                        }}
                    >
                        <Eye size={16} />
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
            sortBy: true,
        },
        {
            key: "status",
            mapTo: "status",
            label: "Status",
            options: ["All", "Resolved", "In Review", "Dismissed"],
        },
    ];

    return (
        <div className="p-4 bg-black-500 min-h-[calc(100vh-120px)] rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                <h2 className="lg:text-3xl text-xl font-medium text-white">
                    Report Management
                </h2>
            </div>

            <div className="w-full">
                <CommonTable
                    mobileView="card"
                    data={data}
                    columns={columns}
                    rowsPerPage={5}
                    filters={filters}
                    searchable
                />
            </div>

            <ReportViewModal
                report={selectedReport}
                open={openViewModal}
                onOpenChange={setOpenViewModal}
            />
        </div>
    );
}
