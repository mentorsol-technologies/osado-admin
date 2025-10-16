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
import {
  useUpdateInfluencerRankMutation,
  useUploadInfluencerRankFileMutation,
} from "@/hooks/useInfluencersRankMutations";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';


// ✅ Validation Schema
const schema = z.object({
  title: z.string().min(2, "Title is required"),
  status: z.enum(["Active", "Inactive"]),
  noOfEventsVisited: z.string().min(1, "Visited events is required"),
  noOfReviews: z.string().min(1, "Positive reviews is required"),
  image: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

interface EditRankModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedInfluencers?: {
    id?: string;
    title: string;
    status: string; // backend sends "active" or "inactive"
    noOfEventsVisited?: number;
    noOfReviews?: number;
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
  const { mutate: updateInfluencersRank, isPending } =
    useUpdateInfluencerRankMutation();
  const { mutateAsync: uploadInfluencersRankFile, isPending: isUploading } =
    useUploadInfluencerRankFileMutation();

  const [uploadId, setUploadId] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      status: "Active",
      noOfEventsVisited: "",
      noOfReviews: "",
    },
  });

  // ✅ Populate form when editing
  useEffect(() => {
    if (selectedInfluencers) {
      console.log("selected Influencers", selectedInfluencers)
      reset({
        title: selectedInfluencers.title || "",
        status:
          selectedInfluencers.status?.toLowerCase() === "active"
            ? "Active"
            : "Inactive",
        noOfEventsVisited: selectedInfluencers.noOfEventsVisited
          ? String(selectedInfluencers.noOfEventsVisited)
          : "",
        noOfReviews: selectedInfluencers.noOfReviews
          ? String(selectedInfluencers.noOfReviews)
          : "",
        image: selectedInfluencers.image || undefined,
      });
    }
  }, [selectedInfluencers, reset]);

  // ✅ Submit handler
  const onSubmit = (data: FormData) => {
    if (!selectedInfluencers?.id) return;

    const payload = {
      title: data.title,
      status: data.status.toLowerCase(), // convert back for backend
      noOfEventsVisited: Number(data.noOfEventsVisited),
      noOfReviews: Number(data.noOfReviews),
      iconId: uploadId || undefined,
    };

    updateInfluencersRank(
      { rankId: selectedInfluencers.id, data: payload },
      {
        onSuccess: () => {
          toast.success("Influencer Rank updated successfully!")
          reset();
          setOpen(false);
          onSave?.(data);
        },
      }
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Edit Rank"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={handleSubmit(onSubmit)}
            className="flex-1"
            disabled={isPending || isUploading}
          >
            {isPending ? "Updating..." : "Submit"}
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
      {/* Title + Status */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {/* Title */}
        <div className="flex-1">
          <label className="block text-sm mb-1">Title</label>
          <CommonInput placeholder="Write title" {...register("title")} />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Status */}
        <div className="flex-1">
          <label className="block text-sm mb-1">Status</label>
          <Select
            value={watch("status")}
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
          {errors.status && (
            <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Events & Reviews */}
      <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
        {/* No. of Events */}
        <div className="flex-1">
          <label className="block text-sm mb-1">Number of visited events</label>
          <Select
            value={watch("noOfEventsVisited")}
            onValueChange={(val) => setValue("noOfEventsVisited", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Number of visited events" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.noOfEventsVisited && (
            <p className="text-xs text-red-500 mt-1">
              {errors.noOfEventsVisited.message}
            </p>
          )}
        </div>

        {/* No. of Reviews */}
        <div className="flex-1">
          <label className="block text-sm mb-1">Number of positive reviews</label>
          <Select
            value={watch("noOfReviews")}
            onValueChange={(val) => setValue("noOfReviews", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Number of positive reviews" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.noOfReviews && (
            <p className="text-xs text-red-500 mt-1">
              {errors.noOfReviews.message}
            </p>
          )}
        </div>
      </div>

      {/* File Upload */}
      <div className="mt-4">
        <Upload
          label="Upload Badge"
          onFileSelect={async (file) => {
            if (file) {
              try {
                const result = await uploadInfluencersRankFile(file);
                setUploadId(result?.uploadId || "");
                setValue("image", file);
              } catch (err) {
                console.error("File upload failed:", err);
              }
            }
          }}
        />
        {isUploading && (
          <p className="text-sm text-blue-500 mt-1">Uploading...</p>
        )}

        {/* Existing Image Preview */}
        {selectedInfluencers?.image && (
          <div className="mt-2">
            <img
              src={selectedInfluencers.image}
              alt="Current Badge"
              className="w-16 h-16 rounded-md border"
            />
          </div>
        )}
      </div>
    </Modal>
  );
}