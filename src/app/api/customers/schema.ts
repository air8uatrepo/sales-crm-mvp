import { z } from "zod";

// Zod schema for the customer create/update form. Company name is required;
// the other fields are optional free-text. Values are trimmed.
export const customerInputSchema = z
  .object({
    company_name: z.string().trim().min(1, "Company name is required"),
    company_contact: z.string().trim().optional().nullable(),
    buyer_name: z.string().trim().optional().nullable(),
    bd_email: z.string().trim().optional().nullable(),
  })
  .strict();

export type CustomerInput = z.input<typeof customerInputSchema>;
