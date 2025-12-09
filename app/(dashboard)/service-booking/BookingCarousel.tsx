"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import BookingDetailsCard from "./BookingDetailsCard";

interface BookingCard {
  bookingId: string;
  photos: { url: string }[];
  createdAt: string;
  title: string;
  categories: { id: string; name: string }[];
  city: string;
  time: string;
  creator: {
    name: string;
    photoURL: string;
  };
  priceType: string;
  price: string;
  status?: string;
}

interface BookingCarouselProps {
  bookingCards: BookingCard[];
}

export default function BookingCarousel({ bookingCards }: BookingCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: false,
    skipSnaps: false,
    slidesToScroll: 1,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slidesInView, setSlidesInView] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const updateCarouselState = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setSlidesInView(emblaApi.slidesInView());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateCarouselState();
    emblaApi.on("select", updateCarouselState);
    emblaApi.on("reInit", updateCarouselState);
    emblaApi.on("scroll", updateCarouselState);
    return () => {
      emblaApi.off("select", updateCarouselState);
      emblaApi.off("reInit", updateCarouselState);
      emblaApi.off("scroll", updateCarouselState);
    };
  }, [emblaApi, updateCarouselState]);

  // Determine slide state based on visible slides - center the middle one
  const getSlideState = (index: number) => {
    if (slidesInView.length === 0) {
      // Fallback for initial render
      if (index === 0) return "center";
      if (index === 1) return "side";
      return "hidden";
    }

    // Find the center slide from visible slides
    const centerPosition = Math.floor(slidesInView.length / 2);
    const centerSlideIndex = slidesInView[centerPosition];

    if (index === centerSlideIndex) return "center";
    if (slidesInView.includes(index)) return "side";
    return "hidden";
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">
        Booking Details ({bookingCards.length})
      </h3>

      <div className="relative px-12">
        {/* Previous Button */}
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black-400 border border-black-200 flex items-center justify-center text-white hover:bg-black-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Carousel Container */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {bookingCards.map((card, index) => {
              const slideState = getSlideState(index);
              return (
                <div
                  key={`${card.bookingId}-${index}`}
                  className="flex-[0_0_33.333%] min-w-0 px-2 transition-all duration-300 ease-out"
                  style={{
                    transform:
                      slideState === "center"
                        ? "scale(1.05)"
                        : slideState === "side"
                          ? "scale(0.9)"
                          : "scale(0.85)",
                    opacity:
                      slideState === "center"
                        ? 1
                        : slideState === "side"
                          ? 0.7
                          : 0.5,
                    zIndex: slideState === "center" ? 10 : 1,
                  }}
                >
                  <BookingDetailsCard
                    photos={card.photos}
                    createdAt={card.createdAt}
                    title={card.title}
                    categories={card.categories}
                    city={card.city}
                    time={card.time}
                    creator={card.creator}
                    priceType={card.priceType}
                    price={card.price}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black-400 border border-black-200 flex items-center justify-center text-white hover:bg-black-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots Indicator */}
      {bookingCards.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {bookingCards.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "bg-white w-6"
                  : "bg-gray-500 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

