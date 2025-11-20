"use client";

import DeleteConfirmModal from "@/components/ui/commonComponent/DeleteConfirmModal";
import FiltersBar from "@/components/ui/commonComponent/FiltersBar";
import { useState } from "react";
import { Award, Crown, Star } from "lucide-react";
import Pagination from "@/components/ui/pagination";
import InfluencerCard from "../influencers/InfluencersCard";

const Photographers = () => {
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string;
  }>({});
  const [search, setSearch] = useState("");
  const [selectedInfluencers, setSelectedInfluencers] = useState<any>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [page, setPage] = useState(2);

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
    console.log("Influencer deleted:", selectedInfluencers);
  };
  const influencers = [
    {
      id: 1,
      icon: Award,
      title: "Standard",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      name: "Amara Singh",
      rating: 4.4,
      memberSince: "12/07/2025",
      location: "Paris, France",
      status: "Active",
    },
    {
      id: 2,
      icon: Crown,
      title: "Elite",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
      name: "Liam Anderson",
      rating: 4.4,
      memberSince: "22/06/2025",
      location: "Liverpool, England",
      status: "Active",
    },
    {
      id: 3,
      icon: Crown,
      title: "Elite",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      name: "Amara Singh",
      rating: 4.4,
      memberSince: "12/07/2025",
      location: "Paris, France",
      status: "Active",
    },
    {
      id: 4,
      icon: Star,
      title: "High-rank",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
      name: "Liam Anderson",
      rating: 4.4,
      memberSince: "22/06/2025",
      location: "Liverpool, England",
      status: "Active",
    },
  ];

  return (
    <div className="p-6 bg-black-500 !min-h-[calc(100vh-120px)]  rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="lg:text-3xl text-xl  font-medium text-white">
          Photographers
        </h2>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {influencers.map((influencer) => (
          <InfluencerCard
            key={influencer.id}
            {...influencer}
            onEdit={() => {
              setSelectedInfluencers(influencer);
              // setEditOpen(true)
            }}
            createdAt={influencer.memberSince} // map memberSince -> createdAt
            onDelete={() => {
              setSelectedInfluencers(influencer);
              setDeleteOpen(true);
            }}
          />
        ))}
      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete Photographer"
        description={`Are you sure you want to delete "${selectedInfluencers?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Photographers;
