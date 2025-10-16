"use client";

import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { toast } from 'react-toastify';


import {
  useUpdateSubCategoryMutation,
  useUploadSubCategoryFileMutation,
} from "@/hooks/useSubCategoriesMutations";
import { useCategoriesQuery } from "@/hooks/useCategoryMutations";
import { uploadToS3 } from "@/lib/s3Upload";
import { getSubCategoryUploadLink } from "@/services/sub-categories/subCategoriesService";

const schema = z.object({
  name: z.string().min(2, "Subcategory name is required"),
  status: z.enum(["Active", "Inactive"]),
  description: z.string().optional(),
  image: z.any().optional(),
  assign_category: z.string().min(1, "Please select a category"),
});

type FormData = z.infer<typeof schema>;

interface EditSubCategoryModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedCategory?: any;
  onSave: (data: FormData) => void;
}

export default function EditSubCategoryModal({
  open,
  setOpen,
  selectedCategory,
  onSave,
}: EditSubCategoryModalProps) {
  const { mutate: updateSubCategory, isPending } = useUpdateSubCategoryMutation();
  const { mutateAsync: uploadFile, isPending: isUploading } =
    useUploadSubCategoryFileMutation();

  const { data: categoriesData, isLoading, isError } = useCategoriesQuery();
  const [uploadId, setUploadId] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);


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
      name: selectedCategory?.name || "",
      status: (selectedCategory?.status as "Active" | "Inactive") || "Active",
      description: selectedCategory?.description || "",
      assign_category: selectedCategory?.categoryId
        ? String(selectedCategory.categoryId)
        : "",
    },
  });

  // Re-populate form when modal opens with a different selected subcategory
  useEffect(() => {
    if (selectedCategory && categoriesData?.length) {
      // find matching category object using categoryId
      const matchedCategory = categoriesData.find(
        (cat: any) => cat.id === selectedCategory.categoryId
      );

      reset({
        name: selectedCategory?.name || "",
        status:
          selectedCategory?.status === "ACTIVE"
            ? "Active"
            : selectedCategory?.status === "INACTIVE"
              ? "Inactive"
              : "Active",
        description: selectedCategory?.description || "",
        assign_category: matchedCategory?.id ? String(matchedCategory.id) : "",
        image: selectedCategory?.image || undefined,

      });
      setUploadId(selectedCategory?.iconId || "");
    }
  }, [selectedCategory, categoriesData, reset]);

  const handleFileUpload = async (file: File) => {
    try {
      const { url, fields, uploadId } = await getSubCategoryUploadLink(file.type);
      setUploadId(uploadId);
      setValue("image", file);
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);
      await uploadToS3(file, url, fields);
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };


  // Submit Handler
  const onSubmit = (data: FormData) => {
    if (!selectedCategory?.id) return;

    const payload = {
      name: data.name,
      status: data.status.toLowerCase(),
      description: data.description || "",
      iconId: uploadId,
      categoryId: data.assign_category,
    };

    console.log("Updating SubCategory with Payload:", payload);

    updateSubCategory(
      {
        subCategoryId: selectedCategory.id,
        data: payload,
      },
      {
        onSuccess: (response) => {
          toast.success("Subcategory Updated successfully!");
          console.log("Update Success:", response);
          onSave(data);
          reset();
          setOpen(false);
        },
        onError: (error: any) => {
          toast.error(error)
          console.error("Update Error:", error);
        },
      }
    );
  };

  const handleFormSubmit = (e?: React.FormEvent) => {
    console.log("Save button clicked");
    handleSubmit(onSubmit)(e);
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Edit Subcategory"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            type="button"
            onClick={handleFormSubmit}
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? "Updating..." : "Save Changes"}
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
      {/* Subcategory Name + Status */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {/* Name */}
        <div className="flex-1">
          <label className="block text-sm mb-1">Subcategory Name</label>
          <CommonInput
            placeholder="Enter subcategory name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Status */}
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
          placeholder="Write subcategory description"
          {...register("description")}
        />
      </div>

      {/* ✅ Assign Category - Fixed */}
      <div className="mt-4">
        <label className="block text-sm mb-1">Assign to Category</label>
        <Controller
          control={control}
          name="assign_category"
          render={({ field }) => (
            <Select
              disabled={isLoading || isError}
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categoriesData?.map((cat: any) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.assign_category && (
          <p className="text-xs text-red-500 mt-1">
            {errors.assign_category.message}
          </p>
        )}
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