"use client";

import { useId } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Field, FieldError, inputClass } from "@/components/ui/Field";
import type { AlertFormValues } from "../form-schema";

export function ChannelFields() {
  const { register, formState } = useFormContext<AlertFormValues>();
  const errorId = useId();
  const channelError = formState.errors.channels?.message ?? formState.errors.channels?.root?.message;
  const emailOn = useWatch<AlertFormValues, "channels.email">({ name: "channels.email" });

  return (
    <fieldset className="flex flex-col gap-2" aria-describedby={channelError ? errorId : undefined}>
      <legend className="mb-1 text-xs font-medium text-fg-muted">Notify via</legend>
      <div className="flex gap-4 text-[0.8125rem]">
        <label className="touch-target inline-flex items-center gap-1.5">
          <input type="checkbox" className="size-4 accent-[var(--accent)]" {...register("channels.inApp")} />{" "}
          In-app
        </label>
        <label className="touch-target inline-flex items-center gap-1.5">
          <input type="checkbox" className="size-4 accent-[var(--accent)]" {...register("channels.email")} />{" "}
          Email
        </label>
      </div>
      <FieldError id={errorId} message={channelError} />
      {emailOn ? (
        <Field
          label="Recipients"
          hint="Comma-separated, up to 10"
          error={formState.errors.recipients?.message}
        >
          <input
            type="text"
            autoComplete="off"
            placeholder="ops@example.com, lead@example.com"
            className={inputClass}
            {...register("recipients")}
          />
        </Field>
      ) : null}
    </fieldset>
  );
}
