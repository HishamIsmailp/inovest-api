import { z } from "zod";

export const chatValidation = {
  sendMessage: z.object({
    content: z.string().min(1),
    messageType: z.enum(["TEXT", "IMAGE", "VOICE"]),
  }),
};
