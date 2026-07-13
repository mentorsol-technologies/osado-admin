"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import CommonInput from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateSubAdminMutation } from "@/hooks/useSubAdminMutations";
import { useEffect, useState } from "react";
import { Country, useCountries } from "@/components/ui/CountryPicker";
import { passwordRegex } from "@/lib/utils";

const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  surname: z.string().min(1, "Surname is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      passwordRegex,
      "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
    ),
  permissions: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

interface AddSubAdminModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedAdmin?: FormData;
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

export default function AddSubAdminModal({
  open,
  setOpen,
  selectedAdmin,
}: AddSubAdminModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
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
  const [phoneNumber, setPhoneNumber] = useState("");
  const countries = useCountries();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  useEffect(() => {
    if (countries.length > 0 && !selectedCountry) {
      const kuwait = countries.find((c) => c.iso3 === "KWT");
      if (kuwait) setSelectedCountry(kuwait);
    }
  }, [countries, selectedCountry]);
  const { mutate: createSubAdmin, isPending } = useCreateSubAdminMutation();
  const handleResetForm = () => {
    reset({
      fullName: "",
      surname: "",
      email: "",
      password: "",
      permissions: [],
    });
    setPhoneNumber("");
    setSelectedCountry(null);
  };

  // 🔹 Submission handler
  const onSubmit = (data: FormData) => {
    const payload = {
      name: data.fullName,
      surName: data.surname,
      email: data.email,
      password: data.password,
      permissions: data.permissions || [],
      phoneNumber,
      callingCode: selectedCountry?.code || "+965",
      countryCode: selectedCountry?.iso3 || "KWT",
      roleId: "a75721e5-3d79-46d7-9da1-91d896409e9a",
      status: "active",
    };
    createSubAdmin(payload, {
      onSuccess: () => {
        handleResetForm();
        setOpen(false);
      },
    });
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
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) handleResetForm();
      }}
      title="Add Sub Admin"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={handleSubmit(onSubmit)}
            className="flex-1"
            disabled={isPending}
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
      {/* Full Name + Surname */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1">Full Name</label>
          <CommonInput
            placeholder="Write full name"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-xs text-red-500">{errors.fullName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Surname</label>
          <CommonInput
            placeholder="Write your surname"
            {...register("surname")}
          />
          {errors.surname && (
            <p className="text-xs text-red-500">{errors.surname.message}</p>
          )}
        </div>
      </div>
      {/* Phone Number  */}
      <div>
        <label className="block text-sm mb-1">Phone Number</label>
        <CommonInput
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          maxLength={8}
          countries={countries}
          selectedCountry={selectedCountry || undefined}
          onCountryChange={setSelectedCountry}
          showCountryDropdown
        />
      </div>
      {/* Email + Password */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1">Email Address</label>
          <CommonInput
            placeholder="Write email address"
            {...register("email")}
          />
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
        <label className="block text-sm mb-2">Select Permissions</label>
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
