import type { Role } from "@/contracts/session";

export type Permission = "alerts:write";

const GRANTS: Record<Role, readonly Permission[]> = {
  viewer: [],
  analyst: ["alerts:write"],
};

export const ROLE_LABEL: Record<Role, string> = { viewer: "Viewer", analyst: "Analyst" };

export function can(role: Role | null | undefined, permission: Permission): boolean {
  return role ? GRANTS[role].includes(permission) : false;
}
