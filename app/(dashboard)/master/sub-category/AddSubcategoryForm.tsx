"use client";

import { useState } from "react";
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
import { toast } from 'react-toastify';

import {
  useCreateSubCategoryMutation,
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

interface AddSubCategoryModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedCategory?: {
    name: string;
    status: string;
    description?: string;
    image?: string;
  };
  onSave: (data: FormData) => void;
}

export default function AddSubCategoryModal({
  open,
  setOpen,
  selectedCategory,
  onSave,
}: AddSubCategoryModalProps) {
  const { mutate: createSubCategory, isPending } = useCreateSubCategoryMutation();
  const { mutateAsync: uploadFile, isPending: isUploading } =
    useUploadSubCategoryFileMutation();

  // ✅ Fetch categories list from API
  const { data: categoriesData, isLoading, isError } = useCategoriesQuery();

  const [uploadId, setUploadId] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: selectedCategory?.name || "",
      status: (selectedCategory?.status as "Active" | "Inactive") || "Active",
      description: selectedCategory?.description || "",
    },
  });

  const onSubmit = (data: FormData) => {
    const payload = {
      name: data.name,
      status: data.status.toLowerCase(),
      description: data.description || "",
      iconId: uploadId,
      categoryId: data.assign_category,
    };
    createSubCategory(payload, {
      onSuccess: (responseData) => {
        toast.success("Subcategory created successfully!");
        onSave?.(data);
        reset({
          name: "",
          status: "Active",
          description: "",
        });
        setOpen(false);
      },
      onError: (error: any) => {
        console.error("API Error:", error);
        console.error("Error response:", error?.response);


        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while creating the subcategory.";

        toast.error(message);
      },
    });
  };
  const handleFileUpload = async (file: File) => {
    try {
      const { url, fields, uploadId } = await getSubCategoryUploadLink(file.type);
      setUploadId(uploadId);
      setValue("image", file);
      await uploadToS3(file, url, fields);
      // Store values in state for API use
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  const handleFormSubmit = (e?: React.FormEvent) => {
    console.log(" Submit button clicked");
    handleSubmit(onSubmit)(e);
  };

  return (
    <Modal
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          reset({
            name: "",
            status: "Active",
            description: "",
          });
          setUploadId("");
        }
      }}
      title="Add Subcategory"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            type="button"
            onClick={handleFormSubmit}
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? "Submitting..." : "Submit"}
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
          <CommonInput placeholder="Write subcategory name" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Status */}
        <div className="flex-1">
          <label className="block text-sm mb-1">Status</label>
          <Select
            defaultValue={selectedCategory?.status || "Active"}
            onValueChange={(val) =>
              setValue("status", val as "Active" | "Inactive")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-4">
        <label className="block text-sm mb-1">Description</label>
        <Textarea rows={4} placeholder="Write description" {...register("description")} />
      </div>

      {/* Assign to Category */}
      <div className="mt-4">
        <label className="block text-sm mb-1">Assign to Category</label>
        <Select
          disabled={isLoading || isError}
          onValueChange={(val) => setValue("assign_category", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {/* ✅ Dynamically render category list */}
            {categoriesData?.map((cat: any) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
            if (!file) return;

            console.log("Uploading file:", file);

            try {
              await handleFileUpload(file);
            } catch (error) {
              console.error("File upload failed:", error);
              toast.error("File upload failed");
            }
          }}
        />
        {isUploading && (
          <p className="text-sm text-blue-500 mt-1">Uploading...</p>
        )}
      </div>
    </Modal>
  );
}