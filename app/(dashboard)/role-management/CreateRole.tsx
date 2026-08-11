"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import CommonInput from "@/components/ui/input";
import Upload from "@/components/ui/upload";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";


import { uploadToS3 } from "@/lib/s3Upload";
import { useCreateRoleMutation } from "@/hooks/useRolesMutations";
import { uploadRoleIcon } from "@/services/roles/rolesService";
import { toast } from "react-toastify";

// Matches the backend's USER_ROLES enum - the "role" column is a native
// enum, not free text, so this has to be a fixed choice, not a text input.
// "admin" is excluded: the backend rejects creating that role outright.
// "photographer" is hidden for now (not in active use yet).
export const ROLE_OPTIONS = [
    { value: "user", label: "User" },
    { value: "influencer", label: "Influencer" },
    { value: "service_provider", label: "Service Provider" },
    { value: "subAdmin", label: "Sub Admin" },
    // { value: "photographer", label: "Photographer" },
    { value: "business_owner", label: "Business Owner" },
];

// ✅ Schema validation
const schema = z.object({
    role: z.string().min(1, "Please select a role"),
    description: z.string().optional(),
    image: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

interface AddRoleModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onSave: (formData: any) => void;
}

export default function AddRoleModal({ open, setOpen, onSave }: AddRoleModalProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const { mutate: createRole, isPending } = useCreateRoleMutation();

    const [uploadIds, setUploadIds] = useState<string[]>([]);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleResetForm = () => {
        reset({
            role: "",
            description: "",
            image: undefined,
        });
        setPreviewUrl(null);
        setUploadIds([]);
    };


    const handleMultipleFileUpload = async (files: File[]) => {
        try {
            const uploadedIds: string[] = [];

            for (const file of files) {
                const { url, fields, uploadId } = await uploadRoleIcon(file.type);
                await uploadToS3(file, url, fields);
                uploadedIds.push(uploadId);

                setPreviewUrl(URL.createObjectURL(file));

            }

            setUploadIds((prev) => [...prev, ...uploadedIds]);
            setValue("image", uploadedIds);
        } catch (error: any) {
            console.error("File upload failed:", error);
            const apiMessage = error?.response?.data?.message;
            const reason = Array.isArray(apiMessage) ? apiMessage.join(", ") : apiMessage;
            toast.error(reason || "Icon upload failed. Please use a JPG or PNG image.");
        }
    };

    //  Handle form submit
    const onSubmit = (data: FormData) => {
        const payload = {
            role: data.role,
            iconId: uploadIds.length ? uploadIds[0] : undefined,
            roleDescription: data.description,
        };

        createRole(payload, {
            onSuccess: () => {
                toast.success("Role created Successfully !");
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
            title="Add Role"
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
                    <label className="block text-sm mb-1">Role</label>
                    <Select
                        value={watch("role")}
                        onValueChange={(val) => setValue("role", val, { shouldValidate: true })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            {ROLE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.role && (
                        <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>
                    )}
                </div>

                <div className="flex-1">
                    <label className="block text-sm mb-1 ">Description</label>
                    <CommonInput 
                        placeholder="Description"
                        {...register("description")}
                    />
                    {errors.description && (
                        <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
                    )}
                </div>
            </div>

            {/* File Upload */}
            < div className="mt-4" >
                <Upload
                    label="Upload Images"
                    multiple
                    accept="image/jpeg,image/jpg,image/png"
                    formatsLabel="JPG, PNG"
                    onFileSelect={async (files) => {
                        if (!files?.length) return;
                        await handleMultipleFileUpload(files);
                    }}
                />
            </div >
        </Modal >
    );
}