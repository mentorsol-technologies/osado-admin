"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";

import Modal from "@/components/ui/Modal";
import CommonInput from "@/components/ui/input";
import Upload from "@/components/ui/upload";

const schema = z.object({
  title: z.string().min(2, "Category name is required"),
  country_code: z.string().optional(),
  description: z.string().optional(),
  image: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

interface EditCountryModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedCountry?: {
    title: string;
    country_code: string;
    description?: string;
    image?: string;
  };
  onSave: (data: FormData) => void;
}

export default function EditCountryModal({
  open,
  setOpen,
  selectedCountry,
  onSave,
}: EditCountryModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: selectedCountry?.title || "",
      country_code: selectedCountry?.country_code,
      description: selectedCountry?.description || "",
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
      title="Edit Country"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button onClick={handleSubmit(onSubmit)} className=" flex-1">
            Save
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
          <CommonInput placeholder="Category Name" {...register("title")} />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="flex-1 flex-col sm:flex-row">
          <label className="block text-sm mb-1">Country code</label>
          <CommonInput placeholder="+965" {...register("country_code")} />
          {errors.country_code && (
            <p className="text-xs text-red-500 mt-1">
              {errors.country_code.message}
            </p>
          )}
        </div>
      </div>

      {/* File Upload */}
      <div className="mt-4">
        <Upload
          label="Upload Flag"
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
