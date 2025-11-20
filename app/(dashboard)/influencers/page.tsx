"use client";

import DeleteConfirmModal from "@/components/ui/commonComponent/DeleteConfirmModal";
import FiltersBar from "@/components/ui/commonComponent/FiltersBar";
import { useMemo, useState } from "react";
import InfluencerCard from "./InfluencersCard";
import { Award, Crown, Star } from "lucide-react";
import Pagination from "@/components/ui/pagination";
import { useGetUsersListQuery } from "@/hooks/useUsersMutations";
import { applyFilters } from "@/lib/filterHelper";

const InfluencersRank = () => {
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
      options: ["All","Standard", "High-rank", "Elite"],
    },
    {
      key: "location",
      label: "Location",
      options: ["All","USA", "UK", "Canada", "UAE", "Pakistan"],
    },
    {
      key: "status",
      label: "Status",
      options: ["All","Active", "Inactive",],
    },
    {
      key: "sort_by",
      label: "Sort by",
      options: ["All","Newest", "Oldest", "A–Z", "Z–A"],
    },
  ];
  const { data, isLoading } = useGetUsersListQuery();
  console.log("influecers data",data)
  const influencerList = useMemo(() => {
    const users = data || [];
    console.log("userss",users)
    return users.filter((user: any) => user.role?.role === "influencer");
  }, [data]);

  console.log("influencerDataList", influencerList)

  const filteredInfluencers = useMemo(() => {
    return applyFilters(influencerList, search, selectedFilters, {
      searchKeys: ["name", "location", "status"], // searchable fields
      dateKey: "createdAt",
    });
  }, [influencerList, search, selectedFilters]);

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
    console.log("Influencer deleted:", selectedInfluencers);
  };

  return (
    <div className="p-6 bg-black-500 !min-h-[calc(100vh-120px)]  rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="lg:text-3xl text-xl  font-medium text-white">Influencers</h2>
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
        {filteredInfluencers?.map((influencer: any) => (
          <InfluencerCard
            key={influencer.id}
            {...influencer}
            onEdit={() => {
              setSelectedInfluencers(influencer);
              // setEditOpen(true)
            }}
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
        title="Delete Influencer"
        description={`Are you sure you want to delete "${selectedInfluencers?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default InfluencersRank;
