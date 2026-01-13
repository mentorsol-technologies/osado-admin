"use client";

import DeleteConfirmModal from "@/components/ui/commonComponent/DeleteConfirmModal";
import FiltersBar from "@/components/ui/commonComponent/FiltersBar";
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Pagination from "@/components/ui/pagination";
import ProvidersCard from "./ProvidersCard";
import EditServiceProviderModal from "./EditServiceProvidersModal";
import { useGetUsersListQuery } from "@/hooks/useUsersMutations";
import { applyFilters } from "@/lib/filterHelper";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

const ServiceProviders = () => {
  const router = useRouter();

  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string;
  }>({});
  const [search, setSearch] = useState("");
  const [selectedProviders, setSelectedProviders] = useState<any>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 8;

  const filters = [
    {
      key: "status",
      label: "Status",
      options: ["All", "Active", "Inactive", "Pending"],
    },
    {
      key: "sort_by",
      label: "Sort by",
      options: ["All", "Newest", "Oldest", "A–Z", "Z–A"],
    },
  ];

  const { data, isLoading } = useGetUsersListQuery();

  const serviceProviderList = useMemo(() => {
    const users = data || [];
    return users.filter((user: any) => user.role?.role === "service_provider");
  }, [data]);

  // Apply filters & search
  const filteredServiceProviders = useMemo(() => {
    return applyFilters(serviceProviderList, search, selectedFilters, {
      searchKeys: ["name", "location", "status"],
      dateKey: "createdAt",
    });
  }, [serviceProviderList, search, selectedFilters]);

  // Reset page to 1 whenever filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedFilters]);

  // Paginate filtered results
  const totalPages = Math.ceil(filteredServiceProviders.length / pageSize);

  const paginatedServiceProviders = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredServiceProviders.slice(startIndex, startIndex + pageSize);
  }, [filteredServiceProviders, currentPage]);

  const handleFilterChange = (key: string, value: string) => {
    setSelectedFilters((prev) => {
      if (prev[key] === value || value === "All" || value === "") {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      }
      return { ...prev, [key]: value };
    });
  };

  const handleDelete = () => {
    console.log("Service Provider deleted:", selectedProviders);
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
            // onClick={handleAnalyticsClick}
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
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-black-400 rounded-2xl shadow-md p-5 space-y-4"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <Skeleton className="w-24 h-24 rounded-full bg-black-300" />
                    <Skeleton className="h-4 w-1/2 bg-black-300" />
                    <div className="w-full space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-1/3 bg-black-300" />
                        <Skeleton className="h-3 w-1/4 bg-black-300" />
                      </div>
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-1/3 bg-black-300" />
                        <Skeleton className="h-3 w-1/4 bg-black-300" />
                      </div>
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-1/3 bg-black-300" />
                        <Skeleton className="h-3 w-1/4 bg-black-300" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full pt-2">
                    <Skeleton className="h-9 w-full bg-black-300" />
                    <Skeleton className="h-9 w-full bg-black-300" />
                  </div>
                </div>
              ))
            : paginatedServiceProviders?.map((provider: any) => (
                <ProvidersCard
                  key={provider.id}
                  {...provider}
                  onEdit={() => {
                    setSelectedProviders(provider);
                    setEditOpen(true);
                  }}
                  onDelete={() => {
                    setSelectedProviders(provider);
                    setDeleteOpen(true);
                  }}
                />
              ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete Service Provider"
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
