"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Modal from "@/components/ui/Modal";
import CommonInput from "@/components/ui/input";
import Upload from "@/components/ui/upload";
import { Badge } from "@/components/ui/badge";
import { Bell, LifeBuoy, Utensils, Trash2 } from "lucide-react";

const schema = z.object({
  title: z.string().min(2, "Event title is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  location: z.string().min(1, "Location is required"),
  status: z.enum(["Active", "Inactive"]),
  image: z.any().optional(),
  category: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface EditEventModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedEvent?: FormData;
  onSave: (data: FormData) => void;
}

export default function EditEventModal({
  open,
  setOpen,
  selectedEvent,
  onSave,
}: EditEventModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: selectedEvent?.title || "",
      date: selectedEvent?.date || "",
      time: selectedEvent?.time || "1AM - 5AM",
      country: selectedEvent?.country || "",
      city: selectedEvent?.city || "",
      location: selectedEvent?.location || "",
      status: (selectedEvent?.status as "Active" | "Inactive") || "Active",
    },
  });

  const [preview, setPreview] = useState<string | null>(
    selectedEvent?.image || null
  );

  const onSubmit = (data: FormData) => {
    onSave(data);
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Edit Event"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button onClick={handleSubmit(onSubmit)} className="flex-1">
            Submit
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </div>
      }
    >
      {/* Scrollable container */}
      <div className="max-h-[70vh] overflow-y-auto pr-2">
        {/* Image Previews */}
        {(selectedEvent?.image || preview) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Existing Event Image */}
            {selectedEvent?.image && (
              <div className="relative">
                <img
                  src={
                    typeof selectedEvent.image === "string"
                      ? selectedEvent.image
                      : URL.createObjectURL(selectedEvent.image)
                  }
                  alt="Existing Event"
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            )}

            {/* Newly Selected Image with Overlay + Delete */}
            {preview && (
              <div className="relative w-full h-48 rounded-md overflow-hidden hidden lg:block">
                <img
                  src={preview}
                  alt="New Preview"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none" />

                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setValue("image", undefined);
                  }}
                  className="absolute inset-0 flex items-center justify-center z-20"
                >
                  <div className="bg-red-600 hover:bg-red-700 rounded-full p-3">
                    <Trash2 size={25} />
                  </div>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Upload Image */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Upload Image</label>
          <Upload
            onFileSelect={(file) => {
              if (file) {
                const url = URL.createObjectURL(file);
                setPreview(url);
                setValue("image", file);
              }
            }}
          />
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Title</label>
          <CommonInput placeholder="Event Title" {...register("title")} />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Date</label>
            <CommonInput type="date" {...register("date")} />
          </div>
          <div>
            <label className="block text-sm mb-1">Time</label>
            <Select
              defaultValue={selectedEvent?.time || "1AM - 5AM"}
              onValueChange={(val) => setValue("time", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="1AM - 5AM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1AM - 5AM">1AM - 5AM</SelectItem>
                <SelectItem value="6AM - 12PM">6AM - 12PM</SelectItem>
                <SelectItem value="1PM - 5PM">1PM - 5PM</SelectItem>
                <SelectItem value="6PM - 12AM">6PM - 12AM</SelectItem>
              </SelectContent>
            </Select>
            {errors.time && (
              <p className="text-xs text-red-500 mt-1">{errors.time.message}</p>
            )}
          </div>
        </div>

        {/* Country & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Country</label>
            <CommonInput placeholder="Enter country" {...register("country")} />
          </div>
          <div>
            <label className="block text-sm mb-1">City</label>
            <CommonInput placeholder="Enter city" {...register("city")} />
          </div>
        </div>

        {/* Location & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Location</label>
            <CommonInput
              placeholder="Enter location"
              {...register("location")}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Status</label>
            <Select
              defaultValue={selectedEvent?.status || "Active"}
              onValueChange={(val) =>
                setValue("status", val as "Active" | "Inactive")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Category</label>
          <div className="flex flex-col lg:flex-row flex-wrap gap-2">
            <Badge>
              <Bell size={14} className="mr-1" />
              Business & Networking
            </Badge>
            <Badge variant="secondary">
              <LifeBuoy size={14} className="mr-1" />
              Sports & Fitness
            </Badge>
            <Badge variant="secondary">
              <Utensils size={14} className="mr-1" />
              Food & Drink
            </Badge>
            <Badge>+15</Badge>
          </div>
        </div>
      </div>
    </Modal>
  );
}
