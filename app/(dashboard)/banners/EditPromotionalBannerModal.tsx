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
import { toast } from "react-toastify";

// Banners are only ever targeted at service providers and influencers.
const TARGET_AUDIENCES = ["Service Providers", "Influencers"];

// Older banners were saved against retired audiences ("All", "Users", ...).
// Drop anything no longer offered so the badges reflect what will actually be
// submitted, instead of silently re-saving a value the admin can't see.
const sanitizeAudiences = (values?: string[] | null) =>
  (values ?? []).filter((v) => TARGET_AUDIENCES.includes(v));

const schema = z
  .object({
    image: z.any().optional(),
    link: z.string().url("Valid URL required"),
    status: z.string().min(1, "Status is required"),
    startDate: z.string().min(1, "Start date required"),
    endDate: z.string().min(1, "End date required"),
    displayCategories: z
      .array(z.string())
      .min(1, "Select at least one target audience"),
  })
  // Checked once at submit instead of pre-disabling calendar days against
  // each other - cross-locking the two pickers' min/maxDate made it
  // impossible to tell which field to edit first when relaunching an
  // already-expired banner (Start Date's max was still the old, past
  // End Date, so every future month looked entirely disabled).
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "End date must be on or after the start date",
    path: ["endDate"],
  });

type FormData = z.infer<typeof schema> & { id?: string };

interface EditPromotionalBannerModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  bannerData:
    | (FormData & { id?: string; photoURL?: string; photoId?: string })
    | null;
  onUpdate: (data: FormData) => void;
}

const EditPromotionalBannerModal: React.FC<EditPromotionalBannerModalProps> = ({
  open,
  setOpen,
  bannerData,
  onUpdate,
}) => {
  // New dates can never be backdated - existing past dates on an expired
  // banner are left alone unless the admin actively picks a new one, in
  // which case it must be today or later.
  const today = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })();

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
      displayCategories: sanitizeAudiences(bannerData?.displayCategories),
    },
  });
  const { mutate: updateBanner, isPending: isUploading } =
    useUpdateBannersMutation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadIds, setUploadIds] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (bannerData) {
      reset({
        link: bannerData.link || "",
        status:
          bannerData.status === "active"
            ? "Active"
            : bannerData.status === "inactive"
              ? "Inactive"
              : "Suspended",
        startDate: bannerData.startDate
          ? new Date(bannerData.startDate).toISOString().split("T")[0]
          : "",
        endDate: bannerData.endDate
          ? new Date(bannerData.endDate).toISOString().split("T")[0]
          : "",
        displayCategories: sanitizeAudiences(bannerData.displayCategories),
      });

      setPreviewUrl(bannerData.photoURL || "");
      setUploadIds([]);
      setSelectedCategories(sanitizeAudiences(bannerData.displayCategories));
    }
  }, [bannerData, reset]);

  const toggleCategory = (cat: string) => {
    const updated = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(updated);
    setValue("displayCategories", updated, { shouldValidate: true });
  };
  const handleMultipleFileUpload = async (files: File[]) => {
    try {
      const uploadedIds: string[] = [];

      for (const file of files) {
        const { url, fields, uploadId } = await getBannerUploadLink(file.type);
        await uploadToS3(file, url, fields);
        uploadedIds.push(uploadId);

        const filePreview = URL.createObjectURL(file);
        setPreviewUrl(filePreview);
      }

      setUploadIds(uploadedIds);
      setValue("image", files);
    } catch (err: any) {
      console.error("Upload failed", err);
      const apiMessage = err?.response?.data?.message;
      const reason = Array.isArray(apiMessage) ? apiMessage.join(", ") : apiMessage;
      toast.error(reason || "Image upload failed. Please use a JPG or PNG image.");
    }
  };
  const onSubmit = (data: FormData) => {
    if (!bannerData?.id) {
      console.error("Banner ID missing for update");
      return;
    }
    const finalPhotoId =
      uploadIds.length > 0 ? uploadIds[0] : bannerData?.photoId;

    if (!finalPhotoId) {
      console.error("Photo ID is required");
      return;
    }

    const payload = {
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      photoId: finalPhotoId,
      displayCategories: selectedCategories,
      status: data.status.toLowerCase(),
      link: data.link,
    };

    updateBanner(
      { id: bannerData.id, data: payload },
      {
        onSuccess: () => {
          setOpen(false);
          setUploadIds([]);
          setPreviewUrl(null);
        },
      },
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
            className="flex-1 bg-brand hover:opacity-90"
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
      <div>
        {/* Upload Image */}

        <div className="mt-4">
          <Upload
            label="Upload Images"
            multiple
            accept="image/jpeg,image/jpg,image/png"
            formatsLabel="JPG, PNG"
            onFileSelect={async (files) => {
              if (files?.length) await handleMultipleFileUpload(files);
            }}
          />

          {/* Image Preview */}
          {previewUrl ? (
            <div className="mt-2">
              <img
                src={previewUrl}
                alt="New Preview"
                className="w-16 h-16 rounded-md border"
              />
            </div>
          ) : bannerData?.photoURL ? (
            <div className="mt-2">
              <img
                src={bannerData?.photoURL}
                alt="Current Icon"
                className="w-16 h-16 rounded-md border"
              />
            </div>
          ) : null}
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
            <label className="block mb-1 text-sm">Start Date</label>
            {/* minDate is today, not the other field's value - no cross-
                locking between Start/End here, that's what made editing an
                expired banner impossible before. start <= end is validated
                once at submit instead, so editing either field first
                always works. */}
            <CommonInput
              placeholder="Start Date"
              type="calendar"
              value={watch("startDate")}
              onChange={(e) => setValue("startDate", e.target.value)}
              minDate={today}
            />
            {errors.startDate && (
              <p className="text-xs text-red-500 mt-1">
                {errors.startDate.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm">End Date</label>
            <CommonInput
              placeholder="End Date"
              type="calendar"
              value={watch("endDate")}
              onChange={(e) => setValue("endDate", e.target.value)}
              minDate={today}
            />
            {errors.endDate && (
              <p className="text-xs text-red-500 mt-1">
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Target Audience */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Target Audience</label>
          <div className="flex flex-wrap gap-2">
            {TARGET_AUDIENCES.map((cat) => (
              <Badge
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`cursor-pointer px-4 py-1 ${
                  selectedCategories?.includes(cat)
                    ? "bg-purple-600 text-white"
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
};

export default EditPromotionalBannerModal;
