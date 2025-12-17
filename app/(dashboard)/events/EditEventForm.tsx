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
const schema = z.object({
  image: z.any().optional(),
  title: z.string().min(1, "Title is required"),
  price: z.number().min(1, "Price is required"),
  priceType: z.string().min(1, "Price type is required"),
  date: z.string().min(1, "Select a date"),
  time: z.string().min(1, "Select a time"),
  country: z.string().min(1, "Select a country"),
  city: z.string().min(1, "Enter a city"),
  location: z.string().min(1, "Enter a location"),
  status: z.string().min(1, "Select a status"),
  categoryId: z.string().array().optional(),
  bio: z.string().min(1, "Bio is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
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
        price: Number(eventData.price) || 0,
        priceType: eventData.priceType || "",
        date: eventData.date?.split("T")[0] || "",
        time: eventData.time || "",
        country: eventData.country || "",
        city: eventData.city || "",
        location: eventData.location || "",
        status: eventData.status || "ACTIVE",
        bio: eventData.bio || "",
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
      const uploadedIds: string[] = [];
      for (const file of files) {
        const { url, fields, uploadId } = await UploadEventLink(file.type);
        await uploadToS3(file, url, fields);
        uploadedIds.push(uploadId);

        // Construct final image URL from uploadId
        // Based on the response pattern: https://osado-bucket-vga.s3.me-central-1.amazonaws.com/{uploadId}.{ext}
        const getFileExtension = (
          mimeType: string,
          fileName: string
        ): string => {
          if (mimeType.includes("jpeg") || mimeType.includes("jpg"))
            return "jpeg";
          if (mimeType.includes("png")) return "png";
          if (mimeType.includes("svg")) return "svg";
          if (mimeType.includes("webp")) return "webp";
          // Fallback to file extension
          return fileName.split(".").pop()?.toLowerCase() || "jpeg";
        };

        const fileExtension = getFileExtension(file.type, file.name);
        const finalUrl = `https://osado-bucket-vga.s3.me-central-1.amazonaws.com/${uploadId}.${fileExtension}`;

        setExistingFiles((prev) => [...prev, { id: uploadId, url: finalUrl }]);
      }
      setUploadIds((prev) => [...prev, ...uploadedIds]);
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
      price: Number(data.price),
      priceType: data.priceType,
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
            className="flex-1 bg-red-600 hover:bg-red-700"
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
      <div className="max-h-[70vh] overflow-y-auto pr-2">
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
            <div className="flex flex-wrap gap-2">
              {existingFiles.map((file) => (
                <div key={file.id} className="relative">
                  <img
                    src={file.url}
                    alt="Event Preview"
                    className="w-20 h-20 rounded-md border object-cover"
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

        {/* Price & Price type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Price</label>
            <CommonInput
              placeholder="Enter Price"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-xs text-red-500">{errors.price.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">Price Type</label>
            <CommonInput
              placeholder="Enter Price Type"
              {...register("priceType")}
            />
            {errors.priceType && (
              <p className="text-xs text-red-500">{errors.priceType.message}</p>
            )}
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Date</label>
            <CommonInput type="date" {...register("date")} />
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
                className={`flex items-center gap-2 cursor-pointer px-3 py-2 border transition-all ${
                  selectedCategories.includes(cat.id)
                    ? "bg-red-600 text-white border-red-700"
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
      </div>
    </Modal>
  );
}
