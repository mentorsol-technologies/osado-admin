"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import CommonInput from "@/components/ui/input";
import Upload from "@/components/ui/upload";
import { toast } from 'react-toastify';


import { uploadToS3 } from "@/lib/s3Upload";
import { useCreateRoleMutation } from "@/hooks/useRolesMutations";
import { uploadRoleIcon } from "@/services/roles/rolesService";
import { Textarea } from "@/components/ui/textarea";

// ✅ Schema validation
const schema = z.object({
    role: z.string().min(2, "role name is required"),
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
        } catch (error) {
            console.error("File upload failed:", error);
        }
    };

    //  Handle form submit
    const onSubmit = (data: FormData) => {
        const payload = {
            role: data.role,
            iconId: uploadIds.length ? uploadIds[0] : undefined,
            description: data.description,
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
                    <CommonInput
                        placeholder="Role"
                        {...register("role")}
                    />
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
                    onFileSelect={async (files) => {
                        if (!files?.length) return;
                        await handleMultipleFileUpload(files);
                    }}
                />
            </div >
        </Modal >
    );
}