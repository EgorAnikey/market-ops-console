"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { SessionUser } from "@/contracts/session";
import { can, type Permission } from "@/domain/permissions";

interface SessionValue {
  user: SessionUser | null;
  can: (permission: Permission) => boolean;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ user, children }: { user: SessionUser | null; children: ReactNode }) {
  const value = useMemo(() => ({ user, can: (p: Permission) => can(user?.role, p) }), [user]);
  return <SessionContext value={value}>{children}</SessionContext>;
}

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
  return ctx;
}
