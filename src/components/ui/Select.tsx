"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  lang?: string;
}

export interface SelectGroup<T extends string = string> {
  label: string;
  options: readonly SelectOption<T>[];
}

export type SelectItem<T extends string = string> = SelectOption<T> | SelectGroup<T>;

export interface SelectProps<T extends string> {
  value: T | null;
  onChange: (value: T) => void;
  options: readonly SelectItem<T>[];
  placeholder?: string;
  size?: "sm" | "md";
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  onBlur?: () => void;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

const isGroup = <T extends string>(item: SelectItem<T>): item is SelectGroup<T> => "options" in item;

const TRIGGER_SIZE = { sm: "h-7 text-xs", md: "h-8 text-[0.8125rem]" };

function Option<T extends string>({ option }: { option: SelectOption<T> }) {
  return (
    <RadixSelect.Item
      value={option.value}
      lang={option.lang}
      className="relative flex h-8 cursor-default items-center rounded-sm pr-3 pl-7 text-[0.8125rem] text-fg outline-none select-none data-[disabled]:opacity-50 data-[highlighted]:bg-surface-2 data-[state=checked]:font-medium"
    >
      <RadixSelect.ItemIndicator className="absolute left-2 inline-flex">
        <Check aria-hidden className="size-3.5 text-accent" />
      </RadixSelect.ItemIndicator>
      <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
    </RadixSelect.Item>
  );
}

export function Select<T extends string>(props: SelectProps<T>) {
  const { value, onChange, options, placeholder, size = "md", disabled, name, id, className, onBlur } = props;
  const flat = options.flatMap((item) => (isGroup(item) ? item.options : [item]));
  const selected = flat.find((o) => o.value === value);

  return (
    <RadixSelect.Root
      value={value ?? ""}
      onValueChange={(next) => {
        const option = flat.find((o) => o.value === next);
        if (option) onChange(option.value);
      }}
      name={name}
      disabled={disabled}
    >
      <RadixSelect.Trigger
        id={id}
        onBlur={onBlur}
        aria-label={props["aria-label"]}
        aria-invalid={props["aria-invalid"]}
        aria-describedby={props["aria-describedby"]}
        className={cn(
          "touch-target inline-flex min-w-0 items-center justify-between gap-2 rounded-md border border-control-border bg-surface pr-2 pl-2.5 text-left text-fg",
          "hover:border-fg-subtle disabled:opacity-50 aria-[invalid=true]:border-bad data-[placeholder]:text-fg-subtle",
          "data-[state=open]:border-accent",
          TRIGGER_SIZE[size],
          className,
        )}
      >
        <span className="truncate">
          <RadixSelect.Value placeholder={placeholder}>{selected?.label}</RadixSelect.Value>
        </span>
        <RadixSelect.Icon className="shrink-0 text-fg-subtle">
          <ChevronDown aria-hidden className="size-4" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={4}
          collisionPadding={8}
          className="z-50 max-h-[min(20rem,var(--radix-select-content-available-height))] min-w-(--radix-select-trigger-width) overflow-hidden rounded-md border border-border bg-surface shadow-pop"
        >
          <RadixSelect.Viewport className="p-1">
            {options.map((item) =>
              isGroup(item) ? (
                <RadixSelect.Group
                  key={item.label}
                  className="not-first:mt-1 not-first:border-t not-first:border-border not-first:pt-1"
                >
                  <RadixSelect.Label className="px-2 py-1 text-[0.6875rem] font-medium text-fg-subtle">
                    {item.label}
                  </RadixSelect.Label>
                  {item.options.map((o) => (
                    <Option key={o.value} option={o} />
                  ))}
                </RadixSelect.Group>
              ) : (
                <Option key={item.value} option={item} />
              ),
            )}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
