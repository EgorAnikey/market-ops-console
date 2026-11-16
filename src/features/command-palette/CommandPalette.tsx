"use client";

import { Command } from "cmdk";
import { Globe2, Layers, MapPin, Package, Sparkles } from "lucide-react";
import { useState } from "react";
import { useAssistantActions } from "@/features/assistant/AssistantProvider";
import { useDashboardState } from "@/features/dashboard/state/useDashboardState";
import { useCommandItems, type CommandItem } from "./useCommandItems";
import { useCommandPalette } from "./useCommandPalette";

const GROUP_ICONS = { Navigate: Globe2, Regions: Layers, Markets: MapPin, Products: Package } as const;
const GROUPS = Object.keys(GROUP_ICONS) as CommandItem["group"][];
const itemClass =
  "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-fg data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent";

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const { scope, drillTo } = useDashboardState();
  const { prefill } = useAssistantActions();
  const items = useCommandItems(scope);
  const [search, setSearch] = useState("");

  const close = () => {
    setOpen(false);
    setSearch("");
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(next) => (next ? setOpen(true) : close())}
      label="Jump to a market, region or product"
      overlayClassName="fixed inset-0 z-50 bg-black/40"
      contentClassName="fixed top-[15vh] left-1/2 z-50 w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-surface shadow-pop"
    >
      <Command.Input
        value={search}
        onValueChange={setSearch}
        placeholder="Search markets, regions, products…"
        className="w-full border-b border-border bg-transparent px-4 py-3 text-sm text-fg outline-none placeholder:text-fg-subtle"
      />
      <Command.List className="relative max-h-[50vh] overflow-y-auto p-2">
        <Command.Empty className="px-2 py-6 text-center text-sm text-fg-subtle">No matches.</Command.Empty>
        {GROUPS.map((group) => {
          const Icon = GROUP_ICONS[group];
          return (
            <Command.Group
              key={group}
              heading={group}
              className="mb-1 text-[0.6875rem] font-medium text-fg-subtle [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1"
            >
              {items
                .filter((i) => i.group === group)
                .map((item) => (
                  <Command.Item
                    key={item.id}
                    value={`${item.label} ${item.id}`}
                    keywords={item.keywords}
                    onSelect={() => {
                      drillTo(item.scope);
                      close();
                    }}
                    className={itemClass}
                  >
                    <Icon aria-hidden className="size-4 text-fg-subtle" />
                    {item.label}
                    <span className="ml-auto text-xs text-fg-subtle">{item.hint}</span>
                  </Command.Item>
                ))}
            </Command.Group>
          );
        })}
        {search.trim() ? (
          <Command.Item
            value={`ask ${search}`}
            onSelect={() => {
              prefill(search.trim());
              close();
            }}
            className={itemClass}
          >
            <Sparkles aria-hidden className="size-4 text-ai" /> Ask the assistant: “{search.trim()}”
          </Command.Item>
        ) : null}
      </Command.List>
    </Command.Dialog>
  );
}
