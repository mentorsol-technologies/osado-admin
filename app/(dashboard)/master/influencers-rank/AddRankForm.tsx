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
import { useCreateInfluencerRankMutation, useUploadInfluencerRankFileMutation } from "@/hooks/useInfluencersRankMutations";
import { toast } from 'react-toastify';
import { getInfluencersRankUploadLink } from "@/services/influencers-rank-table/InfluencersRankServices";
import { uploadToS3 } from "@/lib/s3Upload";


const schema = z.object({
  title: z.string().min(2, "Title is required"),
  status: z.enum(["Active", "Inactive"]),
  noOfEventsVisited: z.string().min(1, "Visited events is required"),
  noOfReviews: z.string().min(1, "Positive reviews is required"),
  image: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

interface AddRankModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedInfluencers?: {
    title: string;
    status: "Active" | "Inactive";
    noOfEventsVisited?: number;
    noOfReviews?: number;
    image?: string;
  };
  onSave: (data: FormData) => void;
}

export default function AddRankModal({
  open,
  setOpen,
  selectedInfluencers,
  onSave,
}: AddRankModalProps) {
  const { mutate: createInfluencersRank, isPending } = useCreateInfluencerRankMutation();
  const { mutateAsync: uploadInfluencersRankFile, isPending: isUploading } = useUploadInfluencerRankFileMutation();
  const [uploadId, setUploadId] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);


  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: selectedInfluencers?.title || "",
      status: selectedInfluencers?.status || "Active",
      noOfEventsVisited: selectedInfluencers?.noOfEventsVisited?.toString() || "",
      noOfReviews: selectedInfluencers?.noOfReviews?.toString() || "",
    },
  });



  const handleFileUpload = async (file: File) => {
    try {
      const { url, fields, uploadId } = await getInfluencersRankUploadLink(file.type);
      setUploadId(uploadId);
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);
      await uploadToS3(file, url, fields);
      setValue("image", file);
    } catch (error) {
      console.error("File upload failed:", error);
      toast.error("File upload failed");
    }
  };

  const handleResetForm = () => {
    reset({
      title: "",
      status: "Active",
      noOfEventsVisited: "",
      noOfReviews: "",
    });
    setPreviewUrl(null);
    setUploadId("");
  };

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        title: data.title,
        status: data.status.toLowerCase(),
        noOfEventsVisited: Number(data.noOfEventsVisited),
        noOfReviews: Number(data.noOfReviews),
        iconId: uploadId || undefined,

      };

      createInfluencersRank(payload, {
        onSuccess: (res) => {
          toast.success("Influencer Rank created successfully!");
          onSave(data);
          handleResetForm();
          setOpen(false);
        },
        onError: (error: any) => {
          console.error("Error creating influencer rank:", error);
          toast.error(error?.message || "Failed to create influencer rank");
        },
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={(isOpen) => {
    setOpen(isOpen);
    if (!isOpen) handleResetForm();
  }}
      title="Create Rank"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button onClick={handleSubmit(onSubmit)} className="flex-1" disabled={isPending || isUploading}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      }
    >
      {/* Title & Status */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="flex-1">
          <label className="block text-sm mb-1">Title</label>
          <CommonInput placeholder="Write title" {...register("title")} />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        <div className="flex-1">
          <label className="block text-sm mb-1">Status</label>
          <Select
            defaultValue={selectedInfluencers?.status || "Active"}
            onValueChange={(val) => setValue("status", val as "Active" | "Inactive")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>}
        </div>
      </div>

      {/* Visited Events & Reviews */}
      <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
        <div className="flex-1">
          <label className="block text-sm mb-1">Number of visited events</label>
          <Select
            defaultValue={
              selectedInfluencers?.noOfEventsVisited
                ? selectedInfluencers.noOfEventsVisited.toString()
                : ""
            }
            onValueChange={(val) => setValue("noOfEventsVisited", val)}
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
          {errors.noOfEventsVisited && <p className="text-xs text-red-500 mt-1">{errors.noOfEventsVisited.message}</p>}
        </div>

        <div className="flex-1">
          <label className="block text-sm mb-1">Number of positive reviews</label>
          <Select
            defaultValue={
              selectedInfluencers?.noOfReviews
                ? selectedInfluencers.noOfReviews.toString()
                : ""
            } onValueChange={(val) => setValue("noOfReviews", val)}
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
          {errors.noOfReviews && <p className="text-xs text-red-500 mt-1">{errors.noOfReviews.message}</p>}
        </div>
      </div>

      {/* Upload */}
      <div className="mt-4">
        <Upload
          label="Upload Icon/Image"
          onFileSelect={async (file) => {
            if (file) await handleFileUpload(file);
          }}
        />
        {isUploading && (
          <p className="text-sm text-blue-500 mt-1">Uploading...</p>
        )}
      </div>
    </Modal>
  );
}