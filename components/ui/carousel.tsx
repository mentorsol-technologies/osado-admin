"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParams = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParams[0];
type CarouselPlugin = UseCarouselParams[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextType = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: CarouselApi;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  orientation: "horizontal" | "vertical";
  selectedIndex: number;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextType | null>(null);

function useCarousel() {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error("useCarousel must be used within <Carousel />");
  return ctx;
}

export const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
        align: "center",
        containScroll: "keepSnaps",
      },
      plugins
    );

    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((embla: CarouselApi) => {
      if (!embla) return;
      setSelectedIndex(embla.selectedScrollSnap());
      setCanScrollPrev(embla.canScrollPrev());
      setCanScrollNext(embla.canScrollNext());
    }, []);

    React.useEffect(() => {
      if (!api) return;
      onSelect(api);
      api.on("select", () => onSelect(api));
      api.on("reInit", () => onSelect(api));
    }, [api, onSelect]);

    React.useEffect(() => {
      if (api && setApi) setApi(api);
    }, [api, setApi]);

    const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
    const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          orientation,
          selectedIndex,
          opts,
          plugins,
          setApi,
        }}
      >
        <div
          ref={ref}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

export const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex transition-transform duration-300",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

type CarouselItemProps = React.HTMLAttributes<HTMLDivElement> & {
  // embla slide index stored as a data attribute on the slide
  "data-slide-index"?: number;
};

export const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  (props, ref) => {
    const { orientation, selectedIndex, api } = useCarousel();

    // Find slide index (data attribute) — ensure we only pass a number to indexOf
    const slideIndex = props["data-slide-index"];
    const index =
      typeof slideIndex === "number"
        ? api?.scrollSnapList()?.indexOf(slideIndex)
        : undefined;
    const isActive = typeof index === "number" && index === selectedIndex;

    return (
      <div
        ref={ref}
        data-slide-index={props["data-slide-index"]}
        role="group"
        aria-roledescription="slide"
        className={cn(
          "min-w-0 shrink-0 grow-0 basis-full pl-4 pr-4 transition-all duration-300",
          isActive ? "scale-100 opacity-100" : "scale-75 opacity-60",
          props.className
        )}
        {...props}
      />
    );
  }
);
CarouselItem.displayName = "CarouselItem";

export const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return (
    <Button
      ref={ref}
      variant="secondary"
      size="icon"
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      className={cn(
        "absolute h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white border-none",
        orientation === "horizontal"
          ? "-left-10 top-1/2 -translate-y-1/2"
          : "-top-10 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

export const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return (
    <Button
      ref={ref}
      variant="secondary"
      size="icon"
      disabled={!canScrollNext}
      onClick={scrollNext}
      className={cn(
        "absolute h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white border-none",
        orientation === "horizontal"
          ? "-right-10 top-1/2 -translate-y-1/2"
          : "-bottom-10 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";
