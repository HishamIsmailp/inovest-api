import { z } from 'zod';

export const projectValidation = {
    create: z.object({
      title: z.string().min(5).max(200),
      abstract: z.string().min(20),
      expectedInvestment: z.number().positive(),
      categoryId: z.string().uuid(),
    }),
  
    update: z.object({
      title: z.string().min(5).max(200).optional(),
      abstract: z.string().min(20).optional(),
      expectedInvestment: z.number().positive().optional(),
      categoryId: z.string().uuid().optional(),
    }),
  
    updateStatus: z.object({
      status: z.enum(['AVAILABLE', 'UNDER_DISCUSSION', 'BOOKED', 'INVESTED']),
    }),
  
    rate: z.object({
      rating: z.number().min(1).max(5),
      comment: z.string().optional(),
    }),
  };
  