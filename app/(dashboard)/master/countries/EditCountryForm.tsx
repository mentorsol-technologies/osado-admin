"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import CommonInput from "@/components/ui/input";
import Upload from "@/components/ui/upload";
import { toast } from "react-toastify";

import {
  useUpdateCountryMutation,
} from "@/hooks/useCountryMutations";
import { getCountryUploadLink } from "@/services/country/countryService";
import { uploadToS3 } from "@/lib/s3Upload";

const schema = z.object({
  name: z.string().min(2, "Country name is required"),
  countryCode: z.string().optional(),
  image: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

interface EditCountryModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedCountry?: {
    id: string;
    name: string;
    countryCode?: string;
    image?: string;
    iconURL?: string;
  };
  onSave?: (formData: any) => void;
}

export default function EditCountryModal({
  open,
  setOpen,
  selectedCountry,
  onSave,
}: EditCountryModalProps) {
  const { mutate: updateCountry, isPending, } = useUpdateCountryMutation();

  const [uploadId, setUploadId] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      countryCode: "",
      image: undefined,
    },
  });

  // ✅ Populate form when selectedCountry changes
  useEffect(() => {
    if (selectedCountry) {
      reset({
        name: selectedCountry.name || "",
        countryCode: selectedCountry.countryCode || "",
        image: selectedCountry.iconURL || undefined,
      });
      setPreviewUrl(selectedCountry.iconURL || null);
    }
  }, [selectedCountry, reset]);


  // ✅ Handle file upload (S3 flow)
  const handleFileUpload = async (file: File) => {
    try {
      const { url, fields, uploadId } = await getCountryUploadLink(file.type);
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

  // ✅ Submit updated data
  const onSubmit = (data: FormData) => {
    if (!selectedCountry) return;

    const payload = {
      name: data.name,
      countryCode: data.countryCode,
      iconId: uploadId || undefined,
    };

    updateCountry(
      { countryId: selectedCountry.id, data: payload },
      {
        onSuccess: () => {
          toast.success("Country updated successfully!");
          reset();
          setOpen(false);
          onSave?.(payload);
        },
      }
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Edit Country"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              reset();
              setOpen(false);
            }}
          >
            Cancel
          </Button>
        </div>
      }
    >
      {/* Country Fields */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {/* Country Name */}
        <div className="flex-1">
          <label className="block text-sm mb-1">Country Name</label>
          <CommonInput placeholder="Country Name" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Country Code */}
        <div className="flex-1">
          <label className="block text-sm mb-1">Country Code</label>
          <CommonInput placeholder="+965" {...register("countryCode")} />
        </div>
      </div>

      {/* Upload Flag */}
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
            <img
              src={previewUrl}
              alt="New Preview"
              className="w-16 h-16 rounded-md border"
            />
          </div>
        ) : selectedCountry?.image ? (
          <div className="mt-2">
            <img
              src={selectedCountry.image}
              alt="Current Icon"
              className="w-16 h-16 rounded-md border"
            />
          </div>
        ) : null}
      </div>
    </Modal>
  );
}