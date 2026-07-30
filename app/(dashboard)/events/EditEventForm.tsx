"use client";

import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import Upload from "@/components/ui/upload";
import { Checkbox } from "@/components/ui/checkbox";

import { uploadToS3 } from "@/lib/s3Upload";
import {
  useCategoriesQuery,
  useUpdateEventMutation,
} from "@/hooks/useEventManagementMutations";
import { UploadEventLink } from "@/services/event-management/EventManagementServices";
import TimeRangePicker from "@/components/ui/commonComponent/TimeRangePicker";
import { Textarea } from "@/components/ui/textarea";
import GooglePlacesAutocomplete from "@/components/ui/GooglePlacesAutocomplete";

// ------------------ Schema ------------------
const schema = z
  .object({
    image: z.any().optional(),
    title: z.string().min(1, "Title is required"),
    isFree: z.boolean().optional(),
    isRecommended: z.boolean().optional(),
    ticketPrice: z.number().optional(),
    servicePrice: z.number().optional(),
    influencerPrice: z.number().optional(),
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
    if (!data.priceType) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Price type is required", path: ["priceType"] });
    }
  });

type FormData = z.infer<typeof schema>;

interface EditEventModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  eventData?: any;
}

export default function EditEventModal({
  open,
  setOpen,
  eventData,
}: EditEventModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { categoryId: [] },
  });

  const { data: categories } = useCategoriesQuery();
  const { mutate: updateEvent, isPending } = useUpdateEventMutation();

  const [uploadIds, setUploadIds] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [existingFiles, setExistingFiles] = useState<
    { id: string; url: string }[]
  >([]);

  // ------------------ Prefill form ------------------
  useEffect(() => {
    if (eventData && categories) {
      const photoIds = eventData.photos?.map((p: any) => p.id) || [];
      const categoryIds = eventData.categories?.map((c: any) => c.id) || [];

      reset({
        title: eventData.title || "",
        isFree: !!eventData.isFree,
        isRecommended: !!eventData.isRecommended,
        ticketPrice: Number(eventData.ticketPrice) || 0,
        servicePrice: Number(eventData.servicePrice) || 0,
        influencerPrice: Number(eventData.influencerPrice) || 0,
        priceType: eventData.priceType || "",
        date: eventData.date?.split("T")[0] || "",
        time: eventData.time || "",
        country: eventData.country || "",
        city: eventData.city || "",
        location: eventData.location || "",
        status: eventData.status || "ACTIVE",
        bio: eventData.bio || "",
        dressCode: eventData.dressCode || "",
        rules: eventData.rules || "",
        categoryId: categoryIds,
      });

      setSelectedCategories(categoryIds);
      setUploadIds(photoIds);

      const photos =
        eventData.photos?.map((p: any) => ({ id: p.id, url: p.url })) || [];
      setExistingFiles(photos);
    }
  }, [eventData, categories, reset]);

  // ------------------ Category toggle ------------------
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

  // ------------------ Handle image upload ------------------
  const handleMultipleFileUpload = async (files: File[]) => {
    try {
      const uploaded: { id: string; url: string }[] = [];

      for (const file of files) {
        const { url, fields, uploadId } = await UploadEventLink(file.type);
        await uploadToS3(file, url, fields);

        uploaded.push({
          id: uploadId,
          url: URL.createObjectURL(file), // instant preview
        });
      }

      setUploadIds(uploaded.map((u) => u.id));
      setExistingFiles(uploaded);
      setValue("image", files);
    } catch (error) {
      console.error("File upload failed:", error);
      toast.error("Failed to upload image(s)");
    }
  };

  // ------------------ Submit updated event ------------------
  const onSubmit = (data: FormData) => {
    if (!eventData?.id) {
      toast.error("Event ID is missing!");
      return;
    }

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
      rules: data.rules ?? "",
      isFree: data.isFree ?? false,
      isRecommended: data.isRecommended ?? false,
      ticketPrice: data.isFree ? 0 : Number(data.ticketPrice),
      servicePrice: data.isFree ? 0 : Number(data.servicePrice),
      influencerPrice: data.isFree ? 0 : Number(data.influencerPrice),
      priceType: data.isFree ? undefined : data.priceType,
      latitude: String(data.latitude),
      longitude: String(data.longitude),
    };

    console.log("Updating Event:", payload);

    updateEvent(
      { id: String(eventData.id), data: payload },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
          setSelectedCategories([]);
          setExistingFiles([]);
        },
        onError: (err: any) => {
          console.error("Update failed:", err);
        },
      }
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          reset();
          setSelectedCategories([]);
          setExistingFiles([]);
          setUploadIds([]);
        }
      }}
      title="Edit Event"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={handleSubmit(onSubmit)}
            className="flex-1 bg-brand hover:opacity-90"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300"
            onClick={() => setOpen(false)}
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
            existingFiles={existingFiles}
            onFileSelect={async (files) => {
              if (!files?.length) return;
              await handleMultipleFileUpload(files);
            }}
          />
        </div>
        {existingFiles.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-col gap-2">
              {existingFiles.map((file) => (
                <div key={file.id} className="relative w-full">
                  <img
                    src={file.url}
                    alt="Event Preview"
                    className="w-full h-28 mb-2 rounded-md border border-black-300 object-cover"
                    onError={(e) => {
                      console.error("Failed to load image:", file.url);
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

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
                placeholder="Enter Price Type"
                {...register("priceType")}
              />
              {errors.priceType && (
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
            <TimeRangePicker
              label="Time Range"
              value={watch("time")}
              onChange={(val) => setValue("time", val)}
              error={errors.time?.message}
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
            <Select
              onValueChange={(val) => setValue("status", val)}
              defaultValue={eventData?.status}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-xs text-red-500">{errors.status.message}</p>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Category</label>
          <div className="flex flex-wrap gap-3">
            {categories?.map((cat: any) => (
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

        {/* Bio */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Bio</label>
          <Textarea placeholder="Enter bio..." {...register("bio")} />
          {errors.bio && (
            <p className="text-xs text-red-500">{errors.bio.message}</p>
          )}
        </div>
        {/* Dress Code */}
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

        {/* Rules */}
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
