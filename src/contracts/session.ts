import { z } from "zod";

export const ROLES = ["viewer", "analyst"] as const;
export const roleSchema = z.enum(ROLES);
export type Role = z.infer<typeof roleSchema>;

export const sessionUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  role: roleSchema,
});
export type SessionUser = z.infer<typeof sessionUserSchema>;
