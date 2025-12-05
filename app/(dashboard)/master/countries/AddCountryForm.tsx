"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import CommonInput from "@/components/ui/input";
import Upload from "@/components/ui/upload";
import { toast } from "react-toastify";

import {
  useCreateCountryMutation,
  useUploadCountryFileMutation,
} from "@/hooks/useCountryMutations";
import { getCountryUploadLink } from "@/services/country/countryService";
import { uploadToS3 } from "@/lib/s3Upload";

// ✅ Schema validation
const schema = z.object({
  name: z.string().min(2, "Country name is required"),
  countryCode: z.string().min(1, "Country code is required"),
  image: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

interface AddCountryModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave: (formData: any) => void;
}

export default function AddCountryModal({
  open,
  setOpen,
  onSave,
}: AddCountryModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutate: createCountry, isPending } = useCreateCountryMutation();
  const { mutateAsync: uploadCountryFile, isPending: isUploading } =
    useUploadCountryFileMutation();

  const [uploadIds, setUploadIds] = useState<string[]>([]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleResetForm = () => {
    reset({
      name: "",
      countryCode: "",
      image: undefined,
    });
    setPreviewUrl(null);
    setUploadIds([]);
  };

  const handleMultipleFileUpload = async (files: File[]) => {
    try {
      const uploadedIds: string[] = [];

      for (const file of files) {
        const { url, fields, uploadId } = await getCountryUploadLink(file.type);
        await uploadToS3(file, url, fields);
        uploadedIds.push(uploadId);

        setPreviewUrl(URL.createObjectURL(file));
      }

      setUploadIds((prev) => [...prev, ...uploadedIds]);
      setValue("image", uploadedIds);
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  //  Handle form submit
  const onSubmit = (data: FormData) => {
    const payload = {
      name: data.name,
      iconId: uploadIds.length ? uploadIds[0] : undefined,
      countryCode: data.countryCode,
    };

    createCountry(payload, {
      onSuccess: () => {
        toast.success("Country created Successfully !");
        handleResetForm();
        setOpen(false);
        onSave?.(payload);
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
      title="Add Country"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? "Submitting..." : "Submit"}
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
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="flex-1">
          <label className="block text-sm mb-1">Country Name</label>
          <CommonInput placeholder="Country Name" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="flex-1">
          <label className="block text-sm mb-1">Country Code</label>
          <CommonInput
            type="number"
            placeholder="+965"
            {...register("countryCode")}
          />
          {errors.countryCode && (
            <p className="text-xs text-red-500 mt-1">
              {errors.countryCode.message}
            </p>
          )}
        </div>
      </div>

      {/* File Upload */}
      <div className="mt-4">
        <Upload
          label="Upload Images"
          multiple
          onFileSelect={async (files) => {
            if (!files?.length) return;
            await handleMultipleFileUpload(files);
          }}
        />
        {isUploading && (
          <p className="text-sm text-blue-500 mt-1">Uploading...</p>
        )}
      </div>
    </Modal>
  );
}
