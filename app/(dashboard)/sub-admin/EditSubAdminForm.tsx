"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import CommonInput from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  surname: z.string().min(1, "Surname is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  permissions: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

interface EditSubAdminModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave: (data: FormData) => void;
  selectedAdmin?: FormData; // Pre-fill values
}

const permissionsList = [
  "Manage Events",
  "Manage Photographers",
  "Manage Influencers",
  "Handle Transactions",
  "View Analytics",
  "Manage Categories",
  "Manage Refunds",
  "Access Chat Support",
];

export default function EditSubAdminModal({
  open,
  setOpen,
  onSave,
  selectedAdmin,
}: EditSubAdminModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: selectedAdmin?.fullName || "",
      surname: selectedAdmin?.surname || "",
      email: selectedAdmin?.email || "",
      password: selectedAdmin?.password || "",
      permissions: selectedAdmin?.permissions || [],
    },
  });

  const onSubmit = (data: FormData) => {
    onSave(data);
    setOpen(false);
  };

  const selectedPermissions = watch("permissions") || [];

  const handlePermissionChange = (permission: string, checked: boolean) => {
    const updated = checked
      ? [...selectedPermissions, permission]
      : selectedPermissions.filter((p) => p !== permission);

    setValue("permissions", updated, { shouldValidate: true });
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Edit Sub Admin"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button onClick={handleSubmit(onSubmit)} className="flex-1">
            Save
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

           <Button
            variant="outline"
            className="flex-1 block sm:hidden"
            onClick={() => setOpen(false)}
          >
            Delete Sub Admin
          </Button>
        </div>
      }
    >
      {/* Full Name + Surname */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1">Full Name</label>
          <CommonInput placeholder="Write full name" {...register("fullName")} />
          {errors.fullName && (
            <p className="text-xs text-red-500">{errors.fullName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Surname</label>
          <CommonInput placeholder="Write your surname" {...register("surname")} />
          {errors.surname && (
            <p className="text-xs text-red-500">{errors.surname.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1">Email Address</label>
          <CommonInput placeholder="Write email address" {...register("email")} />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <CommonInput
            type="password"
            placeholder="Write password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>
      </div>


      {/* Permissions */}
      <div className="mb-4">
        <label className="block text-sm mb-2">Update Permissions</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {permissionsList.map((permission) => (
            <Checkbox
              key={permission}
              label={permission}
              checked={selectedPermissions.includes(permission)}
              onCheckedChange={(checked) =>
                handlePermissionChange(permission, checked as boolean)
              }
            />
          ))}
        </div>
      </div>
    </Modal>
  );
}
