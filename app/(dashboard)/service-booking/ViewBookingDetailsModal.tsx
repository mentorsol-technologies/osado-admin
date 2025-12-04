import React from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import BookingDetailsCard from "./BookingDetailsCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ViewProviderDetailsProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function ViewProviderDetails({
  open,
  setOpen,
}: ViewProviderDetailsProps) {
  const dummyData = [
    {
      photos: [{ url: "/images/Ellipse 4.png" }],
      createdAt: "2025-11-25",
      title: "Music Concert",
      categories: [
        { id: "1", name: "Music" },
        { id: "2", name: "Live" },
      ],
      city: "New York",
      time: "18:30",
      creator: {
        name: "John Doe",
        photoURL: "/images/Ellipse 4.png",
      },
      priceType: "USD",
      price: "50",
    },
    {
      photos: [{ url: "/images/Ellipse 4.png" }],
      createdAt: "2025-11-26",
      title: "Art Exhibition",
      categories: [{ id: "3", name: "Art" }],
      city: "Los Angeles",
      time: "14:00",
      creator: {
        name: "Jane Smith",
        photoURL: "/images/Ellipse 4.png",
      },
      priceType: "USD",
      price: "30",
    },
    {
      photos: [{ url: "/images/Ellipse 4.png" }],
      createdAt: "2025-11-26",
      title: "Art Exhibition",
      categories: [{ id: "3", name: "Art" }],
      city: "Los Angeles",
      time: "14:00",
      creator: {
        name: "Jane Smith",
        photoURL: "/images/Ellipse 4.png",
      },
      priceType: "USD",
      price: "30",
    },
    {
      photos: [{ url: "/images/Ellipse 4.png" }],
      createdAt: "2025-11-27",
      title: "Tech Meetup",
      categories: [{ id: "4", name: "Technology" }],
      city: "San Francisco",
      time: "10:00",
      creator: {},
      priceType: "USD",
      price: "Free",
    },
  ];
  return (
    <Modal open={open} onOpenChange={setOpen} title="" size="xl">
      <div className="p-6 text-white space-y-6 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <img
            src="https://randomuser.me/api/portraits/women/30.jpg"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">Emily Carter</h2>
            <p className="text-sm text-gray-400">Professional Photographer</p>
          </div>
        </div>

        {/* INFO GRID */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <p>Member Since</p>
            <p className="font-medium">12/07/2025</p>
          </div>
          <div className="flex justify-between">
            <p>Location</p>
            <p className="font-medium">Paris, France</p>
          </div>
          <div className="flex justify-between">
            <p>Status</p>
            <p className="font-medium">Active</p>
          </div>
        </div>
        <hr />

        {/* BIO */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Bio</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Passionate lifestyle and fashion influencer with over 4 years of
            experience in creating engaging content for global audiences.
            Collaborated with top brands in fashion, beauty, and travel,
            delivering high‑quality visuals and storytelling.
          </p>
        </div>

        {/* CONTACT */}
        <div className="flex gap-10">
          <p>
            <p>Email</p> someemail@gmail.com
          </p>
          <p>
            <p>Phone:</p> +965 5584 9201
          </p>
        </div>

        {/* SOCIAL ICONS */}
        <div className="flex gap-3 flex-wrap">
          {["Instagram", "YouTube", "TikTok", "Snapchat"].map((s) => (
            <Button key={s}>{s}</Button>
          ))}
        </div>
        <hr />

        {/* BOOKING DETAILS */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Booking Details</h3>
          <div className="flex ">
            {dummyData.map((event, index) => (
              <BookingDetailsCard
                photos={event.photos}
                createdAt={event.createdAt}
                title={event.title}
                categories={event.categories}
                city={event.city}
                time={event.time}
                creator={event.creator}
                priceType={event.priceType}
                price={event.price}
                onClick={() => console.log(`Clicked on ${event.title}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
