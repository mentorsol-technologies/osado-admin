"use client";
import FiltersBar, { Filter } from "@/components/ui/commonComponent/FiltersBar";
import React, { useMemo, useState } from "react";
import EventCard from "./EventCard";
import EventInfoModal from "./EventInfoModalForm";
import SuspendedEventModal from "./SuspendEventModal";
import EditEventModal from "./EditEventForm";
import {
  useGetAllEventsQuery,
  useSuspendEventMutation,
} from "@/hooks/useEventManagementMutations";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddEventModal from "./CreateEventForm";
import { applyFilters } from "@/lib/filterHelper";
import { Skeleton } from "@/components/ui/skeleton";

const EventsManagement = () => {
  const { data: eventlist, isLoading } = useGetAllEventsQuery();
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
        id: selectedEvent.id,
        reason: formData.reason,
      },
      {
        onSuccess: () => {
          setSuspendOpen(false);
          setSelectedEvent(null);
        },
      }
    );
  };
  const handleEditSave = (data: any) => {
    console.log("Edited Event Data:", data);
  };
  const filters: Filter[] = [
    {
      key: "sort_by",
      label: "Sort by",
      options: ["All", "Newest", "Oldest", "A–Z", "Z–A"],
    },
    {
      key: "createdAt",
      label: "Date",
      type: "date",
    },
  ];

  // Apply filters to event list
  const filteredEvents = useMemo(() => {
    const events = eventlist?.data || [];
    return applyFilters(events, search, selectedFilters, {
      searchKeys: ["title", "city"],
      dateKey: "createdAt",
      nameKey: "title",
    });
  }, [eventlist?.data, search, selectedFilters]);

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

  return (
    <div className="p-6 bg-black-500 !min-h-[calc(100vh-120px)]  rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="lg:text-3xl text-xl  font-medium text-white">
          Events Management
        </h2>
        <Button
          leftIcon={<Plus size={18} />}
          className="w-full sm:w-auto order-3 mt-[-1rem] lg:mt-0 sm:order-2"
          onClick={() => setIsAddModalOpen(true)}
        >
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
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-black-400 rounded-xl shadow-md p-4 space-y-4"
            >
              <Skeleton className="h-40 w-full rounded-lg bg-black-300" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 bg-black-300" />
                <Skeleton className="h-3 w-1/2 bg-black-300" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full bg-black-300" />
                <Skeleton className="h-3 w-5/6 bg-black-300" />
              </div>
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-9 w-full bg-black-300" />
                <Skeleton className="h-9 w-full bg-black-300" />
              </div>
            </div>
          ))
        ) : filteredEvents?.length ? (
          filteredEvents.map((event: any, idx: any) => (
            <EventCard
              key={event.id || idx}
              {...event}
              onClick={() => handleCardClick(event)}
              onEdit={() => {
                setSelectedEvent(event);
                setIsEditModalOpen(true);
              }}
              onSuspend={() => {
                setSelectedEvent(event);
                setSuspendOpen(true);
              }}
            />
          ))
        ) : (
          <p className="text-white text-center col-span-full">
            No events found.
          </p>
        )}
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
