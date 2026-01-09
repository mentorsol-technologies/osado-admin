"use client";

import React, { useRef, useEffect, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { MapPin, Loader2 } from "lucide-react";

const libraries: "places"[] = ["places"];

interface GooglePlacesAutocompleteProps {
  value?: string;
  onChange?: (value: string) => void;
  onPlaceSelect?: (
    place: google.maps.places.PlaceResult & {
      city?: string;
      country?: string;
      lat?: number;
      lng?: number;
    }
  ) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

const GooglePlacesAutocomplete = React.forwardRef<
  HTMLInputElement,
  GooglePlacesAutocompleteProps
>(
  (
    {
      value = "",
      onChange,
      onPlaceSelect,
      placeholder = "Search location...",
      error,
      className = "",
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(
      null
    );
    const [inputValue, setInputValue] = useState(value);
    const [isInitialized, setIsInitialized] = useState(false);

    const onChangeRef = useRef(onChange);
    const onPlaceSelectRef = useRef(onPlaceSelect);

    useEffect(() => {
      onChangeRef.current = onChange;
      onPlaceSelectRef.current = onPlaceSelect;
    }, [onChange, onPlaceSelect]);

    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: "AIzaSyBuOyLOiDw57p8JSKHaaoLxNCqWP_NsRls",
      libraries,
    });

    useEffect(() => {
      setInputValue(value);
    }, [value]);

    useEffect(() => {
      if (!isLoaded || !inputRef.current || isInitialized) return;

      autocompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["geocode", "establishment"],
          fields: [
            "formatted_address",
            "name",
            "geometry",
            "place_id",
            "address_components",
          ],
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();

        if (!place) return;

        const locationName = place.formatted_address || place.name || "";

        let city = "";
        let country = "";
        let lat: number | undefined;
        let lng: number | undefined;

        if (place.address_components) {
          place.address_components.forEach((comp) => {
            if (comp.types.includes("locality")) city = comp.long_name;
            if (comp.types.includes("country")) country = comp.long_name;
          });
        }

        if (place.geometry?.location) {
          lat = place.geometry.location.lat();
          lng = place.geometry.location.lng();
        }

        setInputValue(locationName);
        onChangeRef.current?.(locationName);

        onPlaceSelectRef.current?.({
          ...place,
          city,
          country,
          lat,
          lng,
        });
      });

      setIsInitialized(true);
    }, [isLoaded, isInitialized]);

    // Force high z-index for Google Places Autocomplete dropdown to ensure it's selectable in modals
    useEffect(() => {
      const style = document.createElement("style");
      style.innerHTML = `
        .pac-container {
          z-index: 10000 !important;
          pointer-events: auto !important;
        }
      `;
      document.body.appendChild(style);
      return () => {
        document.body.removeChild(style);
      };
    }, []);

    const setRefs = (element: HTMLInputElement | null) => {
      inputRef.current = element;
      if (typeof ref === "function") ref(element);
      else if (ref) (ref as any).current = element;
    };

    if (loadError) {
      return (
        <div className="text-red-500 text-sm">Error loading Google API</div>
      );
    }

    return (
      <div>
        <div
          className={`flex items-center min-h-[51px] w-full rounded-xl border border-black-300 bg-black-500 px-3 gap-2 ${className}`}
        >
          <MapPin className="text-gray-400 w-5 h-5" />

          {!isLoaded ? (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading...</span>
            </div>
          ) : (
            <input
              ref={setRefs}
              value={inputValue}
              placeholder={placeholder}
              onChange={(e) => {
                setInputValue(e.target.value);
                onChangeRef.current?.(e.target.value);
              }}
              className="w-full bg-transparent outline-none text-white"
            />
          )}
        </div>

        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

GooglePlacesAutocomplete.displayName = "GooglePlacesAutocomplete";
export default GooglePlacesAutocomplete;
