import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    price: z.number().positive(),
    categoryId: z.string()
  })
});
