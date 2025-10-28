"use client";
import PaymentsChart from "@/components/charts/PaymentsChart";
import RevenueChart from "@/components/charts/RevenueChart";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Button } from "@/components/ui/button";
import { CommonTable } from "@/components/ui/table/commonTable";
import { Edit, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import { MdOutlineEdit } from "react-icons/md";
import TopProvidersCard from "./TopServiceProviderCard";
import { providers } from "@/lib/constant";
import { useState } from "react";


const columns = [
    { key: "service_provider", label: "Service Provider" },
    { key: "event", label: "Event" },
    { key: "date", label: "Date" },
    { key: "id", label: "ID" },
    { key: "price", label: "Price" },
    {
        key: "category",
        label: "Category",
        render: (row: any) => (
            <span className="rounded bg-gray-700/40 px-2 py-1 text-xs">
                {row.category}
            </span>
        ),
    },
    {
        key: "status",
        label: "Status",
        render: (row: any) => (
            <span
                className={`rounded px-2 py-1 text-xs ${row.status === "Confirmed"
                    ? "text-green-400 border border-green-500/30"
                    : row.status === "Canceled"
                        ? " text-red-400 border border-red-500/30"
                        : " text-blue-400 border border-blue-500/30"
                    }`}
            >
                {row.status}
            </span>
        ),
    },
    {
        key: "actions",
        label: "Actions",
        render: (row: any) => (
            <div className="flex justify-center gap-3">
                <button className="p-1 border border-black-600">
                    <Eye size={16} />
                </button>
                <button className="p-1 border border-black-600">
                    <MdOutlineEdit size={16} />
                </button>
                <button className="p-1 rounded-md  bg-red-600">
                    <Trash2 size={16} />
                </button>
            </div>
        ),
    },
];

const data = [
    {
        service_provider: "John Doe",
        event: "Launch Party",
        date: "2025-09-15",
        id: "EV123",
        price: "$250",
        category: "Music",
        status: "Confirmed",
    },
    {
        service_provider: "Jane Smith",
        event: "Tech Demo",
        date: "2025-09-20",
        id: "EV456",
        price: "$500",
        category: "Tech",
        status: "Pending",
    },
    {
        service_provider: "Waheed",
        event: "Tech Demo",
        date: "2025-09-20",
        id: "EV451",
        price: "$500",
        category: "Technology",
        status: "Canceled",
    },
];
const filters = [
    { key: "month", label: "Month", options: ["January", "February", "March"] },
    {
        key: "status",
        label: "Status",
        options: ["Confirmed", "Pending", "Canceled"],
    },
    {
        key: "date",
        label: "Date",
        options: ["2025-09-15", "2025-09-20"],
    },
    { key: "category", label: "Category", options: ["Music", "Tech", "Sports"] },

];

export default function ServiceAnalytics() {
    const [selectedProvidersAnalytics, setSelectedProvidersAnalytics] = useState<any>(null);
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="lg:text-3xl text-xl font-medium text-white">
                    Service Providers
                </h2>
                <Button
                    leftIcon={
                        <Image
                            src="/images/hugeicons_travel-bag (2).svg"
                            alt="analytics icon"
                            width={18}
                            height={18}
                        />
                    }
                >
                    <span className="hidden md:inline">See Service Providers</span>
                </Button>
            </div>
            <StatsCards />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RevenueChart />
                </div>
                <div>
                    <PaymentsChart />
                </div>
            </div>
            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {providers?.map((provider) => (
                    <TopProvidersCard
                        key={provider.id}
                        {...provider}
                        onEdit={() => setSelectedProvidersAnalytics(provider)}
                        onDelete={() => {
                            setSelectedProvidersAnalytics(provider);
                        }}
                    />
                ))}
            </div>
            <div>
                <CommonTable
                    title="Service Providers Applications"
                    data={data}
                    columns={columns}
                    rowsPerPage={5}
                    filters={filters}
                    searchable
                />
            </div>
        </div>
    );
}
