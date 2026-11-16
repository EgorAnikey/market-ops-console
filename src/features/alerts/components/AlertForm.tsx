"use client";

import { useState } from "react";
import { FormProvider, useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, FieldError, inputClass } from "@/components/ui/Field";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useHydrated } from "@/hooks/useHydrated";
import { alertFormSchema, DEFAULT_ALERT_VALUES, toPayload, type AlertFormValues } from "../form-schema";
import { useCreateAlert } from "../hooks/useAlertMutations";
import { AlertPreview } from "./AlertPreview";
import { ChannelFields } from "./ChannelFields";
import { ConditionRow } from "./ConditionRow";
import { SaveStatus } from "./SaveStatus";
import { useScopeOptions } from "../hooks/useScopeOptions";
import { FormSelect } from "./FormSelect";

const MATCH_OPTIONS = [
  { value: "any", label: "Any condition" },
  { value: "all", label: "All conditions" },
] as const;

const SEVERITY_OPTIONS = [
  { value: "warning", label: "Warning" },
  { value: "critical", label: "Critical" },
];

export function AlertForm() {
  const hydrated = useHydrated();
  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: DEFAULT_ALERT_VALUES,
    mode: "onTouched",
  });
  const { register, control, handleSubmit, reset, formState } = form;
  const scopeOptions = useScopeOptions();
  const conditions = useFieldArray({ control, name: "conditions" });
  const create = useCreateAlert();
  const [simulateFailure, setSimulateFailure] = useState(false);

  const onSubmit = handleSubmit((values) => {
    create.mutate(
      { payload: toPayload(values), simulateFailure },
      { onSuccess: () => reset(DEFAULT_ALERT_VALUES) },
    );
  });

  return (
    <FormProvider {...form}>
      <form
        inert={!hydrated}
        onSubmit={onSubmit}
        noValidate
        aria-labelledby="alert-form-title"
        className="flex flex-col gap-3"
      >
        <h3 id="alert-form-title" className="text-sm font-semibold">
          New threshold alert
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Rule name" error={formState.errors.name?.message}>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. EU attainment watch"
              aria-required
              {...register("name")}
            />
          </Field>
          <Field label="Applies to" error={formState.errors.scope?.message}>
            <FormSelect name="scope" options={scopeOptions} />
          </Field>
        </div>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 flex w-full items-center justify-between gap-2 text-xs font-medium text-fg-muted">
            Flag a market when
            <Controller
              control={control}
              name="match"
              render={({ field }) => (
                <SegmentedControl
                  label="Match"
                  size="sm"
                  options={MATCH_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </legend>
          <ul className="flex flex-col gap-1.5">
            {conditions.fields.map((f, i) => (
              <ConditionRow
                key={f.id}
                index={i}
                onRemove={() => conditions.remove(i)}
                canRemove={conditions.fields.length > 1}
              />
            ))}
          </ul>
          <FieldError
            message={formState.errors.conditions?.message ?? formState.errors.conditions?.root?.message}
          />
          <Button
            size="sm"
            variant="ghost"
            className="self-start"
            disabled={conditions.fields.length >= 4}
            onClick={() => conditions.append({ metric: "sharePct", operator: "lt", threshold: 10 })}
          >
            <Plus aria-hidden className="size-3.5" /> Add condition
          </Button>
        </fieldset>
        <AlertPreview />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Severity">
            <FormSelect name="severity" options={SEVERITY_OPTIONS} />
          </Field>
          <ChannelFields />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
          <label className="touch-target inline-flex items-center gap-1.5 text-xs text-fg-subtle">
            <input
              type="checkbox"
              checked={simulateFailure}
              onChange={(e) => setSimulateFailure(e.target.checked)}
              className="size-4 accent-[var(--bad)]"
            />
            Demo: simulate a server failure
          </label>
          <Button type="submit" variant="primary" disabled={create.isPending}>
            {create.isPending ? "Saving…" : "Save alert"}
          </Button>
        </div>
        <SaveStatus mutation={create} />
      </form>
    </FormProvider>
  );
}
