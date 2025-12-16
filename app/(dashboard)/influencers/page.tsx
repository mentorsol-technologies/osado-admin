"use client";

import DeleteConfirmModal from "@/components/ui/commonComponent/DeleteConfirmModal";
import FiltersBar from "@/components/ui/commonComponent/FiltersBar";
import { useMemo, useState } from "react";
import InfluencerCard from "./InfluencersCard";
import { Award, Crown, Star } from "lucide-react";
import Pagination from "@/components/ui/pagination";
import { useGetUsersListQuery } from "@/hooks/useUsersMutations";
import { applyFilters } from "@/lib/filterHelper";
import EditInfluencerModal from "./EditInfluencersModal";
import { Skeleton } from "@/components/ui/skeleton";

const InfluencersRank = () => {
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string;
  }>({});
  const [search, setSearch] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [selectedInfluencers, setSelectedInfluencers] = useState<any>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const filters = [
    {
      key: "title",
      label: "Rank",
      options: ["All", "Standard", "High-rank", "Elite"],
    },
    {
      key: "status",
      label: "Status",
      options: ["All", "Active", "Inactive"],
    },
    {
      key: "sort_by",
      label: "Sort by",
      options: ["All", "Newest", "Oldest", "A–Z", "Z–A"],
    },
  ];
  const { data, isLoading } = useGetUsersListQuery();
  const influencerList = useMemo(() => {
    const users = data || [];
    return users.filter((user: any) => user.role?.role === "influencer");
  }, [data]);

  const filteredInfluencers = useMemo(() => {
    return applyFilters(influencerList, search, selectedFilters, {
      searchKeys: ["name", "location", "status"],
      dateKey: "createdAt",
    });
  }, [influencerList, search, selectedFilters]);

  const handleFilterChange = (key: string, value: string) => {
    setSelectedFilters((prev) => {
      const updated =
        prev[key] === value || value === "All" || value === ""
          ? (() => {
              const copy = { ...prev };
              delete copy[key];
              return copy;
            })()
          : { ...prev, [key]: value };

      return updated;
    });

    setCurrentPage(1);
  };
  const totalPages = Math.ceil(filteredInfluencers.length / pageSize);

  const paginatedInfluencers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredInfluencers.slice(start, end);
  }, [filteredInfluencers, currentPage]);

  const handleDelete = () => {
    console.log("Influencer deleted:", selectedInfluencers);
  };

  return (
    <div className="p-6 bg-black-500 min-h-[calc(100vh-120px)] rounded-lg flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="lg:text-3xl text-xl  font-medium text-white">
          Influencers
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
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
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
        ) : filteredInfluencers?.length ? (
          paginatedInfluencers.map((influencer: any) => (
            <InfluencerCard
              key={influencer.id}
              {...influencer}
              onEdit={() => {
                setSelectedInfluencers(influencer);
                setEditOpen(true);
              }}
              onDelete={() => {
                setSelectedInfluencers(influencer);
                setDeleteOpen(true);
              }}
            />
          ))
        ) : (
          <p className="text-white text-center col-span-full">
            No influencers found.
          </p>
        )}
      </div>
      <div className="mt-auto pt-8">
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
        description={`Are you sure you want to delete "${selectedInfluencers?.name}"? This action cannot be undone.`}
      />
      {/* Edit Provider Modal */}
      <EditInfluencerModal
        open={editOpen}
        setOpen={setEditOpen}
        influencerData={selectedInfluencers}
        onUpdate={(updatedData) => {
          console.log("Updated Provider:", updatedData);
        }}
      />
    </div>
  );
};

export default InfluencersRank;
