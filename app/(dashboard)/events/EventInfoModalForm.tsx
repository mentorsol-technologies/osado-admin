"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Modal from "@/components/ui/Modal";
import { User, Clock9, Star, Calendar } from "lucide-react";
import weddingPackage from "/public/images/578ac720e49fcbf44cbc003fd2428e7c56e15eb7.png";
import {
  useDeleteEventMutation,
  useViewEventDetailsQuery,
} from "@/hooks/useEventManagementMutations";
import { useState } from "react";
import { formatTime, FormatDate } from "@/lib/utils";
import { getDisplayName, getInitial } from "@/lib/displayName";
import BusinessOwnerDetailsModal from "./BussinessOwnerDetailsForm";
import DeleteConfirmModal from "@/components/ui/commonComponent/DeleteConfirmModal";

interface EventInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEvent: any;
  /**
   * Edit and Suspend reuse the modals the events page already owns rather than
   * duplicating them here - the page closes this dialog and opens its own. Both
   * are optional so any other place rendering this modal keeps working with the
   * buttons simply hidden.
   */
  onEdit?: () => void;
  onSuspend?: () => void;
}

export default function EventInfoModal({
  open,
  onOpenChange,
  selectedEvent,
  onEdit,
  onSuspend,
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

  // Real booked service packages already come back on each invited provider's
  // `invite.providerPackage` - no extra call needed.
  const bookedPackages = appliedInfluencers
    .map((user: any) => user?.invite?.providerPackage)
    .filter(Boolean);

  const handleSeeProfileClick = () => {
    setOwnerModalOpen(true);
  };

  const handleDelete = () => {
    if (!id) return;

    deleteEvent(id, {
      onSuccess: () => {
        setDeleteOpen(false);
        // The event no longer exists, so leaving its detail dialog open would
        // show a stale record - drop back to the (refreshed) list.
        onOpenChange(false);
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
        <div>
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
                {event?.isFree ? "Free" : `${event?.ticketPrice} ${event?.priceType}`}
              </Badge>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-white">Date</p>
                {/* The event's own date - this previously rendered createdAt,
                    making it identical to "Registration Date" below. */}
                <p> {FormatDate(event?.date)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-white">Time</p>
                <p> {formatTime(event?.time)} </p>
              </div>
              {event?.isFree ? (
                <div className="flex justify-between">
                  <p className="text-white">Pricing</p>
                  <p>Free</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <p className="text-white">Ticket Price</p>
                    <p>{event?.ticketPrice} {event?.priceType}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-white">Service Price</p>
                    <p>{event?.servicePrice} {event?.priceType}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-white">Influencer Price</p>
                    <p>{event?.influencerPrice} {event?.priceType}</p>
                  </div>
                </>
              )}
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
                      className="w-auto px-3 py-1 flex items-center gap-1.5"
                    >
                      {/* Not every category has an icon uploaded, so the chip
                          falls back to the name on its own. */}
                      {cat.iconUrl && (
                        <Image
                          src={cat.iconUrl}
                          alt=""
                          width={14}
                          height={14}
                          className="w-3.5 h-3.5 object-contain shrink-0"
                        />
                      )}
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
              {event?.creator?.photoURL ? (
                <Image
                  src={event.creator.photoURL}
                  alt="Organizer"
                  width={40}
                  height={40}
                  className="rounded-full object-cover w-10 h-10"
                />
              ) : (
                // No photo - show an avatar (name initial, or a user icon)
                // instead of a remote random stock photo.
                <div className="w-10 h-10 rounded-full bg-black-300 flex items-center justify-center flex-shrink-0">
                  {getInitial(event?.creator) ? (
                    <span className="text-sm font-semibold text-white uppercase">
                      {getInitial(event?.creator)}
                    </span>
                  ) : (
                    <User size={20} className="text-gray-400" />
                  )}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold">
                  {getDisplayName(event?.creator, "Unknown Organizer")}
                </p>
                <div className="text-purple-600 flex gap-2 items-center">
                  <User size={14} />
                  <p className="text-xs">Organizer</p>
                </div>
                {/* Only shown once the organiser actually has reviews - a
                    hardcoded "0.0 (0)" would read as a bad rating rather than
                    as "not rated yet". */}
                {event?.creator?.totalReviews > 0 && (
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-300">
                    <Star size={13} className="shrink-0 fill-yellow-400 text-yellow-400" />
                    <span>{event.creator.averageRating}</span>
                    <span className="text-gray-500">
                      ({event.creator.totalReviews})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* No Edit here on purpose - editing the event is offered once, in
                the footer. This row is about the organiser. */}
            <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
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
                    name={`${user.name || ""} ${user.surName || ""}`.trim() || "--"}
                    // An influencer who applied has a proposal, not an invite -
                    // reading only the invite date left the card showing
                    // "Applied -" for everyone who applied on their own.
                    date={FormatDate(
                      user?.proposal?.createdAt ?? user?.invite?.createdAt,
                    )}
                    avatar={user.photoURL}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-400">No influencers applied</p>
              )}
            </div>
          </Section>
          {/* Booked Services & Providers - one section holding both the people
              booked and the packages they were booked for, since they describe
              the same booking. The two used to be separate sections, which split
              a provider away from the package they came with. */}
          <Section title="Booked Services & Providers">
            {serviceProviders.length === 0 && bookedPackages.length === 0 ? (
              <p className="text-sm text-gray-400">No services booked</p>
            ) : (
              <div className="flex flex-col gap-4">
                {serviceProviders.length > 0 && (
                  <div className="grid lg:grid-cols-2 gap-4">
                    {serviceProviders.map((user: any) => (
                      <BookedServiceProviderCard
                        key={user.id}
                        name={
                          `${user.name || ""} ${user.surName || ""}`.trim() || "--"
                        }
                        date={FormatDate(
                          user?.invite?.createdAt ?? user?.proposal?.createdAt,
                        )}
                        avatar={user.photoURL}
                      />
                    ))}
                  </div>
                )}

                {bookedPackages.length > 0 && (
                  <div className="grid lg:grid-cols-2 gap-4">
                    {bookedPackages.map((pkg: any) => (
                      <WeddingsCard key={pkg.id} pkg={pkg} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </Section>

          {/* Footer buttons */}
          <div className="mt-6 flex flex-col gap-3">
            {(onEdit || onSuspend) && (
              <div className="flex flex-col sm:flex-row gap-3">
                {onEdit && (
                  <Button
                    className="flex-1"
                    onClick={() => {
                      onOpenChange(false);
                      onEdit();
                    }}
                  >
                    Edit
                  </Button>
                )}
                {onSuspend && (
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => {
                      onOpenChange(false);
                      onSuspend();
                    }}
                  >
                    Suspend
                  </Button>
                )}
              </div>
            )}
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
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      {title && (
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * Avatar that tolerates a missing photo.
 *
 * Accounts created by phone signup often have no photoId at all, so photoURL
 * comes back null - and next/image throws "Cannot read properties of null" when
 * handed a null src, taking the whole modal down. Falls back to the person's
 * initial, then a generic icon, matching how EventCard renders its organizer.
 */
function CardAvatar({ name, avatar }: { name: string; avatar?: string | null }) {
  if (avatar) {
    return (
      <Image
        src={avatar}
        alt={name}
        width={50}
        height={50}
        className="rounded-full object-cover w-10 h-10"
      />
    );
  }

  const initial = name?.trim()?.charAt(0) ?? "";

  return (
    <div className="w-10 h-10 rounded-full bg-black-300 flex items-center justify-center flex-shrink-0">
      {initial && initial !== "-" ? (
        <span className="text-sm font-semibold text-white uppercase">
          {initial}
        </span>
      ) : (
        <User size={18} className="text-gray-400" />
      )}
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
  avatar?: string | null;
}) {
  return (
    <Card className="bg-black-600 text-white">
      <CardHeader className="flex flex-row items-center gap-3">
        <CardAvatar name={name} avatar={avatar} />
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
  avatar?: string | null;
}) {
  return (
    <Card className="bg-black-600 text-white">
      <CardHeader className="flex flex-row items-center gap-3">
        <CardAvatar name={name} avatar={avatar} />
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

function WeddingsCard({ pkg }: { pkg: any }) {
  const image = pkg?.providerPackageImages?.[0]?.url || weddingPackage;
  const price =
    pkg?.customPrice != null
      ? `KWD ${pkg.customPrice}`
      : pkg?.minPrice != null && pkg?.maxPrice != null
        ? `KWD ${pkg.minPrice} - ${pkg.maxPrice}`
        : pkg?.priceRange || "—";

  return (
    <Card className="bg-black-600 border border-muted/20">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Image
            src={image}
            alt={pkg?.packageName || "Package"}
            width={122}
            height={122}
            className="mb-3 rounded-md object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-white">
              {pkg?.packageName || "Package"}
            </p>
            <Badge>{price}</Badge>

            {pkg?.bufferTime && (
              <span className="flex items-center gap-3 mt-1">
                <Clock9 size={14} className=" shrink-0" />
                <span className="text-xs font-thin">{pkg.bufferTime}</span>
              </span>
            )}

            <span className="flex items-center gap-3 mt-1">
              <Star size={14} className=" shrink-0" />
              <span className="text-xs font-thin">
                {pkg?.totalReviews ?? 0} Reviews
              </span>
            </span>
          </div>
        </div>

        {pkg?.packageDescription && (
          <p className="mt-1 text-xs">{pkg.packageDescription}</p>
        )}
      </CardContent>
    </Card>
  );
}
