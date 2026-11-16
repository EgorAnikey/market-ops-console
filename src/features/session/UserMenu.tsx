"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ROLE_LABEL } from "@/domain/permissions";
import { signOut } from "@/server/auth/actions";
import { useSession } from "./SessionProvider";

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

export function UserMenu() {
  const { user } = useSession();
  if (!user) return null;
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden
        className="inline-flex size-8 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent"
      >
        {initials(user.name)}
      </span>
      <span className="hidden flex-col leading-tight 2xl:flex">
        <span className="text-xs font-medium text-fg">{user.name}</span>
        <span className="text-[0.6875rem] text-fg-subtle">{ROLE_LABEL[user.role]}</span>
      </span>
      <form action={signOut}>
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          aria-label={`Sign out ${user.name} (${ROLE_LABEL[user.role]})`}
          title={`${user.name} · ${ROLE_LABEL[user.role]} · Sign out`}
        >
          <LogOut aria-hidden className="size-4" />
        </Button>
      </form>
    </div>
  );
}
