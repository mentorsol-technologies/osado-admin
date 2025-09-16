import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  status: z.enum(["Active", "Inactive"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.any().optional(), // will hold file object
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
