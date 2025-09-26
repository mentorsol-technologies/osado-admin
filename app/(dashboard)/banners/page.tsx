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
  const handleAddBanner = (data: any) => {
    console.log("New banner data:", data);
  };
  const handleUpdateBanner = (data: any) => {
    console.log("Updated banner:", data);
  };
  // 👇 handler when suspended booking is submitted
  const handleSuspendSubmit = (data: any) => {
    console.log("Suspended Booking Reason:", data);
  };
  const handleDelete = () => {
    console.log("Banner deleted:", selectedBanner);
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
  const banners = [
    {
      image:
        "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?q=80&w=1000&auto=format&fit=crop", // business people cheers
      title: "Book Your Photographer Today",
      id: "BN-1024",
      startDate: "01/09/2025",
      endDate: "30/09/2025",
      targetAudience: "All the users",
      status: "Active",
    },
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Marathon_Runners.jpg/1024px-Marathon_Runners.jpg",
      title: "Summer Sale – Flat 50% Off",
      id: "BN-1025",
      startDate: "05/09/2025",
      endDate: "25/09/2025",
      targetAudience: "Premium users",
      status: "Pending",
    },
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Party_crowd_KMN_Gang_%E2%80%93_splash%21_Festival_20_%282017%29.jpg/1024px-Party_crowd_KMN_Gang_%E2%80%93_splash%21_Festival_20_%282017%29.jpg",
      title: "Summer Sale – Flat 50% Off",
      id: "BN-1025",
      startDate: "05/09/2025",
      endDate: "25/09/2025",
      targetAudience: "Premium users",
      status: "Pending",
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
        {banners.map((banner) => (
          <BannerCard
            key={banner.id}
            image={banner.image}
            title={banner.title}
            id={banner.id}
            startDate={banner.startDate}
            endDate={banner.endDate}
            targetAudience={banner.targetAudience}
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
        description={`Are you sure you want to delete "${selectedBanner?.title}"? This action cannot be undone.`}
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
