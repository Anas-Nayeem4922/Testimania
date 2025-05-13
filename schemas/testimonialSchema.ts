import { z } from "zod";

export const testimonialSchema = z.object({
    review: z
        .string()
        .min(10, { message: "Review must have atleast 10 characters" }),
    rating: z.number().min(1).max(5),
    userName: z.string().optional(),
    userEmail: z.string().optional(),
    userSocials: z.string().optional(),
    userAddress: z.string().optional(),
});

export type testimonialType = z.infer<typeof testimonialSchema>;
