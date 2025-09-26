"use client";
import { Button } from "@/components/ui/button";
import FiltersBar from "@/components/ui/commonComponent/FiltersBar";
import { Flag, Plus } from "lucide-react";
import React, { useState } from "react";
import CountryCard from "./CountryCard";
import DeleteConfirmModal from "@/components/ui/commonComponent/DeleteConfirmModal";
import EditCountryModal from "./EditCountryForm";

const Countries = () => {
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string;
  }>({});
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

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
  const handleDelete = () => {
    console.log("Country deleted:", selectedCountry);
  };

  const countries = [
    {
      icon: Flag,
      title: "United States",
      id: "32456",
      createdDate: "12/03/2024",
      activeEvents: 1,
      status: "Active",
    },
    {
      icon: Flag,
      title: "United States",
      id: "32456",
      createdDate: "12/03/2024",
      activeEvents: 1,
      status: "Active",
    },
  ];
  return (
    <div className="p-6 bg-black-500 !min-h-[calc(100vh-120px)]  rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="lg:text-3xl text-xl  font-medium text-white">Countries</h2>
        <Button leftIcon={<Plus size={18} />}>
          <span className="hidden md:inline">Add Country</span>
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
        {countries.map((country) => (
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
