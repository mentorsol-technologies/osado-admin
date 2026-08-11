"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import CommonInput from "@/components/ui/input";
import Upload from "@/components/ui/upload";
import { ROLE_OPTIONS } from "./CreateRole";

import { uploadToS3 } from "@/lib/s3Upload";
import { useUpdateRoleMutation } from "@/hooks/useRolesMutations";
import { uploadRoleIcon } from "@/services/roles/rolesService";
import { toast } from "react-toastify";

const schema = z.object({
    description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface EditRoleModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedRole?: {
        id: string;
        role: string;
        roleDescription?: string | null;
        iconURL?: string | null;
    } | null;
    onSave?: (data: any) => void;
}

export default function EditRoleModal({
    open,
    setOpen,
    selectedRole,
    onSave,
}: EditRoleModalProps) {
    const { mutate: updateRole, isPending } = useUpdateRoleMutation();

    const [uploadIds, setUploadIds] = useState<string[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { description: "" },
    });

    // Populate the form whenever a different role is opened for editing
    useEffect(() => {
        if (selectedRole) {
            reset({ description: selectedRole.roleDescription || "" });
            setPreviewUrl(selectedRole.iconURL || null);
            setUploadIds([]);
        }
    }, [selectedRole, reset]);

    const handleMultipleFileUpload = async (files: File[]) => {
        try {
            const uploadedIds: string[] = [];

            for (const file of files) {
                const { url, fields, uploadId } = await uploadRoleIcon(file.type);
                await uploadToS3(file, url, fields);
                uploadedIds.push(uploadId);
                setPreviewUrl(URL.createObjectURL(file));
            }

            setUploadIds(uploadedIds);
        } catch (error: any) {
            console.error("File upload failed:", error);
            const apiMessage = error?.response?.data?.message;
            const reason = Array.isArray(apiMessage) ? apiMessage.join(", ") : apiMessage;
            toast.error(reason || "Icon upload failed. Please use a JPG or PNG image.");
        }
    };

    const onSubmit = (data: FormData) => {
        if (!selectedRole?.id) return;

        const payload: Record<string, any> = {
            roleDescription: data.description,
            ...(uploadIds.length ? { iconId: uploadIds[0] } : {}),
        };

        updateRole(
            { id: selectedRole.id, data: payload },
            {
                onSuccess: () => {
                    toast.success("Role updated successfully!");
                    setOpen(false);
                    onSave?.(payload);
                },
            },
        );
    };

    const roleLabel =
        ROLE_OPTIONS.find((opt) => opt.value === selectedRole?.role)?.label ||
        selectedRole?.role ||
        "";

    return (
        <Modal
            open={open}
            onOpenChange={setOpen}
            title="Edit Role"
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
            <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="flex-1">
                    <label className="block text-sm mb-1">Role</label>
                    <CommonInput value={roleLabel} disabled readOnly />
                    <p className="text-xs text-gray-500 mt-1">
                        The role itself can&apos;t be changed once created.
                    </p>
                </div>

                <div className="flex-1">
                    <label className="block text-sm mb-1">Description</label>
                    <CommonInput
                        placeholder="Description"
                        {...register("description")}
                    />
                    {errors.description && (
                        <p className="text-xs text-red-500 mt-1">
                            {errors.description.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Icon */}
            <div className="mt-4">
                <Upload
                    label="Upload Icon"
                    multiple={false}
                    accept="image/jpeg,image/jpg,image/png"
                    formatsLabel="JPG, PNG"
                    onFileSelect={async (files) => {
                        if (!files?.length) return;
                        await handleMultipleFileUpload(files);
                    }}
                />
                {previewUrl && (
                    <div className="mt-2">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-16 h-16 rounded-md border"
                        />
                    </div>
                )}
            </div>
        </Modal>
    );
}
