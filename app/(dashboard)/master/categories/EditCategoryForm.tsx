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
  useUpdateCategoryMutation,
  useUploadCategoryFileMutation,
} from "@/hooks/useCategoryMutations";
import { toast } from 'react-toastify';
import { uploadToS3 } from "@/lib/s3Upload";
import { getCategoryUploadLink } from "@/services/categories/categoriesService";


const schema = z.object({
  name: z.string().min(2, "Category name is required"),
  status: z.enum(["Active", "Inactive"]),
  description: z.string().optional(),
  image: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

interface EditCategoryModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedCategory?: {
    id?: number;
    name: string;
    status: string;
    description?: string;
    image?: string;
  };
  onSave: (data: FormData) => void;
}

export default function EditCategoryModal({
  open,
  setOpen,
  selectedCategory,
  onSave,
}: EditCategoryModalProps) {
  const { mutate: updateCategory, isPending } = useUpdateCategoryMutation();
  const { mutateAsync: uploadFile, isPending: isUploading } =
    useUploadCategoryFileMutation();

  const [uploadId, setUploadId] = useState<string>("");
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

  // ✅ Populate form when selectedCategory changes
  useEffect(() => {
    if (selectedCategory) {
      reset({
        name: selectedCategory.name || "",
        status:
          selectedCategory.status === "ACTIVE"
            ? "Active"
            : selectedCategory.status === "INACTIVE"
              ? "Inactive"
              : "Active",
        description: selectedCategory.description || "",
        image: selectedCategory.image || undefined,
      });
    }
  }, [selectedCategory, reset]);
   const handleFileUpload = async (file: File) => {
    try {
      const { url, fields, uploadId } = await getCategoryUploadLink(file.type);
      setUploadId(uploadId);
      setValue("image", file);
        const localPreview = URL.createObjectURL(file);
        setPreviewUrl(localPreview);
      await uploadToS3(file, url, fields);
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  const onSubmit = (formData: FormData) => {
    if (!selectedCategory?.id) return;

    const payload = {
      name: formData.name,
      status: formData.status.toLowerCase(),
      description: formData.description,
      iconId: uploadId || undefined,
    };

    updateCategory(
      { categoryId: selectedCategory.id, data: payload },
      {
        onSuccess: () => {
          toast.success("category updated successfully!")
          onSave(formData);
          setOpen(false);
        },
      }
    );
  };


  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Edit Category"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={handleSubmit(onSubmit)}
            className="flex-1"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save"}
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
            onValueChange={(val) => setValue("status", val as "Active" | "Inactive")}
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
          ) : selectedCategory?.image ? (
            <div className="mt-2">
              <img
                src={selectedCategory.image}
                alt="Current Icon"
                className="w-16 h-16 rounded-md border"
              />
            </div>
  ) : null}
      </div>
    </Modal>
  );
}
