"use client";
import { Button } from "@/components/ui/button";
import FiltersBar, { Filter } from "@/components/ui/commonComponent/FiltersBar";
import { Plus, Crown } from "lucide-react";
import React, { useMemo, useState } from "react";
import InfluencersRankCard from "./InfluencersRankCard";
import DeleteConfirmModal from "@/components/ui/commonComponent/DeleteConfirmModal";
import AddRankModal from "./AddRankForm";
import EditRankModal from "./EditRankForm";
import { useDeleteInfluencerRankMutation, useInfluencerRankQuery } from "@/hooks/useInfluencersRankMutations";
import { toast } from 'react-toastify';
import { applyFilters } from "@/lib/filterHelper";


const InfluencersRank = () => {
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string;
  }>({});
  const [search, setSearch] = useState("");
  const [selectedInfluencers, setSelectedInfluencers] = useState<any>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const { data, isLoading, isError } = useInfluencerRankQuery();
  console.log("influencers ranked data", data)
  const { mutate: deleteInfluencersRank, isPending } = useDeleteInfluencerRankMutation();


  const filters: Filter[] = [

    {
      key: "status",
      label: "Status",
      options: ["All", "Active", "Inactive"],
    },
    {
      key: "createdAt",
      label: "Created Date",
      type: "date",
    },
  ];

  const filteredInfluencerRank = useMemo(() => {
    return applyFilters(data, search, selectedFilters, {
      searchKeys: ["title"],
      dateKey: "createdAt",
    });
  }, [data, search, selectedFilters]);
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

  const handleAdd = (data: any) => {
    console.log("New category added:", data);
    // call API here to save new category
  };
  const handleDelete = () => {
    if (!selectedInfluencers?.id) return;

    deleteInfluencersRank(selectedInfluencers.id, {
      onSuccess: () => {
        toast.error("Influencer Rank deleted successfully!")
        setDeleteOpen(false);
        setSelectedInfluencers(null);
      },
    });
  }

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
        {filteredInfluencerRank?.map((influencer: any) => (
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