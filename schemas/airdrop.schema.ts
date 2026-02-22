import { z } from "zod";

export const airdropSchema = z.object({
  tokenAddress: z
    .string()
    .startsWith("0x", "Must start with 0x")
    .length(42, "Invalid token address"),

  recipients: z.string().min(1, "At least one recipient is required"),
  amounts: z.string().min(1, "At least one amount is required"),
});

export type AirdropSchema = z.infer<typeof airdropSchema>;
