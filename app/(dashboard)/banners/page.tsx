"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Tags } from "lucide-react";
import CommonInput from "@/components/ui/input";
import { useMemo, useState, useEffect } from "react";
import FiltersBar from "@/components/ui/commonComponent/FiltersBar";
import BannerCard from "./BannerCards";
import DeleteConfirmModal from "@/components/ui/commonComponent/DeleteConfirmModal";
import SuspendedBannerModal from "./SuspendedBannerModal";
import AddPromotionalBannerModal from "./AddPromotionalBannerModal";
import EditPromotionalBannerModal from "./EditPromotionalBannerModal";
import {
  useDeleteBannersMutation,
  useGetBannersQuery,
  useSuspendBannerMutation,
} from "@/hooks/useBannersMutations";
import { toast } from "react-toastify";
import { applyFilters } from "@/lib/filterHelper";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/ui/pagination";

export default function BannersPage() {
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string;
  }>({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBanner, setSelectedBanner] = useState<any>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const { data, isLoading, isError } = useGetBannersQuery();
  const { mutate: deleteBanner, isPending } = useDeleteBannersMutation();
  const { mutate: suspendBanner } = useSuspendBannerMutation();

  const handleAddBanner = (data: any) => {
    console.log("New banner data:", data);
  };
  const handleUpdateBanner = (data: any) => {
    console.log("Updated banner:", data);
  };
  // 👇 handler when suspended booking is submitted
  const handleSuspendSubmit = (reason: string) => {
    if (!selectedBanner?.id) return;

    suspendBanner(
      { id: selectedBanner.id, data: { status: "suspended", reason } },
      {
        onSuccess: () => {
          setSuspendOpen(false);
          setSelectedBanner(null);
        },
        onError: (error: any) => {},
      }
    );
  };

  const handleDelete = () => {
    if (!selectedBanner?.id) return;

    deleteBanner(selectedBanner.id, {
      onSuccess: () => {
        toast.error("Banner deleted Successfully!");
        setDeleteOpen(false);
        setSelectedBanner(null);
      },
    });
  };
  const filters = [
    {
      key: "type",
      label: "Type",
      options: ["Credit", "Debit"],
    },

    {
      key: "status",
      label: "Status",
      options: ["All", "Active", "Inactive", "Suspended"],
    },
    {
      key: "sort_by",
      label: "Sort by",
      options: ["Newest", "Oldest", "A–Z", "Z–A"],
    },
  ];

  const filteredBannerPromotional = useMemo(() => {
    return applyFilters(data, search, selectedFilters, {
      searchKeys: ["bannerTitle"],
      dateKey: "createdAt",
    });
  }, [data, search, selectedFilters]);

  /* -------------------- PAGINATION -------------------- */
  const pageSize = 6;
  const banners = filteredBannerPromotional || [];
  const totalPages = Math.ceil(banners.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedBanners = banners.slice(startIndex, startIndex + pageSize);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedFilters]);

  const handleFilterChange = (key: string, value: string) => {
    setSelectedFilters((prev) => {
      if (prev[key] === value || value === "All" || value === "") {
        const updated = { ...prev };
        delete updated[key]; // clear this filter
        return updated;
      }
      return { ...prev, [key]: value };
    });
  };
  return (
    <div className="p-6 bg-black-500 !min-h-[calc(100vh-120px)] rounded-lg flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h2 className="lg:text-3xl text-xl  font-medium text-white">
          Banners Manager
        </h2>
        <Button
          leftIcon={<Plus size={18} />}
          className="w-full sm:w-auto"
          onClick={() => setAddOpen(true)}
        >
          Add New Banner
        </Button>
      </div>
      <div>
        <FiltersBar
          filters={filters}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          searchable
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
          }}
        />
      </div>
      {/* Render Cards */}
      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-black-400 rounded-xl shadow-md p-4 space-y-4"
                >
                  <Skeleton className="h-32 w-full rounded-lg bg-black-300" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-black-300" />
                    <Skeleton className="h-3 w-1/2 bg-black-300" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full bg-black-300" />
                    <Skeleton className="h-3 w-5/6 bg-black-300" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Skeleton className="h-9 w-full bg-black-300" />
                    <Skeleton className="h-9 w-full bg-black-300" />
                  </div>
                </div>
              ))
            : paginatedBanners?.length ? (
                paginatedBanners.map((banner: any) => (
                  <BannerCard
                    key={banner.id}
                    image={banner.photoURL}
                    bannerTitle={banner.bannerTitle}
                    bannerId={banner.bannerId}
                    startDate={new Date(banner.startDate).toLocaleDateString()}
                    endDate={new Date(banner.endDate).toLocaleDateString()}
                    displayCategories={banner.displayCategories}
                    status={banner.status}
                    onEdit={() => {
                      setSelectedBanner(banner);
                      setEditOpen(true); // 👈 open edit modal
                    }}
                    onSuspend={() => {
                      setSelectedBanner(banner);
                      setSuspendOpen(true);
                    }}
                    onDelete={() => {
                      setSelectedBanner(banner);
                      setDeleteOpen(true);
                    }}
                  />
                ))
              ) : (
                <p className="text-white text-center col-span-full">
                  No banners found.
                </p>
              )}
        </div>
      </div>

      <div className="mt-auto pt-8">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add Promotional Banner Modal */}
      <AddPromotionalBannerModal
        open={addOpen}
        setOpen={setAddOpen}
        onSave={handleAddBanner}
      />
      {/* Edit Banner Modal */}
      <EditPromotionalBannerModal
        open={editOpen}
        setOpen={setEditOpen}
        bannerData={selectedBanner}
        onUpdate={handleUpdateBanner}
      />
      {/* Delete Modal */}
      <DeleteConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete Banner"
        description={`Are you sure you want to delete "${selectedBanner?.bannerTitle}"? This action cannot be undone.`}
      />
      {/* Suspended modal */}
      <SuspendedBannerModal
        open={suspendOpen}
        setOpen={setSuspendOpen}
        onSave={handleSuspendSubmit}
      />
    </div>
  );
}
