import React from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import BookingCarousel from "./BookingCarousel";
import { useGetProviderDetailsInformationQuery } from "@/hooks/useServiceBookingMutations";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, User, UserX } from "lucide-react";
import { ensureAbsoluteUrl } from "@/lib/utils";

interface ViewProviderDetailsProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  providerId?: string;
}

export default function ViewProviderDetails({
  open,
  setOpen,
  providerId,
}: ViewProviderDetailsProps) {
  const { data: providerDetailsData, isLoading } =
    useGetProviderDetailsInformationQuery(providerId || "");

  const bookingsArray = Array.isArray(providerDetailsData)
    ? providerDetailsData
    : [];

  const firstBooking = bookingsArray?.[0];
  const firstDetail = firstBooking?.bookingServiceDetails?.[0];
  const providerUser = firstDetail?.providerPortfolio?.user || null;

  const bookingCards = bookingsArray.flatMap(
    (booking: any) =>
      booking?.bookingServiceDetails?.map((detail: any) => {
        const portfolio = detail.providerPortfolio;
        const pkg = detail.providerPackage;
        // The customer who actually made the booking - not the provider.
        // The endpoint used to omit this and this fell back to
        // portfolio?.user (the provider), which showed the provider's own
        // name/photo under a "Client" badge on every card.
        const customer = booking?.user;

        return {
          photos:
            pkg?.providerPackageImages?.map((img: any) => ({ url: img.url })) ||
            portfolio?.portfolioImages?.map((img: any) => ({ url: img.url })) ||
            [],
          createdAt: booking?.bookingDate || "",
          title: pkg?.packageName || portfolio?.caseTitle || "Service",
          categories:
            pkg?.providerPackagesCategories?.map((cat: any) => ({
              id: cat.id,
              name: cat.name,
            })) || [],
          city: booking?.city || customer?.city || "",
          time: booking?.bookingTime || "",
          creator: {
            name: customer?.name || "Unknown Client",
            photoURL: customer?.profileImage || "",
          },
          priceType: "KWD",
          price: pkg?.customPrice || pkg?.minPrice || "--",
          status: booking?.status,
          bookingId: booking?.id,
        };
      }) || []
  );

  const socialLinks = [
    { name: "Website", url: providerUser?.websiteUrl },
    { name: "Instagram", url: providerUser?.instagramUrl },
    { name: "TikTok", url: providerUser?.tiktokUrl },
    { name: "Facebook", url: providerUser?.facebookUrl },
    { name: "Snapchat", url: providerUser?.snapchatUrl },
  ];

  return (
    <Modal open={open} onOpenChange={setOpen} title="" size="xl">
      <div className="p-6 text-white space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : bookingsArray.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <UserX className="w-10 h-10 text-gray-500" />
            <p className="text-gray-400">No provider details found</p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={providerUser?.profileImage} alt={providerUser?.name || "Provider"} />
                <AvatarFallback>
                  {providerUser?.name ? (
                    providerUser.name[0].toUpperCase()
                  ) : (
                    <User className="h-8 w-8" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">
                  {providerUser?.name || "Unknown Provider"}
                </h2>
                <p className="text-sm text-gray-400">Service Provider</p>
              </div>
            </div>

            {/* INFO GRID */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <p>Total Bookings</p>
                <p className="font-medium">{bookingsArray.length}</p>
              </div>

              {providerUser?.city && (
                <div className="flex justify-between">
                  <p> Location</p>
                  <p className="font-medium">
                    {providerUser?.city}
                    {providerUser?.state && providerUser.state !== "string"
                      ? `, ${providerUser.state}`
                      : ""}
                  </p>
                </div>
              )}
              <div className="flex justify-between">
                <p>Status</p>
                <p className="font-medium capitalize">
                  {bookingsArray?.[0]?.status ?? "--"}
                </p>
              </div>
            </div>
            <hr className="border-gray-700" />

            {/* BIO */}
            {providerUser?.bio && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Bio</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {providerUser.bio}
                </p>
              </div>
            )}

            {/* CONTACT */}
            <div className="flex gap-10 flex-wrap">
              {providerUser?.email && (
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">{providerUser.email}</p>
                </div>
              )}
              {providerUser?.phoneNumber && (
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white">{providerUser.phoneNumber}</p>
                </div>
              )}
            </div>

            {/* SOCIAL ICONS */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {socialLinks.map((link) => {
                  const url = ensureAbsoluteUrl(link.url);
                  return (
                    <Button
                      key={link.name}
                      disabled={!url}
                      onClick={() => {
                        if (url) window.open(url, "_blank");
                      }}
                    >
                      {link.name}
                    </Button>
                  );
                })}
              </div>
            )}
            <hr className="border-gray-700" />

            {/* BOOKING DETAILS CAROUSEL */}
            {bookingCards.length > 0 && (
              <BookingCarousel bookingCards={bookingCards} />
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
