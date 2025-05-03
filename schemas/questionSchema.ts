import { z } from "zod";

export const questionSchema = z.object({
    message: z
        .string()
        .max(100, { message: "Questions must be of less than 100 characters" }),
});

export type questionType = z.infer<typeof questionSchema>;
