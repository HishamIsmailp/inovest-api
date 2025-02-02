import { z } from 'zod';

export const userValidation = {
  updateProfile: z.object({
    name: z.string().min(2).max(100).optional(),
    imageUrl: z.string().url().optional(),
  }),

  updateRole: z.object({
    role: z.enum(['INVESTOR', 'ENTREPRENEUR'])
  })
};
