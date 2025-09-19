"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

const schema = z.object({
  title: z.string().min(2, "title is required"),
  status: z.enum(["Active", "Inactive"]),
  visited_events: z.string().min(1, "Visited events is required"),
  positive_reviews: z.string().min(1, "Positive reviews is required"),
  image: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

interface EditRankModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedInfluencers?: {
    title: string;
    status: "Active" | "Inactive";
    visited_events?: string;
    positive_reviews?: string;
    image?: string;
  };
  onSave: (data: FormData) => void;
}

export default function EditRankModal({
  open,
  setOpen,
  selectedInfluencers,
  onSave,
}: EditRankModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: selectedInfluencers?.title || "",
      status: selectedInfluencers?.status || "Active",
      visited_events: selectedInfluencers?.visited_events || "",
      positive_reviews: selectedInfluencers?.positive_reviews || "",
    },
  });

  const onSubmit = (data: FormData) => {
    onSave(data);
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Edit Rank"
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
      {/* Two-column row */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {/* Category Name */}
        <div className="flex-1 flex-col sm:flex-row">
          <label className="block text-sm mb-1">Title</label>
          <CommonInput placeholder="Write title" {...register("title")} />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Status */}
        <div className="flex-1 flex-col sm:flex-row">
          <label className="block text-sm mb-1">Status</label>
          <Select
            defaultValue={selectedInfluencers?.status || "Active"}
            onValueChange={(val) =>
              setValue("status", val as "Active" | "Inactive")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent className="w-[var(--radix-select-trigger-width)]">
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Dropdowns for Events & Reviews */}
      <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
        {/* Visited Events */}
        <div className="flex-1 flex-col sm:flex-row">
          <label className="block text-sm mb-1">Number of visited events</label>
          <Select
            defaultValue={selectedInfluencers?.visited_events || ""}
            onValueChange={(val) => setValue("visited_events", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Number of visited events" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.visited_events && (
            <p className="text-xs text-red-500 mt-1">
              {errors.visited_events.message}
            </p>
          )}
        </div>

        {/* Positive Reviews */}
        <div className="flex-1 flex-col sm:flex-row">
          <label className="block text-sm mb-1">
            Number of positive reviews
          </label>
          <Select
            defaultValue={selectedInfluencers?.positive_reviews || ""}
            onValueChange={(val) => setValue("positive_reviews", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Number of positive reviews" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.positive_reviews && (
            <p className="text-xs text-red-500 mt-1">
              {errors.positive_reviews.message}
            </p>
          )}
        </div>
      </div>

      {/* File Upload */}
      <div className="mt-4">
        <Upload
          label="Upload Badge"
          onFileSelect={(file) => {
            if (file) {
              console.log("Selected File:", file);
              setValue("image", file);
            }
          }}
        />
      </div>
    </Modal>
  );
}
