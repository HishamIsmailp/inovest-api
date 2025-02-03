import { z } from "zod";

export const categoryValidation = {
  create: z.object({
    name: z.string().min(2).max(50).trim(),
    description: z.string().max(500).optional(),
  }),

  update: z
    .object({
      name: z.string().min(2).max(50).trim().optional(),
      description: z.string().max(500).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
};
