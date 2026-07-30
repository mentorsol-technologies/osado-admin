"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CommonInput from "@/components/ui/input";
import Modal from "@/components/ui/Modal";
import { toast } from "react-toastify";
import { uploadToS3 } from "@/lib/s3Upload";
import { Badge } from "@/components/ui/badge";
import Upload from "@/components/ui/upload";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadEventLink } from "@/services/event-management/EventManagementServices";
import {
  useCategoriesQuery,
  useCreateEventMutation,
} from "@/hooks/useEventManagementMutations";
import TimeRangePicker from "@/components/ui/commonComponent/TimeRangePicker";
import GooglePlacesAutocomplete from "@/components/ui/GooglePlacesAutocomplete";

// Parses "HH:MM AM/PM" into minutes-since-midnight, mirroring
// TimeRangePicker's own internal comparison logic.
function parseTimeToMinutes(value: string): number | null {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10) % 12;
  if (match[3].toUpperCase() === "PM") hours += 12;
  return hours * 60 + parseInt(match[2], 10);
}

// ✅ 1. Update schema: categoryId is now an array
// An empty <input type="number"> registered with valueAsNumber yields NaN,
// and z.number() rejects NaN ("Expected number, received nan"). Because the
// superRefine's isFree early-return doesn't skip these base rules, a NaN on a
// hidden price field (Free event) fails validation. Normalising NaN to
// undefined lets .optional() pass, while the superRefine still enforces the
// prices when the event isn't free.
const optionalPrice = z.preprocess(
  (v) => (typeof v === "number" && Number.isNaN(v) ? undefined : v),
  z.number().optional()
);

const schema = z
  .object({
    image: z.any().optional(),
    title: z.string().min(1, "Title is required"),
    isFree: z.boolean().optional(),
    isRecommended: z.boolean().optional(),
    ticketPrice: optionalPrice,
    servicePrice: optionalPrice,
    influencerPrice: optionalPrice,
    priceType: z.string().optional(),
    date: z.string().min(1, "Select a date"),
    time: z.string().min(1, "Select a time"),
    country: z.string().min(1, "Select a country"),
    city: z.string().min(1, "Enter a city"),
    location: z.string().min(1, "Enter a location"),
    status: z.string().min(1, "Select a status"),
    categoryId: z.string().array().optional(),
    bio: z.string().min(1, "Bio is required"),
    dressCode: z.string().min(1, "Dress code is required"),
    rules: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isFree) return;
    if (!data.ticketPrice || data.ticketPrice < 1) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Ticket price is required", path: ["ticketPrice"] });
    }
    if (!data.servicePrice || data.servicePrice < 1) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Service price is required", path: ["servicePrice"] });
    }
    if (!data.influencerPrice || data.influencerPrice < 1) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Influencer price is required", path: ["influencerPrice"] });
    }
    if (!data.priceType || !/^[A-Za-z\s]+$/.test(data.priceType)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Price type is required (alphabets only)", path: ["priceType"] });
    }

    // Backstop for the picker's own past-time disabling - catches a stale
    // selection if the date gets changed after a time was already picked.
    const isToday = data.date === new Date().toISOString().slice(0, 10);
    if (isToday) {
      const startStr = data.time.split("-")[0]?.trim();
      const startMinutes = startStr ? parseTimeToMinutes(startStr) : null;
      const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
      if (startMinutes !== null && startMinutes < nowMinutes) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Start time cannot be in the past", path: ["time"] });
      }
    }
  });

type FormData = z.infer<typeof schema>;

