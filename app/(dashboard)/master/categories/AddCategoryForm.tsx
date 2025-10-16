"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

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
import { useCreateCategoryMutation, useUploadCategoryFileMutation } from "@/hooks/useCategoryMutations";
import { toast } from 'react-toastify';
import { uploadToS3 } from "@/lib/s3Upload";
import { getCategoryUploadLink } from "@/services/categories/categoriesService";


// ✅ Schema validation
const schema = z.object({
  name: z.string().min(2, "Category name is required"),
  status: z.enum(["active", "inactive"], {
    required_error: "Status is required",
  }),
  description: z.string().optional(),
  image: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

interface AddCategoryModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave?: (data: FormData) => void;
  categoryId?: string | number;
}

export default function AddCategoryModal({
  open,
  setOpen,
  onSave,
  categoryId,
}: AddCategoryModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      status: "active",
      description: "",
    },
  });


  const { mutate: createCategory, isPending } = useCreateCategoryMutation();
  const { mutateAsync: uploadFile, isPending: isUploading } =
    useUploadCategoryFileMutation();
  const [uploadId, setUploadId] = useState<string>("");



  const onSubmit = (data: FormData) => {
    const payload = {
      name: data.name,
      status: data.status.toLowerCase(),
      description: data.description || "",
      iconId: uploadId,
    };

    createCategory(payload, {
      onSuccess: (responseData) => {
        onSave?.(data);
        reset({
          name: "",
          status: "active",
          description: "",
        });
        setOpen(false);
        toast.success('Category Created successfully!');
      },
      onError: (error: any) => {
        console.error("API Error:", error);

        // ✅ Error toast
        toast.error("Failed to Create Category")
      },
    });
  };

  const handleFileUpload = async (file: File) => {
    try {
      // Step 1: Get presigned link from backend
      const { url, fields, uploadId } = await getCategoryUploadLink(file.type);
      setUploadId(uploadId);
      setValue("image", file);
      await uploadToS3(file, url, fields);
      // Store values in state for API use
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };
  const handleFormSubmit = (e?: React.FormEvent) => {
    console.log("Submit button clicked");
    handleSubmit(onSubmit)(e);
  };
console.log(uploadId)
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Add Category"
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
            type="button"
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
      {/* Two-column row */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {/* Category Name */}
        <div className="flex-1">
          <label className="block text-sm mb-1">Category Name</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <CommonInput
                placeholder="Write category name"
                value={field.value}
                onChange={field.onChange}
                error={!!errors.name}
                errorMessage={errors.name?.message}
              />
            )}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Status */}
        <div className="flex-1">
          <label className="block text-sm mb-1">Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <p className="text-xs text-red-500 mt-1">
              {errors.status.message}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-4">
        <label className="block text-sm mb-1">Description</label>
        <Textarea
          rows={4}
          placeholder="Write description"
          {...register("description")}
        />
      </div>

      {/* File Upload */}
      <div className="mt-4">
        <Upload
          label="Upload Icon/Image"
          onFileSelect={async (file) => {
            if (!file) return;

            console.log("Uploading file:", file);

            try {
              // ✅ Use your service + reusable S3 upload
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