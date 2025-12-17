"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Modal from "@/components/ui/Modal";
import CommonInput from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getBannerUploadLink } from "@/services/banners/bannersService";
import { uploadToS3 } from "@/lib/s3Upload";
import { Camera } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  surName: z.string().min(1, "Surname is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  email: z.string().email("Valid email is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  bio: z.string().min(1, "Description is required"),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
  tiktok: z.string().optional(),
  snapchat: z.string().optional(),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  photoURL: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface EditServiceProviderModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  providerData: (FormData & { id?: string; image?: string }) | null;
  onUpdate: (data: FormData) => void;
}

export default function EditServiceProviderModal({
  open,
  setOpen,
  providerData,
  onUpdate,
}: EditServiceProviderModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadId, setUploadId] = useState<string>("");

  useEffect(() => {
    if (providerData) {
      const categoryIds =
        providerData.categories?.map((cat: any) => cat.id) || [];
      reset({
        name: providerData.name || "",
        surName: providerData.surName || "",
        country: providerData.country || "",
        city: providerData.city || "",
        email: providerData.email || "",
        phoneNumber: providerData.phoneNumber || "",
        bio: providerData.bio || "",
        instagram: providerData.instagram || "",
        youtube: providerData.youtube || "",
        tiktok: providerData.tiktok || "",
        snapchat: providerData.snapchat || "",
        categories: providerData.categories || [],
      });
      setSelectedCategories(categoryIds);
      setPreview(providerData.photoURL || null);
    }
  }, [providerData, reset]);

  const handleFileUpload = async (file: File) => {
    try {
      const { url, fields, uploadId } = await getBannerUploadLink(file.type);
      setUploadId(uploadId);
      setValue("image" as any, file);
      await uploadToS3(file, url, fields);

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const toggleCategory = (cat: string) => {
    let updated: string[];
    if (selectedCategories.includes(cat)) {
      updated = selectedCategories.filter((c) => c !== cat);
    } else {
      updated = [...selectedCategories, cat];
    }
    setSelectedCategories(updated);
    setValue("categories", updated);
  };

  const onSubmit = (data: FormData) => {
    onUpdate({
      ...data,
      categories: selectedCategories,
    });
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Edit Service Provider"
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
      <div className="max-h-[70vh] overflow-y-auto px-2 pb-4 text-white">
        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6 relative">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700">
              <Image
                src={providerData?.photoURL || "/images/Ellipse5.png"}
                alt="Profile"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <label
              htmlFor="file-upload"
              className="absolute bottom-0 right-0 bg-[#C5292A] p-1.5 rounded-full cursor-pointer"
            >
              <Image
                src="images/tabler_award-filled.svg"
                alt="providerIcon"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </label>
          </div>
          <p className="text-gray-400 mt-2 text-sm">
            ID: {providerData?.id || "N/A"}
          </p>
        </div>

        {/* Name / Surname */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <CommonInput
            label="Name"
            placeholder="Enter name"
            {...register("name")}
          />
          <CommonInput
            label="Surname"
            placeholder="Enter surname"
            {...register("surName")}
          />
        </div>

        {/* Country / City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <CommonInput
              label="Country"
              placeholder="Enter country"
              {...register("country")}
            />
          </div>
          <CommonInput
            label="City"
            placeholder="Enter city"
            {...register("city")}
          />
        </div>

        {/* Email / Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <CommonInput
            label="Email"
            placeholder="Enter email"
            {...register("email")}
          />
          <CommonInput
            label="Phone number"
            placeholder="+965 5584 9201"
            {...register("phoneNumber")}
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block mb-1 text-[16px] font-medium">
            Description
          </label>
          <Textarea
            {...register("bio")}
            rows={4}
            placeholder="Enter description"
            className=" focus:outline-none focus:ring-1 focus:ring-red-600 resize-none"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Category</label>
          <div className="flex flex-wrap gap-2">
            {providerData?.categories.map((cat: any) => (
              <Badge
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`cursor-pointer px-4 py-1 rounded-full ${
                  selectedCategories.includes(cat.id)
                    ? "bg-red-600 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {cat.name}
              </Badge>
            ))}

            {/* <Badge className="bg-[#2B2B2B] text-gray-400">+15</Badge> */}
          </div>
        </div>

        {/* Social Media Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <CommonInput
            label="Instagram"
            placeholder="instagramlink"
            {...register("instagram")}
          />
          <CommonInput
            label="YouTube"
            placeholder="youtubelink"
            {...register("youtube")}
          />
          <CommonInput
            label="TikTok"
            placeholder="tiktoklink"
            {...register("tiktok")}
          />
          <CommonInput
            label="Snapchat"
            placeholder="snapchatlink"
            {...register("snapchat")}
          />
        </div>
      </div>
    </Modal>
  );
}
