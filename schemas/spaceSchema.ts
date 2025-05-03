import { z } from "zod";

export const spaceSchema = z.object({
    name: z.string().min(3).max(20),
    header: z.string().min(5).max(50),
    description: z.string(),
    userName: z.boolean().optional(),
    userEmail: z.boolean().optional(),
    userSocials: z.boolean().optional(),
    userAddress: z.boolean().optional(),
});

export type spaceType = z.infer<typeof spaceSchema>;
