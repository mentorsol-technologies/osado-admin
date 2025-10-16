"use client";
import { Button } from "@/components/ui/button";
import FiltersBar from "@/components/ui/commonComponent/FiltersBar";
import { Flag, Plus } from "lucide-react";
import React, { useState } from "react";
import CountryCard from "./CountryCard";
import DeleteConfirmModal from "@/components/ui/commonComponent/DeleteConfirmModal";
import EditCountryModal from "./EditCountryForm";
import AddCountryModal from "./AddCountryForm";
import { useCountryQuery, useDeleteCountryMutation } from "@/hooks/useCountryMutations";
import { toast } from 'react-toastify';

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
  console.log("countries listing", data)


  const filters = [
    { key: "sort-by", label: "Sort by", options: ["Admin", "User", "Manager"] },
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
  const handleAddCountry = (formData: any) => {
    console.log("New Country Added:", formData);
    setAddOpen(false);
    // ✅ You can later replace this with your mutation:
    // createCountryMutation.mutate(formData);
  };
   const handleDelete = () => {
    if (!selectedCountry?.id) return;

    deleteCountry(selectedCountry.id, {
      onSuccess: () => {
        toast.error("Country deleted Successfully !")
        setDeleteOpen(false);
        setSelectedCountry(null);
      },
    });
  }

  return (
    <div className="p-6 bg-black-500 !min-h-[calc(100vh-120px)]  rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="lg:text-3xl text-xl  font-medium text-white">Countries</h2>
        <Button leftIcon={<Plus size={18} />}>
          <span className="hidden md:inline" onClick={() => setAddOpen(true)}>Add Country</span>
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
        {data?.map((country: any) => (
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
      ))}
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
        description={`Are you sure you want to delete "${selectedCountry?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Countries;
