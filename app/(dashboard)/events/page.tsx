"use client";
import FiltersBar from "@/components/ui/commonComponent/FiltersBar";
import React, { useState } from "react";
import EventCard from "./EventCard";
import EventInfoModal from "./EventInfoModalForm";
import SuspendedEventModal from "./SuspendEventModal";
import EditEventModal from "./EditEventForm";
import { useGetAllEventsQuery, useSuspendEventMutation } from "@/hooks/useEventManagementMutations";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddEventModal from "./CreateEventForm";

const EventsManagement = () => {

  const { data: eventlist } = useGetAllEventsQuery()
  const { mutate: suspendEvent } = useSuspendEventMutation();

  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string;
  }>({});
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const handleCardClick = (eventData: any) => {
    setSelectedEvent(eventData);
    setOpenModal(true);
  };
  const handleSuspendSubmit = (formData: any) => {
    if (!selectedEvent?.id) return;

    suspendEvent(
      {
        eventId: selectedEvent.id,
        reason: formData.reason,
      },
      {
        onSuccess: () => {
          setSuspendOpen(false);
          setSelectedEvent(null);
        }
      }
    );
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

  return (
    <div className="p-6 bg-black-500 !min-h-[calc(100vh-120px)]  rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="lg:text-3xl text-xl  font-medium text-white">Events Management</h2>
        <Button leftIcon={<Plus size={18} />} className="w-full sm:w-auto order-3 mt-[-1rem] lg:mt-0 sm:order-2"
          onClick={() => setIsAddModalOpen(true)}>
          Add New Event
        </Button>
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
        {eventlist?.data?.map((event: any, idx: any) => (
          <EventCard
            key={idx}
            {...event}
            onClick={() => handleCardClick(event)}
            onEdit={() => {
              setSelectedEvent(event);
              setIsEditModalOpen(true); // ✅ open edit modal
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
        <EventInfoModal
          open={openModal}
          onOpenChange={setOpenModal}
          selectedEvent={selectedEvent}
        />
      )}

      <SuspendedEventModal
        open={suspendOpen}
        setOpen={setSuspendOpen}
        onSave={handleSuspendSubmit}
      />
      <AddEventModal open={isAddModalOpen} setOpen={setIsAddModalOpen} />
      {/* ✅ Edit Modal */}
      <EditEventModal
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        eventData={selectedEvent}
      />
    </div>
  );
};

export default EventsManagement;
