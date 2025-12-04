"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CommonInput from "@/components/ui/input";
import Modal from "@/components/ui/Modal";
import { useCreateBussinessOwnerMutation } from "@/hooks/useBussinessOwnerMutations";
import { useState } from "react";
import { Country, useCountries } from "@/components/ui/CountryPicker";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  surName: z.string().min(1, "Surname is required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

interface AddBusinessOwnerModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave: (data: FormData) => void;
}

export default function AddBusinessOwnerModal({
  open,
  setOpen,
  onSave,
}: AddBusinessOwnerModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      surName: "",
      email: "",
      password: "",
    },
  });

  const { mutate: createOwner, isPending } = useCreateBussinessOwnerMutation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const countries = useCountries();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    countries.find((c) => c.iso3 === "KWT") || null
  );

  const onSubmit = (data: FormData) => {
    const payload = {
      name: data.name,
      surName: data.surName,
      email: data.email,
      phoneNumber,
      callingCode: selectedCountry?.code || "+965",
      countryCode: selectedCountry?.iso3 || "KWT",
      password: data.password,
    };

    createOwner(payload, {
      onSuccess: () => {
        setOpen(false);
      },
      onError: (err) => {
        console.error("Create Owner Error:", err);
      },
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Add Business Owner"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={handleSubmit(onSubmit)}
            className="flex-1 bg-red-600 hover:bg-red-700 rounded-lg"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit"}
          </Button>

          <Button
            variant="outline"
            className="flex-1 rounded-lg"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </div>
      }
    >
      {/* Two-column responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <CommonInput
            label="Name"
            placeholder="Write name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>
        {/* Surname */}
        <div>
          <CommonInput
            label="Surname"
            placeholder="Write surname"
            {...register("surName")}
          />
          {errors.surName && (
            <p className="text-xs text-red-500">{errors.surName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <CommonInput
            label="Email address"
            placeholder="Write email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
        <CommonInput
          label="Phone Number"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          maxLength={15}
          countries={countries}
          selectedCountry={selectedCountry || undefined}
          onCountryChange={setSelectedCountry}
          showCountryDropdown
        />
      </div>
      {/* Password */}
      <div>
        <CommonInput
          label="Password"
          type="password"
          placeholder="Write password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>
    </Modal>
  );
}
