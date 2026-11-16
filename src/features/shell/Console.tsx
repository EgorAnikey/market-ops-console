"use client";

import { AssistantProvider } from "@/features/assistant/AssistantProvider";
import { AssistantPanel } from "@/features/assistant/components/AssistantPanel";
import { useDrawerModal } from "@/features/assistant/hooks/useDrawerModal";
import { CommandPaletteHost } from "@/features/command-palette/CommandPaletteHost";
import { ScopeBar } from "@/features/dashboard/components/ScopeBar";
import { DashboardViews } from "@/features/dashboard/views/DashboardViews";
import { LiveProvider, useLive } from "@/features/live/LiveProvider";
import { AppHeader } from "./AppHeader";
import { SkipLinks } from "./SkipLinks";

export function Console() {
  return (
    <AssistantProvider>
      <LiveProvider>
        <ConsoleLayout />
        <CommandPaletteHost />
      </LiveProvider>
    </AssistantProvider>
  );
}

function ConsoleLayout() {
  const modal = useDrawerModal();
  const { revision } = useLive();
  return (
    <>
      <SkipLinks />
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0" inert={modal}>
          <AppHeader />
          <main
            id="main"
            tabIndex={-1}
            data-live-revision={revision}
            className="mx-auto flex max-w-[1600px] flex-col gap-3 px-3 pt-3 pb-10 sm:px-5"
          >
            <ScopeBar />
            <DashboardViews />
          </main>
        </div>
        <AssistantPanel />
      </div>
    </>
  );
}
