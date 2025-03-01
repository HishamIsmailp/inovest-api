import { z } from "zod";

export const authValidation = {
  signup: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["INVESTOR", "ENTREPRENEUR"]),
  }),

  login: z.object({
    email: z.string().email(),
    password: z.string(),
  }),

  forgotPassword: z.object({
    email: z.string().email(),
  }),

  resetPassword: z.object({
    token: z.string(),
    password: z.string().min(8),
  }),
};
