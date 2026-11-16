"use client";

import { Trash2 } from "lucide-react";
import { useId } from "react";
import { useFormContext } from "react-hook-form";
import { ALERT_METRICS, METRIC_BOUNDS } from "@/contracts/alerts";
import { METRICS } from "@/domain/metrics";
import { Button } from "@/components/ui/Button";
import { FieldError, inputClass } from "@/components/ui/Field";
import { FormSelect } from "./FormSelect";
import type { AlertFormValues } from "../form-schema";

interface ConditionRowProps {
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}

const METRIC_OPTIONS = ALERT_METRICS.map((m) => ({ value: m, label: METRICS[m].label }));
const OPERATOR_OPTIONS = [
  { value: "lt", label: "is below" },
  { value: "gt", label: "is above" },
];

export function ConditionRow({ index, onRemove, canRemove }: ConditionRowProps) {
  const { register, watch, formState } = useFormContext<AlertFormValues>();
  const errors = formState.errors.conditions?.[index];
  const metric = watch(`conditions.${index}.metric`);
  const bounds = METRIC_BOUNDS[metric];
  const n = index + 1;
  const errorId = useId();
  const describe = (invalid: boolean) => (invalid ? errorId : undefined);

  return (
    <li className="flex flex-col gap-1">
      <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_auto] items-center gap-1.5">
        <FormSelect
          name={`conditions.${index}.metric`}
          aria-label={`Condition ${n} metric`}
          aria-invalid={Boolean(errors?.metric)}
          aria-describedby={describe(Boolean(errors?.metric))}
          options={METRIC_OPTIONS}
        />
        <FormSelect
          name={`conditions.${index}.operator`}
          aria-label={`Condition ${n} operator`}
          options={OPERATOR_OPTIONS}
        />
        <span className="relative">
          <input
            type="number"
            step="0.1"
            inputMode="decimal"
            aria-label={`Condition ${n} threshold, percent, between ${bounds.min} and ${bounds.max}`}
            aria-invalid={Boolean(errors?.threshold)}
            aria-describedby={describe(Boolean(errors?.threshold))}
            className={`${inputClass} num pr-6`}
            {...register(`conditions.${index}.threshold`, { valueAsNumber: true })}
          />
          <span aria-hidden className="pointer-events-none absolute top-1.5 right-2 text-xs text-fg-subtle">
            %
          </span>
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={!canRemove}
          aria-label={`Remove condition ${n}`}
        >
          <Trash2 aria-hidden className="size-4" />
        </Button>
      </div>
      <FieldError id={errorId} message={errors?.metric?.message ?? errors?.threshold?.message} />
    </li>
  );
}
