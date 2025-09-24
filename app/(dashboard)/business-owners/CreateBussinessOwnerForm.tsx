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

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  country: z.string().min(1, "Country is required"),
  kycStatus: z.string().min(1, "KYC status is required"),
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
      surname: "",
      email: "",
      password: "",
      country: "",
      kycStatus: "",
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
      title="Add Business Owner"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={handleSubmit(onSubmit)}
            className="flex-1 bg-red-600 hover:bg-red-700 rounded-lg"
          >
            Submit
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
          <label className="block text-sm mb-1">Name</label>
          <CommonInput placeholder="Write name" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>
        {/* Surname */}
        <div>
          <label className="block text-sm mb-1">Surname</label>
          <CommonInput placeholder="Write surname" {...register("surname")} />
          {errors.surname && (
            <p className="text-xs text-red-500">{errors.surname.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1">Email address</label>
          <CommonInput placeholder="Write email" {...register("email")} />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
        {/* Country */}
        <div>
          <label className="block text-sm mb-1">Country</label>
          <Select
            onValueChange={(val) => setValue("country", val)}
            defaultValue=""
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USA">USA</SelectItem>
              <SelectItem value="UK">UK</SelectItem>
              <SelectItem value="Pakistan">Pakistan</SelectItem>
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-xs text-red-500">{errors.country.message}</p>
          )}
        </div>

        {/* Password */}
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
        {/* KYC Status */}
        <div>
          <label className="block text-sm mb-1">Kyc Status</label>
          <Select
            onValueChange={(val) => setValue("kycStatus", val)}
            defaultValue=""
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          {errors.kycStatus && (
            <p className="text-xs text-red-500">{errors.kycStatus.message}</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
