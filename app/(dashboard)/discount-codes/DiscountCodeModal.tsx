"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import CommonInput from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  useCreateDiscountCodeMutation,
  useUpdateDiscountCodeMutation,
} from "@/hooks/useDiscountCodeMutations";

const schema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "Code may only contain letters, numbers, hyphens and underscores",
    ),
  description: z.string().optional(),
  value: z
    .number({ invalid_type_error: "Percentage is required" })
    .min(0, "Percentage must be 0 or more")
    .max(100, "Percentage cannot exceed 100"),
  perUserLimit: z.number().min(1).optional(),
  validFrom: z.string().optional(),
  validUntil: z.string().optional(),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface DiscountCodeModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  codeData?: any | null;
}

export default function DiscountCodeModal({
  open,
  setOpen,
  codeData,
}: DiscountCodeModalProps) {
  const isEdit = Boolean(codeData?.id);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      isActive: true,
    },
  });

  const { mutate: createCode, isPending: isCreating } =
    useCreateDiscountCodeMutation();
  const { mutate: updateCode, isPending: isUpdating } =
    useUpdateDiscountCodeMutation();

  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (open) {
      reset({
        code: codeData?.code || "",
        description: codeData?.description || "",
        value: codeData?.value != null ? Number(codeData.value) : undefined,
        perUserLimit: codeData?.perUserLimit ?? 1,
        validFrom: codeData?.validFrom ? codeData.validFrom.slice(0, 10) : "",
        validUntil: codeData?.validUntil ? codeData.validUntil.slice(0, 10) : "",
        isActive: codeData?.isActive ?? true,
      });
    }
  }, [open, codeData, reset]);

  const onSubmit = (data: FormData) => {
    const payload = {
      code: data.code,
      description: data.description || undefined,
      value: data.value,
      perUserLimit: data.perUserLimit || undefined,
      validFrom: data.validFrom || undefined,
      validUntil: data.validUntil || undefined,
      isActive: data.isActive,
    };

    if (isEdit) {
      updateCode(
        { id: codeData.id, data: payload },
        { onSuccess: () => setOpen(false) },
      );
    } else {
      createCode(payload, { onSuccess: () => setOpen(false) });
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title={isEdit ? "Edit Discount Code" : "Add New Discount Code"}
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
          <label className="block text-sm mb-1">Code</label>
          <CommonInput placeholder="e.g. SUMMER25" {...register("code")} />
          {errors.code && (
            <p className="text-xs text-red-500 mt-1">{errors.code.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Description</label>
          <Textarea
            placeholder="Admin-facing note about this code"
            {...register("description")}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Percent off (%)</label>
          <CommonInput
            type="number"
            placeholder="25"
            {...register("value", { valueAsNumber: true })}
          />
          {errors.value && (
            <p className="text-xs text-red-500 mt-1">{errors.value.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Uses Per User</label>
          <CommonInput
            type="number"
            placeholder="1"
            {...register("perUserLimit", { valueAsNumber: true })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Valid From</label>
            <CommonInput type="date" {...register("validFrom")} />
          </div>
          <div>
            <label className="block text-sm mb-1">Valid Until</label>
            <CommonInput type="date" {...register("validUntil")} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm">Active</label>
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>
      </form>
    </Modal>
  );
}
