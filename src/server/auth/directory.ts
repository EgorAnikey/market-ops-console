import "server-only";
import type { SessionUser } from "@/contracts/session";

export const DIRECTORY: readonly SessionUser[] = [
  { id: "dana", name: "Dana Reyes", email: "dana.reyes@example.com", role: "analyst" },
  { id: "sam", name: "Sam Okafor", email: "sam.okafor@example.com", role: "viewer" },
];

export const findUser = (id: unknown): SessionUser | null => DIRECTORY.find((u) => u.id === id) ?? null;