interface AddEventModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AddEventModal({ open, setOpen }: AddEventModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { categoryId: [] },
  });

  const { mutate: createEvent, isPending } = useCreateEventMutation();
  const { data } = useCategoriesQuery();

  const [uploadIds, setUploadIds] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // ✅ 2. Fixed toggleCategory logic for arrays
  const toggleCategory = (catId: string) => {
    let updated: string[];

    if (selectedCategories.includes(catId)) {
      updated = selectedCategories.filter((id) => id !== catId);
    } else {
      updated = [...selectedCategories, catId];
    }

    setSelectedCategories(updated);
    setValue("categoryId", updated);
  };

  const handleMultipleFileUpload = async (files: File[]) => {
    try {
      const uploadedIds: string[] = [];

      for (const file of files) {
        const { url, fields, uploadId } = await UploadEventLink(file.type);
        await uploadToS3(file, url, fields);
        uploadedIds.push(uploadId);
      }

      setUploadIds((prev) => [...prev, ...uploadedIds]);
      setValue("image", files);
    } catch (error: any) {
      console.error("File upload failed:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to upload image. Please try a different file."
      );
    }
  };
  const handleResetForm = () => {
    reset({
      title: "",
      isFree: false,
      isRecommended: false,
      ticketPrice: 0,
      servicePrice: 0,
      influencerPrice: 0,
      priceType: "",
      date: "",
      time: "",
      country: "",
      city: "",
      location: "",
      status: "",
      bio: "",
      dressCode: "",
      rules: "",
      categoryId: [],
    });

    setUploadIds([]);
    setSelectedCategories([]);
  };

  // Safety net: if validation blocks submission, surface the first error
  // instead of failing silently (e.g. a hidden/invalid field).
  const onInvalid = (formErrors: typeof errors) => {
    const firstError = Object.values(formErrors)[0] as { message?: string } | undefined;
    toast.error(firstError?.message || "Please fill all required fields correctly.");
  };

  const onSubmit = (data: FormData) => {
    const payload = {
      title: data.title,
      date: data.date,
      time: data.time,
      country: data.country,
      city: data.city,
      location: data.location,
      status: data.status.toUpperCase(),
      photoIds: uploadIds,
      categoryIds: data.categoryId,
      bio: data.bio,
      dressCode: data.dressCode,
      rules: data.rules?.trim() ? data.rules : undefined,
      isFree: data.isFree ?? false,
      isRecommended: data.isRecommended ?? false,
      ticketPrice: data.isFree ? 0 : Number(data.ticketPrice),
      servicePrice: data.isFree ? 0 : Number(data.servicePrice),
      influencerPrice: data.isFree ? 0 : Number(data.influencerPrice),
      priceType: data.isFree ? undefined : data.priceType,
      latitude: String(data.latitude),
      longitude: String(data.longitude),
    };

    console.log("Submitting payload:", payload);

    createEvent(payload, {
      onSuccess: () => {
        toast.success("Event created Successfully !");
        handleResetForm();
        setOpen(false);
      },
      onError: (error: any) => {
        console.error("Event creation failed:", error);
      },
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) handleResetForm();
      }}
      title="Add Event"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={handleSubmit(onSubmit, onInvalid)}
            className="flex-1 bg-brand hover:opacity-90"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit"}
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300"
            onClick={() => {
              handleResetForm();
              setOpen(false);
            }}
          >
            Cancel
          </Button>
        </div>
      }
    >
      <div className="px-2">
        {/* Upload Section */}
        <div className="mb-4">
          <Upload
            label="Upload Images"
            multiple
            onFileSelect={async (files) => {
              if (!files?.length) return;
              await handleMultipleFileUpload(files);
            }}
          />
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Title</label>
          <CommonInput placeholder="Enter title" {...register("title")} />
          {errors.title && (
            <p className="text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>
        {/* Free / Recommended toggles - side by side from lg up */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <Checkbox
            label="Mark event as Free"
            checked={!!watch("isFree")}
            onCheckedChange={(checked) => setValue("isFree", checked as boolean)}
          />
          <Checkbox
            label="Mark event as Recommended"
            checked={!!watch("isRecommended")}
            onCheckedChange={(checked) =>
              setValue("isRecommended", checked as boolean)
            }
          />
        </div>

        {!watch("isFree") && (
          <>
            {/* Ticket / Service / Influencer Price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-1">Ticket Price</label>
                <CommonInput
                  type="number"
                  placeholder="Enter Ticket Price"
                  {...register("ticketPrice", { valueAsNumber: true })}
                />
                {errors.ticketPrice && (
                  <p className="text-xs text-red-500">{errors.ticketPrice.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm mb-1">Service Price</label>
                <CommonInput
                  type="number"
                  placeholder="Enter Service Price"
                  {...register("servicePrice", { valueAsNumber: true })}
                />
                {errors.servicePrice && (
                  <p className="text-xs text-red-500">{errors.servicePrice.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm mb-1">Influencer Price</label>
                <CommonInput
                  type="number"
                  placeholder="Enter Influencer Price"
                  {...register("influencerPrice", { valueAsNumber: true })}
                />
                {errors.influencerPrice && (
                  <p className="text-xs text-red-500">{errors.influencerPrice.message}</p>
                )}
              </div>
            </div>

            {/* Price Type */}
            <div className="mb-4">
              <label className="block text-sm mb-1">Price Type</label>
              <CommonInput
                type="text"
                placeholder="Enter Price Type"
                {...register("priceType")}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  setValue("priceType", value);
                }}
              />
              {errors?.priceType && (
                <p className="text-xs text-red-500">{errors.priceType.message}</p>
              )}
            </div>
          </>
        )}

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Date</label>
            <CommonInput
              placeholder="Enter Date"
              type="calendar"
              value={watch("date")}
              onChange={(e) => setValue("date", e.target.value)}
              minDate={(() => {
                const d = new Date();
                d.setHours(0, 0, 0, 0);
                return d;
              })()}
            />
            {errors.date && (
              <p className="text-xs text-red-500">{errors.date.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">Time Range</label>
            <TimeRangePicker
              value={watch("time")}
              onChange={(val) => setValue("time", val)}
              error={errors.time?.message}
              selectedDate={watch("date")}
            />
          </div>
        </div>

        {/* Country & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Location</label>
            <GooglePlacesAutocomplete
              value={watch("location")}
              onChange={(v) => setValue("location", v)}
              onPlaceSelect={(place) => {
                if (place.city) setValue("city", place.city);
                if (place.country) setValue("country", place.country);
                if (place.lat) setValue("latitude", place.lat);
                if (place.lng) setValue("longitude", place.lng);
              }}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Country</label>
            <CommonInput {...register("country")} />
            {errors.country && (
              <p className="text-xs text-red-500">{errors.country.message}</p>
            )}
          </div>
        </div>

        {/* Location & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">City</label>
            <CommonInput {...register("city")} />
            {errors.city && (
              <p className="text-xs text-red-500">{errors.city.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">Status</label>
            <Select onValueChange={(val) => setValue("status", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-xs text-red-500">{errors.status.message}</p>
            )}
          </div>
        </div>

        {/* ✅ Category Selection */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Category</label>
          <div className="flex flex-wrap gap-3">
            {data?.map((cat: any) => (
              <Badge
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`flex items-center gap-2 cursor-pointer px-3 py-2 border transition-all ${selectedCategories.includes(cat.id)
                  ? "bg-purple-600 text-white border-purple-700"
                  : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                  }`}
              >
                {cat.iconUrl && (
                  <img
                    src={cat.iconUrl}
                    alt={cat.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                )}
                <span className="text-sm">{cat.name}</span>
              </Badge>
            ))}
          </div>
          {errors.categoryId && (
            <p className="text-xs text-red-500 mt-1">
              {errors.categoryId.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Bio</label>
          <Textarea placeholder="Enter bio..." {...register("bio")} />
          {errors.bio && (
            <p className="text-xs text-red-500">{errors.bio.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Dress Code</label>
          <Textarea
            placeholder="e.g. Formal attire - black tie"
            {...register("dressCode")}
          />
          {errors.dressCode && (
            <p className="text-xs text-red-500">{errors.dressCode.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Rules</label>
          <Textarea
            rows={4}
            placeholder={
              "One rule per line, e.g.\nRespect other participants and event staff.\nArrive on time and follow the event schedule."
            }
            {...register("rules")}
          />
          <p className="text-xs text-gray-400 mt-1">
            Each line is shown as a separate rule in the app.
          </p>
          {errors.rules && (
            <p className="text-xs text-red-500">{errors.rules.message}</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
