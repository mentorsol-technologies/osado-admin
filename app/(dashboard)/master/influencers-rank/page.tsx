"use client";
import { Button } from "@/components/ui/button";
import FiltersBar from "@/components/ui/commonComponent/FiltersBar";
import { Plus, Crown } from "lucide-react";
import React, { useState } from "react";
import InfluencersRankCard from "./InfluencersRankCard";
import DeleteConfirmModal from "@/components/ui/commonComponent/DeleteConfirmModal";
import AddRankModal from "./AddRankForm";
import EditRankModal from "./EditRankForm";

const InfluencersRank = () => {
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string;
  }>({});
  const [search, setSearch] = useState("");
  const [selectedInfluencers, setSelectedInfluencers] = useState<any>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);

  const filters = [
    {
      key: "status",
      label: "Status",
      options: ["Active", "Inactive", "Pending"],
    },
    {
      key: "create-at",
      label: "Created Date",
      options: ["Active", "Inactive", "Pending"],
    },
  ];

  const handleFilterChange = (key: string, value: string) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  };
  
    const handleAdd = (data: any) => {
      console.log("New category added:", data);
      // call API here to save new category
    };
  const handleDelete = () => {
    console.log("Influencer deleted:", selectedInfluencers);
  };
  const influencers = [
    {
      icon: Crown,
      title: "Standard",
      id: "32456",
      createdDate: "12/03/2024",
      influencersTagged: 112,
      status: "Active",
    },
    {
      icon: Crown,
      title: "High-rank",
      id: "32456",
      createdDate: "12/03/2024",
      influencersTagged: 122,
      status: "Active",
    },
  ];
  return (
    <div className="p-6 bg-black-500 !min-h-[calc(100vh-120px)]  rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="lg:text-3xl text-xl  font-medium text-white">Influencers Rank</h2>
        <Button onClick={() => setAddOpen(true)} leftIcon={<Plus size={18} />}>
          <span className="hidden md:inline">Create Rank</span>
        </Button>
      </div>
      <div className="hidden lg:block">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {influencers.map((influencer) => (
          <InfluencersRankCard
            key={influencer.id}
            {...influencer}
            onEdit={() => {
              setSelectedInfluencers(influencer);
              setEditOpen(true)
            }}
            onDelete={() => {
              setSelectedInfluencers(influencer);
              setDeleteOpen(true);
            }}
          />
        ))}
      </div>
      {/* Add Modal */}
             <AddRankModal
              open={addOpen}
              setOpen={setAddOpen}
              onSave={handleAdd}
            />
            {/* Edit Modal */}
             <EditRankModal
                     open={editOpen}
                     setOpen={setEditOpen}
                     selectedInfluencers={selectedInfluencers}
                     onSave={(data) => console.log("Updated:", data)}
                   />
             {/* Delete Modal */}
      <DeleteConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete Rank"
        description={`Are you sure you want to delete "${selectedInfluencers?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default InfluencersRank;
