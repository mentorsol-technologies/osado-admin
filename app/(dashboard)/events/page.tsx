"use client";
import FiltersBar from "@/components/ui/commonComponent/FiltersBar";
import React, { useState } from "react";
import EventCard from "./EventCard";

const EventsManagement = () => {
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string;
  }>({});
  const [search, setSearch] = useState("");
  const filters = [
    {
      key: "sort_by",
      label: "Sort by",
      options: ["Newest", "Oldest", "A–Z", "Z–A"],
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
  const events = [
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Party_crowd_KMN_Gang_%E2%80%93_splash%21_Festival_20_%282017%29.jpg/1024px-Party_crowd_KMN_Gang_%E2%80%93_splash%21_Festival_20_%282017%29.jpg",
      date: "October 3, 2025",
      title: "Brand Launch Party",
      category: "Business & Networking",
      location: "Berlin Convention Center, Germany",
      time: "10:00 AM – 5:00 PM",
      organizer: "Riverfront Events",
      price: "KWD 1200",
    },
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Marathon_Runners.jpg/1024px-Marathon_Runners.jpg",
      date: "October 3, 2025",
      title: "City Marathon 2025",
      category: "Business & Networking",
      location: "Downtown Streets, Chicago",
      time: "10:00 AM – 5:00 PM",
      organizer: "Riverfront Events",
      price: "KWD 1200",
    },
  ];

  return (
    <div className="p-6 bg-black-500 !min-h-[calc(100vh-120px)]  rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Events Management</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map((event, idx) => (
          <EventCard
            key={idx}
            {...event}
            onEdit={() => console.log("Edit:", event.title)}
            onSuspend={() => console.log("Suspend:", event.title)}
          />
        ))}
      </div>
    </div>
  );
};

export default EventsManagement;
