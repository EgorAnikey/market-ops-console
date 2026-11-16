import { Lock } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export function ReadOnlyNotice({ role }: { role: string }) {
  return (
    <EmptyState icon={Lock} title="Alert rules are read-only for you">
      You&apos;re signed in as a {role.toLowerCase()}. Creating or deleting rules needs the analyst role; sign
      in as an analyst to manage them.
    </EmptyState>
  );
}
