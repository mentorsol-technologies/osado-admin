"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import CommonInput from "@/components/ui/input";
import Upload from "@/components/ui/upload";
import { toast } from 'react-toastify';


import {
  useUpdateCountryMutation,
  useUploadCountryFileMutation,
} from "@/hooks/useCountryMutations";

// ✅ Schema validation
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
  };
  onSave?: () => void;
}

export default function EditCountryModal({
  open,
  setOpen,
  selectedCountry,
  onSave,
}: EditCountryModalProps) {
  const { mutate: updateCountry, status, isLoading } = useUpdateCountryMutation();
  const { mutateAsync: uploadCountryFile, isPending: isUploading } =
    useUploadCountryFileMutation();

  const [uploadId, setUploadId] = useState<string>("");

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
      countryCode: "",
      image: undefined,
    },
  });

  // ✅ Populate form when selectedCountry changes
  useEffect(() => {
    if (selectedCountry) {
      console.log("Populating form with selectedCountry:", selectedCountry);
      reset({
        name: selectedCountry.name || "",
        countryCode: selectedCountry.countryCode || "",
        image: selectedCountry.image || undefined,
      });
    }
  }, [selectedCountry, reset]);

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
          toast.success("Country updated Successfully !")
          reset();
          setOpen(false);
          onSave?.();
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
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Saving..." : "Save"}
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
        {/* Country Name */}
        <div className="flex-1">
          <label className="block text-sm mb-1">Country Name</label>
          <CommonInput
            placeholder="Country Name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Country Code */}
        <div className="flex-1">
          <label className="block text-sm mb-1">Country Code</label>
          <CommonInput
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

      {/* Upload Flag */}
      <div className="mt-4">
        <Upload
          label="Upload Flag"
          onFileSelect={async (file) => {
            if (file) {
              try {
                const result = await uploadCountryFile(file);
                setUploadId(result?.uploadId || "");
                setValue("image", file);
              } catch (err) {
                console.error("File upload failed:", err);
              }
            }
          }}
        />
        {isUploading && (
          <p className="text-sm text-blue-500 mt-1">Uploading...</p>
        )}

        {/* Existing Image Preview */}
        {selectedCountry?.image && (
          <div className="mt-2">
            <img
              src={selectedCountry.image}
              alt="Current Flag"
              className="w-16 h-16 rounded-md border"
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
