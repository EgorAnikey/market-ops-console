import { CircleCheck, TriangleAlert } from "lucide-react";

interface MutationLike {
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
}

export function SaveStatus({ mutation }: { mutation: MutationLike }) {
  if (mutation.isError) {
    return (
      <p
        role="alert"
        className="flex items-start gap-1.5 rounded-md border border-bad/30 bg-bad-soft px-2.5 py-2 text-xs text-bad"
      >
        <TriangleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0" />
        <span>
          <strong>Not saved.</strong> {mutation.error?.message} The list has been rolled back; your form input
          is kept so you can retry.
        </span>
      </p>
    );
  }
  if (mutation.isSuccess) {
    return (
      <p role="status" className="flex items-center gap-1.5 text-xs text-ok">
        <CircleCheck aria-hidden className="size-3.5" /> Alert saved.
      </p>
    );
  }
  return null;
}
