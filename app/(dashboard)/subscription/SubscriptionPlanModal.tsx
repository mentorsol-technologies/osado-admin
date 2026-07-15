"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import CommonInput from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
} from "@/hooks/useSubscriptionMutations";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number({ invalid_type_error: "Price is required" }).min(0, "Price must be 0 or more"),
  currency: z.string().min(1, "Currency is required"),
  billingCycle: z.enum(["monthly", "yearly"], {
    errorMap: () => ({ message: "Select a billing cycle" }),
  }),
  features: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface SubscriptionPlanModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  planData?: any | null;
}

export default function SubscriptionPlanModal({
  open,
  setOpen,
  planData,
}: SubscriptionPlanModalProps) {
  const isEdit = Boolean(planData?.id);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      currency: "KWD",
      billingCycle: "monthly",
    },
  });

  const { mutate: createPlan, isPending: isCreating } =
    useCreateSubscriptionPlanMutation();
  const { mutate: updatePlan, isPending: isUpdating } =
    useUpdateSubscriptionPlanMutation();

  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (open) {
      reset({
        name: planData?.name || "",
        description: planData?.description || "",
        price: planData?.price ?? undefined,
        currency: planData?.currency || "KWD",
        billingCycle: planData?.billingCycle || "monthly",
        features: planData?.features?.join("\n") || "",
      });
    }
  }, [open, planData, reset]);

  const onSubmit = (data: FormData) => {
    const payload = {
      name: data.name,
      description: data.description || undefined,
      price: data.price,
      currency: data.currency,
      billingCycle: data.billingCycle,
      features: data.features
        ? data.features.split("\n").map((f) => f.trim()).filter(Boolean)
        : [],
    };

    if (isEdit) {
      updatePlan(
        { id: planData.id, data: payload },
        { onSuccess: () => setOpen(false) },
      );
    } else {
      createPlan(payload, { onSuccess: () => setOpen(false) });
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title={isEdit ? "Edit Subscription Plan" : "Add New Subscription Plan"}
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={handleSubmit(onSubmit)}
            className="flex-1"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Submit"}
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-white p-2">
        <div>
          <label className="block text-sm mb-1">Plan Name</label>
          <CommonInput placeholder="e.g. Premium Plan" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Description</label>
          <Textarea
            placeholder="Plan description"
            {...register("description")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Price</label>
            <CommonInput
              type="number"
              placeholder="00"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">Currency</label>
            <CommonInput placeholder="KWD" {...register("currency")} />
            {errors.currency && (
              <p className="text-xs text-red-500 mt-1">{errors.currency.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Billing Cycle</label>
          <Controller
            control={control}
            name="billingCycle"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select billing cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.billingCycle && (
            <p className="text-xs text-red-500 mt-1">
              {errors.billingCycle.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">
            Features (one per line)
          </label>
          <Textarea
            placeholder={"Feature 1\nFeature 2"}
            {...register("features")}
          />
        </div>

      </form>
    </Modal>
  );
}
