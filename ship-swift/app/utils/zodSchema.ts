import { z } from "zod";

// Zod schema for the OpenJobs model
export const AddContactSchema = z.object({
  email: z
    .string()
    .min(1, { message: "email cannot be empty" })
    .email("Please enter email"),
});
