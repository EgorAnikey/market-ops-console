"use client";

import { Activity, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Kbd } from "@/components/ui/Kbd";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useAssistantActions } from "@/features/assistant/AssistantProvider";
import { useCommandPalette } from "@/features/command-palette/useCommandPalette";
import { PeriodSelect } from "@/features/dashboard/components/PeriodSelect";
import { useDashboardState } from "@/features/dashboard/state/useDashboardState";
import type { DashboardView } from "@/features/dashboard/state/url-params";
import { LiveToggle } from "@/features/live/LiveToggle";
import { UserMenu } from "@/features/session/UserMenu";
import { LocaleSelect } from "./LocaleSelect";

const VIEW_OPTIONS = [
  { value: "executive", label: "Executive" },
  { value: "analyst", label: "Analyst" },
] as const satisfies readonly { value: DashboardView; label: string }[];

export function AppHeader() {
  const { view, setView } = useDashboardState();
  const { setOpen } = useAssistantActions();
  const palette = useCommandPalette();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2 sm:px-5">
        <h1 className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <Activity aria-hidden className="size-5 text-accent" />
          <span>
            Market Ops<span className="sr-only"> console</span>
          </span>
        </h1>
        <SegmentedControl label="Audience view" options={VIEW_OPTIONS} value={view} onChange={setView} />
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <LiveToggle />
          <PeriodSelect />
          <LocaleSelect />
          <Button size="md" onClick={() => palette.setOpen(true)} aria-keyshortcuts="Meta+K Control+K">
            <Search aria-hidden className="size-4" />
            <span className="sr-only sm:not-sr-only">Jump to…</span>
            <Kbd>⌘K</Kbd>
          </Button>
          <Button
            variant="primary"
            className="xl:hidden"
            onClick={() => setOpen(true)}
            aria-controls="assistant"
          >
            <Sparkles aria-hidden className="size-4" /> Ask
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
