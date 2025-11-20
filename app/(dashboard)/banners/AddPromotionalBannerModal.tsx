"use client";

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
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import Upload from "@/components/ui/upload";
import { useCreateBannersMutation } from "@/hooks/useBannersMutations";
import { uploadToS3 } from "@/lib/s3Upload";
import { getBannerUploadLink } from "@/services/banners/bannersService";

const schema = z.object({
  image: z.any().optional(),
  bannerTitle: z.string().min(1, "Banner title is required"),
  linkType: z.string().min(1, "Link type is required"),
  link: z.string().url("Valid URL required"),
  status: z.string().min(1, "Status is required"),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().min(1, "End date required"),
  category: z.array(z.string()).min(1, "Select at least one category"),
});

type FormData = z.infer<typeof schema>;

interface AddPromotionalBannerModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave: (data: FormData) => void;
}

export default function AddPromotionalBannerModal({
  open,
  setOpen,
  onSave,
}: AddPromotionalBannerModalProps) {
  const [uploadIds, setUploadIds] = useState<string[]>([]);


  const { mutate: createBanner, isPending } = useCreateBannersMutation();


  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: ["All"],
    },
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "All",
  ]);
  const [preview, setPreview] = useState<string | null>(null);
  const handleResetForm = () => {
    reset({
      bannerTitle: "",
      startDate: "",
      endDate: "",
      status: "",
      link: "",
    });
  };

  const toggleCategory = (cat: string) => {
    let updated: string[];
    if (cat === "All") {
      updated = ["All"];
    } else {
      updated = selectedCategories.includes(cat)
        ? selectedCategories.filter((c) => c !== cat)
        : [...selectedCategories.filter((c) => c !== "All"), cat];
    }
    setSelectedCategories(updated);
    setValue("category", updated);
  };
  const handleMultipleFileUpload = async (files: File[]) => {
    try {
      const uploadedIds: string[] = [];

      for (const file of files) {
        const { url, fields, uploadId } = await getBannerUploadLink(file.type);
        await uploadToS3(file, url, fields);
        uploadedIds.push(uploadId);
      }

      setUploadIds((prev) => [...prev, ...uploadedIds]);
      setValue("image", files);
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  const onSubmit = (data: FormData) => {
    const payload = {
      bannerTitle: data.bannerTitle,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      photoId: uploadIds,
      displayCategories: selectedCategories,
      status: data.status.toLowerCase(),
      link: data.link
    };

    createBanner(payload, {
      onSuccess: () => {
        handleResetForm();
        setOpen(false);
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
      title="Add Promotional Banner"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={handleSubmit(onSubmit)}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            Submit
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300"
            onClick={() => {
              setOpen(false);
              handleResetForm();
            }}
          >
            Cancel
          </Button>
        </div>
      }
    >
      <div className="max-h-[70vh] overflow-y-auto pr-2">
        {/* Upload Image */}
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

        {/* Banner Title / Link Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Banner Title</label>
            <CommonInput
              placeholder="Write title"
              {...register("bannerTitle")}
            />
            {errors.bannerTitle && (
              <p className="text-xs text-red-500">
                {errors.bannerTitle.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">Link Type</label>
            <Select onValueChange={(val) => setValue("linkType", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select link type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="external">External</SelectItem>
              </SelectContent>
            </Select>
            {errors.linkType && (
              <p className="text-xs text-red-500">{errors.linkType.message}</p>
            )}
          </div>
        </div>

        {/* Link / Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Link</label>
            <CommonInput placeholder="Your link" {...register("link")} />
            {errors.link && (
              <p className="text-xs text-red-500">{errors.link.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">Status</label>
            <Select onValueChange={(val) => setValue("status", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-xs text-red-500">{errors.status.message}</p>
            )}
          </div>
        </div>

        {/* Start / End Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Start Date</label>
            <CommonInput type="date" {...register("startDate")} />
            {errors.startDate && (
              <p className="text-xs text-red-500">{errors.startDate.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">End Date</label>
            <CommonInput type="date" {...register("endDate")} />
            {errors.endDate && (
              <p className="text-xs text-red-500">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Category</label>
          <div className="flex flex-wrap gap-2">
            {[
              "All",
              "Users",
              "Photographers",
              "Influencers",
              "Business Owners",
            ].map((cat) => (
              <Badge
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`cursor-pointer px-4 py-1 ${selectedCategories.includes(cat)
                  ? "bg-red-600 text-white"
                  : "bg-gray-700 text-gray-300"
                  }`}
              >
                {cat}
              </Badge>
            ))}
          </div>
          {errors.category && (
            <p className="text-xs text-red-500 mt-1">
              {errors.category.message}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
