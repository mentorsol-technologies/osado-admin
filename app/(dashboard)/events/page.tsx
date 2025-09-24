"use client";
import FiltersBar from "@/components/ui/commonComponent/FiltersBar";
import React, { useState } from "react";
import EventCard from "./EventCard";
import EventInfoModal from "./EventInfoModalForm";
import SuspendedEventModal from "./SuspendEventModal";
import EditEventModal from "./EditEventForm";

const EventsManagement = () => {
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string;
  }>({});
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const handleCardClick = (eventData: any) => {
    setSelectedEvent(eventData);
    setOpenModal(true);
  };
  const handleSuspendSubmit = (data: any) => {
    console.log("Suspended Booking Reason:", data);
  };
  const handleEditSave = (data: any) => {
    console.log("Edited Event Data:", data);
    // ✅ Update your events list or send API call here
  };
const filters = [
  {
    key: "sort_by",
    label: "Sort by",
    options: ["Newest", "Oldest", "A–Z", "Z–A"], 
  },
  {
    key: "categories",
    label: "Categories",
    options: ["Photography", "Fashion", "Music", "Sports", "Technology"], 
  },
  {
    key: "location",
    label: "Location",
    options: ["USA", "UK", "Canada", "UAE", "Pakistan"],
  },
  {
    key: "date",
    label: "Date",
    options: [
      "Today",
      "This Week",
      "This Month",
      "Last Month",
      "This Year",
    ], 
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
            onClick={() => handleCardClick(event)}
            onEdit={() => {
              setSelectedEvent(event);
              setEditOpen(true); // ✅ open edit modal
            }}
            onSuspend={() => {
              setSelectedEvent(event);
              setSuspendOpen(true);
            }}
          />
        ))}
      </div>
      {/* Event Info Modal */}
      {selectedEvent && (
        <EventInfoModal open={openModal} onOpenChange={setOpenModal} />
      )}
      <SuspendedEventModal
        open={suspendOpen}
        setOpen={setSuspendOpen}
        onSave={handleSuspendSubmit}
      />
      {/* ✅ Edit Modal */}
      {selectedEvent && (
        <EditEventModal
          open={editOpen}
          setOpen={setEditOpen}
          selectedEvent={selectedEvent}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
};

export default EventsManagement;
