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
});

type FormData = z.infer<typeof schema>;

interface AddCategoryModalProps {
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

export default function AddCategoryModal({
  open,
  setOpen,
  selectedCategory,
  onSave,
}: AddCategoryModalProps) {
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
      title="Add Category"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={handleSubmit(onSubmit)}
            className=" flex-1"
          >
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
    <CommonInput placeholder=" Write category name" {...register("title")} />
    {errors.title && (
      <p className="text-xs text-red-500 mt-1">
        {errors.title.message}
      </p>
    )}
  </div>

  <div className="flex-1 flex-col sm:flex-row">
    <label className="block text-sm mb-1">Status</label>
    <Select
      defaultValue={selectedCategory?.status || "Active"}
      onValueChange={(val) => setValue("status", val as "Active" | "Inactive")}
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
