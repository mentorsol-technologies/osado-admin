"use client";

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

const schema = z.object({
  title: z.string().min(2, "Category name is required"),
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
    title: string;
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
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: selectedCategory?.title || "",
      status: (selectedCategory?.status as "Active" | "Inactive") || "Active",
      description: selectedCategory?.description || "",
    },
  });

  const onSubmit = (data: FormData) => {
    onSave(data);
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Add Subcategory"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button onClick={handleSubmit(onSubmit)} className=" flex-1">
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
      {/* Two-column row */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="flex-1 flex-col sm:flex-row ">
          <label className="block text-sm mb-1">Category Name</label>
          <CommonInput
            placeholder=" Write category name"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="flex-1 flex-col sm:flex-row">
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
        <Textarea
          rows={4}
          placeholder="Write description"
          {...register("description")}
        />
      </div>

      {/* Assign to Category */}
      <div className="mt-4">
        <label className="block text-sm mb-1">Assign to Category</label>
        <Select onValueChange={(val) => setValue("assign_category", val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Travel & Outdoor">Travel & Outdoor</SelectItem>
            <SelectItem value="Camping">Camping</SelectItem>
            <SelectItem value="Hiking">Hiking</SelectItem>
            <SelectItem value="Backpacks">Backpacks</SelectItem>
            <SelectItem value="Luggage">Luggage</SelectItem>
            <SelectItem value="Tents">Tents</SelectItem>
            <SelectItem value="Sleeping Bags">Sleeping Bags</SelectItem>
            <SelectItem value="Travel Accessories">
              Travel Accessories
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* File Upload */}
      <div className="mt-4">
        <Upload
          label="Upload Icon/Image"
          onFileSelect={(file) => {
            if (file) {
              console.log("Selected File:", file);
              setValue("image", file);
            }
          }}
        />
      </div>
    </Modal>
  );
}
