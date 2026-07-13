"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  useCreateCategoryMutation, // ✅ use create mutation
  useUploadCategoryFileMutation,
} from "@/hooks/useCategoryMutations";
import { toast } from "react-toastify";
import { uploadToS3 } from "@/lib/s3Upload";
import { getCategoryUploadLink } from "@/services/categories/categoriesService";

const schema = z.object({
  name: z.string().min(2, "Category name is required"),
  status: z.enum(["Active", "Inactive"]),
  description: z.string().optional(),
  image: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

interface AddCategoryModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave: (data: FormData) => void;
}

export default function AddCategoryModal({
  open,
  setOpen,
  onSave,
}: AddCategoryModalProps) {
  const { mutate: createCategory, isPending } = useCreateCategoryMutation();
  const { mutateAsync: uploadFile, isPending: isUploading } =
    useUploadCategoryFileMutation();

  const [uploadIds, setUploadIds] = useState<string[]>([]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
      name: "",
      status: "Active",
      description: "",
    },
  });

  const handleResetForm = () => {
    reset({
      name: "",
      status: "Active",
      description: "",
    });
    setPreviewUrl(null);
    setUploadIds([]);
  };

  const handleMultipleFileUpload = async (files: File[]) => {
    try {
      const uploadedIds: string[] = [];

      for (const file of files) {
        const { url, fields, uploadId } = await getCategoryUploadLink(
          file.type
        );
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

  const onSubmit = (formData: FormData) => {
    const payload = {
      name: formData.name,
      status: formData.status.toLowerCase(),
      description: formData.description,
      iconId: uploadIds.length ? uploadIds[0] : undefined,
    };

    createCategory(payload, {
      onSuccess: () => {
        toast.success("Category created successfully!");
        onSave(formData);
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
      title="Add Category"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={handleSubmit(onSubmit)}
            className="flex-1"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit"}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
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
      {/* Category Name + Status */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="flex-1">
          <label className="block text-sm mb-1">Category Name</label>
          <CommonInput placeholder="Category Name" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="flex-1">
          <label className="block text-sm mb-1">Status</label>
          <Select
            defaultValue={watch("status")}
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
        </div>
      </div>

      {/* Description */}
      <div className="mt-4">
        <label className="block text-sm mb-1">Description</label>
        <Textarea
          rows={4}
          placeholder="Enter category description"
          {...register("description")}
        />
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
