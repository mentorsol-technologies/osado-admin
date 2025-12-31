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
  phone: z.string().min(1, "Phone number is required"),
  description: z.string().min(1, "Description is required"),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
  tiktok: z.string().optional(),
  snapchat: z.string().optional(),
  categories: z.array(z.string()).min(1, "Select at least one category"),
});

type FormData = z.infer<typeof schema>;

interface EditInfluencerModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  influencerData: any | null; // API response data
  onUpdate: (data: FormData) => void;
}

export default function EditInfluencerModal({
  open,
  setOpen,
  influencerData,
  onUpdate,
}: EditInfluencerModalProps) {
  const {
    register,
    handleSubmit,
    control,
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
    if (influencerData) {
      // Extract category names from the categories array
      const categoryNames =
        influencerData.categories?.map((cat: any) => cat.name) || [];

      reset({
        name: influencerData.name || "",
        surName: influencerData.surName?.trim() || "",
        country: influencerData.country || "",
        city: influencerData.city || "",
        email: influencerData.email || "",
        phone: influencerData.phoneNumber || "",
        description: influencerData.bio || "",
        instagram: influencerData.instagramUrl || "",
        youtube: influencerData.facebookUrl || "",
        tiktok: influencerData.tiktokUrl || "",
        snapchat: influencerData.snapchat || "",
        categories: categoryNames,
      });
      setSelectedCategories(categoryNames);
      setPreview(influencerData.photoURL || null);
    }
  }, [influencerData, reset]);

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

  // Combine static categories with influencer's categories
  // const staticCategories = [
  //   "Business & Networking",
  //   "Sports & Fitness",
  //   "Food & Drink",
  // ];

  const influencerCategoryNames =
    influencerData?.categories?.map((cat: any) => cat.name) || [];
  const categories = Array.from(new Set([...influencerCategoryNames]));

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Edit Influencer"
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
                src={preview || "/images/Ellipse5.png"}
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
            ID: {influencerData?.id || "N/A"}
          </p>
        </div>

        {/* Name / Surname */}
        <div className=" mb-4">
          <CommonInput
            label="Name"
            placeholder="Enter name"
            {...register("name")}
          />
        </div>

        {/* Country / City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[16px] font-medium">Country</label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              )}
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
            {...register("phone")}
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block mb-1 text-[16px] font-medium">
            Description
          </label>
          <Textarea
            {...register("description")}
            rows={4}
            placeholder="Enter description"
            className=" focus:outline-none focus:ring-1 focus:ring-red-600 resize-none"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Badge
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`cursor-pointer px-4 py-1 rounded-full ${
                  selectedCategories.includes(cat)
                    ? "bg-red-600 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {cat}
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
