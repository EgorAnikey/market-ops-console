"use server";

import { redirect } from "next/navigation";
import { safeReturnTo } from "@/lib/safe-redirect";
import { findUser } from "./directory";
import { endSession, startSession } from "./session";

export async function signIn(formData: FormData): Promise<void> {
  const user = findUser(formData.get("user"));
  if (!user) redirect("/signin");
  await startSession(user.id);
  redirect(safeReturnTo(formData.get("returnTo")));
}

export async function signOut(): Promise<void> {
  await endSession();
  redirect("/signin");
}
