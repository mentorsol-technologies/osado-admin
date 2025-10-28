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
import { useState } from "react";
import FiltersBar from "@/components/ui/commonComponent/FiltersBar";
import BannerCard from "./BannerCards";
import DeleteConfirmModal from "@/components/ui/commonComponent/DeleteConfirmModal";
import SuspendedBannerModal from "./SuspendedBannerModal";
import AddPromotionalBannerModal from "./AddPromotionalBannerModal";
import EditPromotionalBannerModal from "./EditPromotionalBannerModal";
import { useDeleteBannersMutation, useGetBannersQuery, useSuspendBannerMutation } from "@/hooks/useBannersMutations";
import { toast } from "react-toastify";


export default function BannersPage() {
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string;
  }>({});
  const [search, setSearch] = useState("");
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
        onError: (error: any) => {
        },
      }
    );
  };

  const handleDelete = () => {
    if (!selectedBanner?.id) return;

    deleteBanner(selectedBanner.id, {
      onSuccess: () => {
        toast.error("Banner deleted Successfully!")
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
  return (
    <div className="p-6 bg-black-500 !min-h-[calc(100vh-120px)]  rounded-lg">
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
            // reset page if pagination
          }}
        />
      </div>
      {/* Render Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((banner: any) => (
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
        ))}
      </div>

      {/* ✅ Add Promotional Banner Modal */}
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
