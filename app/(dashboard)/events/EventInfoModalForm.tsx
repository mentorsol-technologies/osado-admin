"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Modal from "@/components/ui/Modal";
import { User, Clock9, Album, Star, Calendar } from "lucide-react";
import weddingPackage from "/public/images/578ac720e49fcbf44cbc003fd2428e7c56e15eb7.png";
import {
  useDeleteEventMutation,
  useViewEventDetailsQuery,
} from "@/hooks/useEventManagementMutations";
import { useState } from "react";
import { formatTime, FormatDate } from "@/lib/utils";
import BusinessOwnerDetailsModal from "./BussinessOwnerDetailsForm";
import DeleteConfirmModal from "@/components/ui/commonComponent/DeleteConfirmModal";

interface EventInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEvent: any;
}

export default function EventInfoModal({
  open,
  onOpenChange,
  selectedEvent,
}: EventInfoModalProps) {
  const id = selectedEvent?.id;
  const { data: eventData, isLoading } = useViewEventDetailsQuery(id);
  const { mutate: deleteEvent, isPending } = useDeleteEventMutation();

  const event = eventData?.event;
  const appliedInfluencers = eventData?.appliedInfluencers || [];
  const photo = event?.photos?.[0]?.url || "/images/event.png";
  const [ownerModalOpen, setOwnerModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const influencerUsers = appliedInfluencers.filter(
    (user: any) => user?.role?.role === "influencer",
  );

  const serviceProviders = appliedInfluencers.filter(
    (user: any) => user?.role?.role === "service_provider",
  );

  const handleSeeProfileClick = () => {
    setOwnerModalOpen(true);
  };

  const handleDelete = () => {
    if (!id) return;

    deleteEvent(id, {
      onSuccess: () => {
        setDeleteOpen(false);
      },
    });
  };

  if (isLoading || !event) {
    return (
      <Modal open={open} onOpenChange={onOpenChange} title="Event Info">
        <p className="p-4 text-white">Loading...</p>
      </Modal>
    );
  }
  return (
    <>
      <Modal open={open} onOpenChange={onOpenChange} title="Event Info">
        <div className="max-h-[80vh] overflow-y-auto pr-2">
          {/* Header image */}
          <div className="relative h-60 w-full overflow-hidden rounded-xl ">
            <Image
              src={photo}
              alt={event?.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Event details */}
          <div className="mt-6 flex flex-col gap-4 text-sm text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {event?.title}
              </h2>
              <Badge>
                {event?.price} {event?.priceType}
              </Badge>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-white">Date</p>
                <p> {FormatDate(event?.createdAt)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-white">Time</p>
                <p> {formatTime(event?.time)} </p>
              </div>
              <div className="flex justify-between gap-2">
                <p className="text-white shrink-0">Location</p>
                <p className="text-white text-right flex-1 break-words">
                  {event?.location}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-white">Registration Date</p>{" "}
                <p>{FormatDate(event?.createdAt)}</p>
              </div>
              <div className="flex justify-between items-center gap-2">
                <p className="text-white">Status</p>
                <Badge>{event?.status}</Badge>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-white">Category</p>
                <div className="mt-1 flex flex-col lg:flex-row flex-wrap gap-2">
                  {event?.categories?.map((cat: any) => (
                    <Badge
                      key={cat.id}
                      variant="secondary"
                      className="w-auto px-3 py-1"
                    >
                      {cat.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Organizer */}
          <div className="mt-6 flex flex-col lg:flex-row items-start lg:items-center justify-between rounded-md w-full gap-4">
            <div className="flex items-center gap-3">
              <Image
                src={
                  event?.creator?.photoURL ||
                  "https://randomuser.me/api/portraits/women/65.jpg"
                }
                alt="Organizer"
                width={40}
                height={40}
                className="rounded-full object-cover w-10 h-10"
              />
              <div>
                <p className="text-sm font-semibold">{event?.creator?.name}</p>
                <div className="text-red-600 flex gap-2 items-center">
                  <User size={14} />
                  <p className="text-xs">Organizer</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
              {/* <Button className="flex-1 lg:flex-none">Edit</Button> */}
              <Button
                variant="outline"
                className="flex-1 lg:flex-none"
                onClick={handleSeeProfileClick}
              >
                See Profile
              </Button>
            </div>
          </div>

          {/* Applied Influencers */}
          <Section title="Applied Influencers">
            <div className="grid lg:grid-cols-2 gap-4">
              {influencerUsers.length > 0 ? (
                influencerUsers.map((user: any) => (
                  <InfluencerCard
                    key={user.id}
                    name={`${user.name} ${user.surName || ""}`}
                    date={FormatDate(user?.invite?.createdAt)}
                    avatar={user.photoURL}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-400">No influencers applied</p>
              )}
            </div>
          </Section>
          {/* Applied Booked Service  */}
          <Section title="Booked Service & Providers">
            <div className="grid lg:grid-cols-2 gap-4">
              {serviceProviders.length > 0 ? (
                serviceProviders.map((user: any) => (
                  <BookedServiceProviderCard
                    key={user.id}
                    name={`${user.name} ${user.surName || ""}`}
                    date={FormatDate(user?.proposal?.createdAt)}
                    avatar={user.photoURL}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-400">
                  No service providers booked
                </p>
              )}
            </div>
          </Section>

          {/* Booked Services */}
          <Section showViewAll={false}>
            <div className="grid lg:grid-cols-2 gap-4">
              <WeddingsCard />
              <WeddingsCard />
            </div>
          </Section>

          {/* Footer buttons */}
          <div className="mt-6 flex flex-col justify-between gap-3">
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => {
                setDeleteOpen(true);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
      <BusinessOwnerDetailsModal
        open={ownerModalOpen}
        onOpenChange={setOwnerModalOpen}
        ownerId={event?.creator?.id}
      />
      <DeleteConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete Event "
        description={`Are you sure you want to delete "${event?.title}"? This action cannot be undone.`}
      />
    </>
  );
}

/* ---------- helpers ---------- */

function Section({
  title,
  children,
  showViewAll = true, // default true
}: {
  title?: string;
  children: React.ReactNode;
  showViewAll?: boolean;
}) {
  return (
    <div className="mt-6">
      {title && (
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {showViewAll && (
            <Button variant="link" className="p-0 text-red-600">
              View all
            </Button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

function InfluencerCard({
  name,
  date,
  avatar,
}: {
  name: string;
  date: string;
  avatar: string;
}) {
  return (
    <Card className="bg-black-600 text-white">
      <CardHeader className="flex flex-row items-center gap-3">
        <Image
          src={avatar}
          alt={name}
          width={50}
          height={50}
          className="rounded-full object-cover w-10 h-10"
        />
        <div>
          <CardTitle className="text-sm font-medium text-white">
            {name}
          </CardTitle>
          <p className="flex items-center gap-1 text-xs text-white">
            <Calendar size={14} className=" shrink-0" />
            Applied {date}
          </p>{" "}
        </div>
      </CardHeader>
    </Card>
  );
}

function BookedServiceProviderCard({
  name,
  date,
  avatar,
}: {
  name: string;
  date: string;
  avatar: string;
}) {
  return (
    <Card className="bg-black-600 text-white">
      <CardHeader className="flex flex-row items-center gap-3">
        <Image
          src={avatar}
          alt={name}
          width={50}
          height={50}
          className="rounded-full w-10 h-10 object-cover"
        />
        <div>
          <CardTitle className="text-sm font-medium text-white">
            {name}
          </CardTitle>
          <p className="flex items-center gap-1 text-xs text-white">
            <Clock9 size={14} className=" shrink-0" />
            Applied {date}
          </p>{" "}
        </div>
      </CardHeader>
    </Card>
  );
}

function WeddingsCard() {
  return (
    <Card className="bg-black-600 border border-muted/20">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Image
            src={weddingPackage}
            alt="Wedding Package"
            width={122}
            height={122}
            className="mb-3 rounded-md object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-white">Wedding Package</p>
            <Badge>KWD 1200</Badge>

            <span className="flex items-center gap-3 mt-1">
              <Clock9 size={14} className=" shrink-0" />
              <span className="text-xs font-thin">8 Hours</span>
            </span>

            <span className="flex items-center gap-3 mt-1">
              <Album size={14} className=" shrink-0" />
              <span className="text-xs font-thin">Edit album, 50 prints</span>
            </span>

            <span className="flex items-center gap-3 mt-1">
              <Star size={14} className=" shrink-0" />
              <span className="text-xs font-thin">34 Reviews</span>
            </span>
          </div>
        </div>

        <p className="mt-1 text-xs">
          Full-day wedding coverage with artistic storytelling. Includes 8 hours
          of shooting, a curated edited album, and 50 premium prints to treasure
          your memories.
        </p>
      </CardContent>
    </Card>
  );
}
