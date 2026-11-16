import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import type { SessionUser } from "@/contracts/session";
import { findUser } from "./directory";

export const SESSION_COOKIE = "mo.session";
const EIGHT_HOURS_S = 60 * 60 * 8;

export const getSession = cache(async (): Promise<SessionUser | null> =>
  findUser((await cookies()).get(SESSION_COOKIE)?.value),
);

export async function startSession(userId: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: EIGHT_HOURS_S,
    path: "/",
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
