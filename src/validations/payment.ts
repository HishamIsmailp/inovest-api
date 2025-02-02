import { z } from "zod";

export const paymentValidation = {
  create: z.object({
    projectId: z.string().uuid(),
    amount: z.number().positive(),
  }),

  verify: z.object({
    paymentId: z.string().uuid(),
    transactionId: z.string(),
  }),
};
