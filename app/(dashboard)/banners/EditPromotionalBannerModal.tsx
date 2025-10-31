"use client";

import { Controller, useForm } from "react-hook-form";
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
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import Upload from "@/components/ui/upload";
import { getBannerUploadLink } from "@/services/banners/bannersService";
import { uploadToS3 } from "@/lib/s3Upload";
import { useUpdateBannersMutation } from "@/hooks/useBannersMutations";
import Image from "next/image";

const schema = z.object({
  image: z.any().optional(),
  bannerTitle: z.string().min(1, "Banner title is required"),
  linkType: z.string().min(1, "Link type is required"),
  link: z.string().url("Valid URL required"),
  status: z.string().min(1, "Status is required"),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().min(1, "End date required"),
  displayCategories: z.array(z.string()).min(1, "Select at least one category"),
});

type FormData = z.infer<typeof schema> & { id?: string };

interface EditPromotionalBannerModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  bannerData: (FormData & { id?: string; photoURL?: string; photoId?: string; }) | null;
  onUpdate: (data: FormData) => void;
}

const EditPromotionalBannerModal: React.FC<EditPromotionalBannerModalProps> = ({
  open,
  setOpen,
  bannerData,
  onUpdate,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      bannerTitle: bannerData?.bannerTitle || "",
      linkType: bannerData?.linkType || "external",
      link: bannerData?.link || "",
      status:
        bannerData?.status === "active"
          ? "Active"
          : bannerData?.status === "inactive"
            ? "Inactive"
            : "",
      startDate: bannerData?.startDate
        ? new Date(bannerData.startDate).toISOString().split("T")[0]
        : "",
      endDate: bannerData?.endDate
        ? new Date(bannerData.endDate).toISOString().split("T")[0]
        : "",
      displayCategories: bannerData?.displayCategories || ["All"],
    },
  });
  const { mutate: updateBanner, isPending: isUploading } = useUpdateBannersMutation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadId, setUploadId] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (bannerData) {
      reset({
        bannerTitle: bannerData?.bannerTitle || "",
        linkType: bannerData?.linkType || "external",
        link: bannerData?.link || "",
        status:
          bannerData.status === "active"
            ? "Active"
            : bannerData.status === "inactive"
              ? "Inactive"
              : bannerData.status === "suspended"
                ? "Suspended"
                : "",
        startDate: bannerData?.startDate
          ? new Date(bannerData.startDate).toISOString().split("T")[0]
          : "",
        endDate: bannerData?.endDate
          ? new Date(bannerData.endDate).toISOString().split("T")[0]
          : "",
        displayCategories: bannerData?.displayCategories || ["All"],
      });
      setPreviewUrl(bannerData?.photoURL || "");
      setUploadId(bannerData?.photoId || "");

      setSelectedCategories(bannerData?.displayCategories || ["All"]);
    }
  }, [bannerData, reset]);


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
    setValue("displayCategories", updated);
  };
  const handleFileUpload = async (file: File) => {
    try {
      const { url, fields, uploadId } = await getBannerUploadLink(file.type);
      setUploadId(uploadId);
      setValue("image", file);
      await uploadToS3(file, url, fields);
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };
  const onSubmit = (data: FormData) => {
    if (!bannerData?.id) {
      console.error("Banner ID missing for update");
      return;
    }

    const payload = {
      bannerTitle: data.bannerTitle,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      photoId: uploadId,
      displayCategories: selectedCategories,
      status: data.status.toLowerCase(),
      linkType: data.linkType,
      link: data.link,
    };

    updateBanner(
      { id: bannerData.id, data: payload },
      {
        onSuccess: () => setOpen(false),
      }
    );
  };



  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Edit Promotional Banner"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={handleSubmit(onSubmit)}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            Update
          </Button>
          <Button
            variant="outline"
            className="flex-1 "
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </div>
      }
    >
      <div className="max-h-[70vh] overflow-y-auto pr-2">
        {/* Upload Image */}

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

          {/* Image Preview */}
          {previewUrl ? (
            <div className="mt-2">
              <Image
                src={previewUrl}
                alt="New Preview"
                className="w-16 h-16 rounded-md border"
              />
            </div>
          ) : bannerData?.photoURL ? (
            <div className="mt-2">
              <Image
                src={bannerData?.photoURL}
                alt="Current Icon"
                className="w-16 h-16 rounded-md border"
              />
            </div>
          ) : null}
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
            <Controller
              name="linkType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select link type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="external">External</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
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
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
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
                className={`cursor-pointer px-4 py-1 ${selectedCategories?.includes(cat)
                  ? "bg-red-600 text-white"
                  : "bg-gray-700 text-gray-300"
                  }`}
              >
                {cat}
              </Badge>
            ))}
          </div>
          {errors.displayCategories && (
            <p className="text-xs text-red-500 mt-1">
              {errors.displayCategories.message}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default EditPromotionalBannerModal;
