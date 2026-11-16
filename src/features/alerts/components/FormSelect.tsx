"use client";

import { useController } from "react-hook-form";
import { Select, type SelectItem } from "@/components/ui/Select";
import type { AlertFormValues } from "../form-schema";

type SelectPath = "scope" | "severity" | `conditions.${number}.metric` | `conditions.${number}.operator`;

interface FormSelectProps {
  name: SelectPath;
  options: readonly SelectItem[];
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

export function FormSelect({ name, ...props }: FormSelectProps) {
  const { field } = useController<AlertFormValues, SelectPath>({ name });
  return (
    <Select
      {...props}
      name={field.name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
    />
  );
}
