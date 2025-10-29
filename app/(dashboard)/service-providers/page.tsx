"use client";

import DeleteConfirmModal from "@/components/ui/commonComponent/DeleteConfirmModal";
import FiltersBar from "@/components/ui/commonComponent/FiltersBar";
import { useState } from "react";
import { Award, Crown, Star } from "lucide-react";
import Pagination from "@/components/ui/pagination";
import ProvidersCard from "./ProvidersCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { providers } from "@/lib/constant";
import { useRouter } from "next/navigation";
import EditServiceProviderModal from "./EditServiceProvidersModal";

const ServiceProviders = () => {
    const router = useRouter()
    const [selectedFilters, setSelectedFilters] = useState<{
        [key: string]: string;
    }>({});
    const [search, setSearch] = useState("");
    const [selectedProviders, setSelectedProviders] = useState<any>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;
    const totalPages = Math.ceil(providers.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedProvider = providers.slice(startIndex, startIndex + pageSize);

    const filters = [
        {
            key: "rank",
            label: "Rank",
            options: ["Standard", "High-rank", "Elite"],
        },
        {
            key: "location",
            label: "Location",
            options: ["USA", "UK", "Canada", "UAE", "Pakistan"],
        },
        {
            key: "status",
            label: "Status",
            options: ["Active", "Inactive", "Pending"],
        },
        {
            key: "sort_by",
            label: "Sort by",
            options: ["Newest", "Oldest", "A–Z", "Z–A"],
        },
    ];

    const handleFilterChange = (key: string, value: string) => {
        setSelectedFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleDelete = () => {
        console.log("Influencer deleted:", selectedProviders);
    };
    const handleAnalyticsClick = () => {
        router.push("/service-analytics");
    };


    return (
        <div className="flex flex-col min-h-[calc(100vh-120px)] bg-black-500 p-6 rounded-lg">
            {/* Top Section */}
            <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="lg:text-3xl text-xl font-medium text-white">
                        Service Providers
                    </h2>
                    <Button
                        onClick={handleAnalyticsClick}
                        leftIcon={
                            <Image
                                src="/images/Vector (1).svg"
                                alt="analytics icon"
                                width={18}
                                height={18}
                            />
                        }
                    >
                        <span className="hidden md:inline">See Analytics</span>
                    </Button>
                </div>

                {/* Filters */}
                <FiltersBar
                    filters={filters}
                    selectedFilters={selectedFilters}
                    onFilterChange={handleFilterChange}
                    searchable
                    search={search}
                    onSearchChange={(val) => setSearch(val)}
                />

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    {paginatedProvider?.map((provider) => (
                        <ProvidersCard
                            key={provider.id}
                            {...provider}
                            onEdit={() => {
                                setSelectedProviders(provider);
                                setEditOpen(true);
                            }} onDelete={() => {
                                setSelectedProviders(provider);
                                setDeleteOpen(true);
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Pagination at bottom */}
            <div className="mt-8">
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>

            {/* Delete Modal */}
            <DeleteConfirmModal
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={handleDelete}
                title="Delete Influencer"
                description={`Are you sure you want to delete "${selectedProviders?.title}"? This action cannot be undone.`}
            />
            {/* Edit Provider Modal */}
            <EditServiceProviderModal
                open={editOpen}
                setOpen={setEditOpen}
                providerData={selectedProviders}
                onUpdate={(updatedData) => {
                    console.log("Updated Provider:", updatedData);

                }}
            />
        </div>
    );

};

export default ServiceProviders;
