"use client";
import { Button } from "@/components/ui/button";
import FiltersBar, { Filter } from "@/components/ui/commonComponent/FiltersBar";
import { Flag, Plus } from "lucide-react";
import React, { useMemo, useState } from "react";
import CountryCard from "./CountryCard";
import DeleteConfirmModal from "@/components/ui/commonComponent/DeleteConfirmModal";
import EditCountryModal from "./EditCountryForm";
import AddCountryModal from "./AddCountryForm";
import {
  useCountryQuery,
  useDeleteCountryMutation,
} from "@/hooks/useCountryMutations";
import { toast } from "react-toastify";
import { applyFilters } from "@/lib/filterHelper";
import { Skeleton } from "@/components/ui/skeleton";

const Countries = () => {
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string;
  }>({});
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const { data, isLoading, isError } = useCountryQuery();
  const { mutate: deleteCountry, isPending } = useDeleteCountryMutation();

  const filters: Filter[] = [
    {
      key: "sort-by",
      label: "Sort by",
      options: ["All", "Newest", "Oldest", "A–Z", "Z–A"],
    },
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
  const filteredCountries = useMemo(() => {
    return applyFilters(data, search, selectedFilters, {
      searchKeys: ["name", "code"],
      dateKey: "createdAt",
    });
  }, [data, search, selectedFilters]);

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

  const handleAddCountry = (formData: any) => {
    console.log("New Country Added:", formData);
    setAddOpen(false);
  };
  const handleDelete = () => {
    if (!selectedCountry?.id) return;

    deleteCountry(selectedCountry.id, {
      onSuccess: () => {
        toast.error("Country deleted Successfully !");
        setDeleteOpen(false);
        setSelectedCountry(null);
      },
    });
  };

  return (
    <div className="p-6 bg-black-500 !min-h-[calc(100vh-120px)]  rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="lg:text-3xl text-xl  font-medium text-white">
          Countries
        </h2>
        <Button leftIcon={<Plus size={18} />}>
          <span className="hidden md:inline" onClick={() => setAddOpen(true)}>
            Add Country
          </span>
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
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-black-400 rounded-xl shadow-md p-4 space-y-4"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-lg bg-black-300" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-black-300" />
                  <Skeleton className="h-3 w-1/2 bg-black-300" />
                </div>
              </div>
              <div className="space-y-2 mt-2">
                <Skeleton className="h-3 w-full bg-black-300" />
                <Skeleton className="h-3 w-5/6 bg-black-300" />
                <Skeleton className="h-3 w-2/3 bg-black-300" />
              </div>
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-9 w-full bg-black-300" />
                <Skeleton className="h-9 w-full bg-black-300" />
              </div>
            </div>
          ))
        ) : filteredCountries?.length ? (
          filteredCountries.map((country: any) => (
            <CountryCard
              key={country.id}
              {...country}
              onEdit={() => {
                setSelectedCountry(country);
                setEditOpen(true);
              }}
              onDelete={() => {
                setSelectedCountry(country);
                setDeleteOpen(true);
              }}
            />
          ))
        ) : (
          <p className="text-white text-center col-span-full">
            No countries found.
          </p>
        )}
      </div>

      {/* Modals */}
      <AddCountryModal
        open={addOpen}
        setOpen={setAddOpen}
        onSave={handleAddCountry}
      />

      <EditCountryModal
        open={editOpen}
        setOpen={setEditOpen}
        selectedCountry={selectedCountry}
        onSave={(data) => console.log("Updated:", data)}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete Country"
        description={`Are you sure you want to delete "${selectedCountry?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Countries;
