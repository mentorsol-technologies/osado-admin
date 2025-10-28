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
import { Briefcase, Dumbbell, Utensils, Plus, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const schema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  serviceName: z.string().min(1, "Service name is required"),
  amount: z.string().min(1, "Amount is required"),
  status: z.enum(["Confirmed", "Pending", "Cancelled"]),
});

type FormData = z.infer<typeof schema>;

interface AddBookingModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedBooking?: {
    bookingId: string;
    serviceName: string;
    amount: string;
    status: string;
  };
  onSave: (data: FormData) => void;
}

export default function AddBookingModal({
  open,
  setOpen,
  selectedBooking,
  onSave,
}: AddBookingModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      bookingId: selectedBooking?.bookingId || "",
      serviceName: selectedBooking?.serviceName || "",
      amount: selectedBooking?.amount || "",
      status:
        (selectedBooking?.status as "Confirmed" | "Pending" | "Cancelled") ||
        "Confirmed",
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
      title="Add Booking"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={handleSubmit(onSubmit)}
            className="flex-1 bg-red-600 hover:bg-red-700"
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
      {/* Top user section */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-6 mb-6">
        {/* Provider */}
        <div className="flex justify-between items-center w-full gap-3">
          <div className="flex items-center gap-3">
            <img
              src="https://randomuser.me/api/portraits/women/30.jpg"
              alt="Provider"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-white">Emily Carter</p>
              <p className="text-xs text-gray-400">Photographer</p>
            </div>
          </div>
          <RefreshCw className="h-5 w-5 text-white cursor-pointer" />
        </div>

        {/* Customer */}
        <div className="flex justify-between items-center w-full gap-3">
          <div className="flex items-center gap-3">
            <img
              src="https://randomuser.me/api/portraits/men/20.jpg"
              alt="Customer"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-white">Keith White</p>
              <p className="text-xs text-gray-400">Customer</p>
            </div>
          </div>
          <RefreshCw className="h-5 w-5 text-white cursor-pointer" />
        </div>
      </div>
      {/* Booking ID + Service Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1">Booking ID</label>
          <CommonInput placeholder="Booking ID" {...register("bookingId")} />
          {errors.bookingId && (
            <p className="text-xs text-red-500">{errors.bookingId.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Service Name</label>
          <CommonInput
            placeholder="Service Name"
            {...register("serviceName")}
          />
          {errors.serviceName && (
            <p className="text-xs text-red-500">{errors.serviceName.message}</p>
          )}
        </div>
      </div>

      {/* Category section */}
      <div className="mb-4 ">
        <label className="block text-sm mb-2">Category</label>
        <div className="flex flex-col lg:flex-row  flex-wrap gap-2">
          <Badge className="flex items-center w-fit gap-1 px-3 py-1">
            <Briefcase size={14} />
            Business & Networking
          </Badge>

          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1 w-fit"
          >
            <Dumbbell size={14} />
            Sports & Fitness
          </Badge>

          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1 w-fit"
          >
            <Utensils size={14} />
            Food & Drink
          </Badge>

          <Badge className="flex items-center gap-1 px-3 py-1 w-fit">
            <Plus size={14} />5
          </Badge>
        </div>
      </div>

      {/* Amount + Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1">Amount</label>
          <CommonInput placeholder="Amount" {...register("amount")} />
          {errors.amount && (
            <p className="text-xs text-red-500">{errors.amount.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Status</label>
          <Select
            defaultValue={selectedBooking?.status || "Confirmed"}
            onValueChange={(val) =>
              setValue("status", val as "Confirmed" | "Pending" | "Cancelled")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-xs text-red-500">{errors.status.message}</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
