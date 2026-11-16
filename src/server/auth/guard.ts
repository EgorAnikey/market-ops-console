import "server-only";
import { can, type Permission } from "@/domain/permissions";
import { jsonError } from "@/server/http";
import { getSession } from "./session";

const signInRequired = () => jsonError(401, "Sign in to continue.");

export async function requireSession(): Promise<Response | null> {
  return (await getSession()) ? null : signInRequired();
}

export async function requirePermission(permission: Permission): Promise<Response | null> {
  const user = await getSession();
  if (!user) return signInRequired();
  return can(user.role, permission) ? null : jsonError(403, "Your role can't make this change.");
}
