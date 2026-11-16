import { Activity, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { ROLE_LABEL } from "@/domain/permissions";
import { safeReturnTo } from "@/lib/safe-redirect";
import { signIn } from "@/server/auth/actions";
import { DIRECTORY } from "@/server/auth/directory";
import { getSession } from "@/server/auth/session";

const ROLE_SUMMARY = {
  analyst: "Reads every view and manages alert rules.",
  viewer: "Reads every view; can't change alert rules.",
} as const;

interface SignInProps {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}

export default async function SignInPage({ searchParams }: SignInProps) {
  const returnTo = safeReturnTo((await searchParams).returnTo);
  if (await getSession()) redirect(returnTo);

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-4 py-10">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Activity aria-hidden className="size-5 text-accent" /> Market Ops
      </div>
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-semibold tracking-tight text-fg">Sign in with company SSO</h1>
        <p className="text-sm text-fg-muted">
          Demo identity provider: pick who to sign in as. A real deployment hands off to the company&apos;s
          OIDC provider here and comes back with the same session.
        </p>
      </div>
      <form action={signIn} className="flex flex-col gap-2">
        <input type="hidden" name="returnTo" value={returnTo} />
        {DIRECTORY.map((user) => (
          <button
            key={user.id}
            type="submit"
            name="user"
            value={user.id}
            className="flex flex-col items-start gap-0.5 rounded-[var(--radius-card)] border border-control-border bg-surface px-4 py-3 text-left shadow-card hover:border-accent"
          >
            <span className="flex w-full items-center justify-between gap-2 text-sm font-medium text-fg">
              {user.name}
              <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[0.6875rem] text-fg-muted">
                {ROLE_LABEL[user.role]}
              </span>
            </span>
            <span className="text-xs text-fg-subtle">{user.email}</span>
            <span className="text-xs text-fg-muted">{ROLE_SUMMARY[user.role]}</span>
          </button>
        ))}
      </form>
      <p className="flex items-center gap-1.5 text-[0.6875rem] text-fg-subtle">
        <ShieldCheck aria-hidden className="size-3.5" /> Roles are enforced by the API, not just hidden in the
        UI.
      </p>
    </main>
  );
}
