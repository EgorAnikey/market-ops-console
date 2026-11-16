import type { ResolvedCitation } from "@/domain/citations";

export type TextSegment = { type: "text"; text: string } | { type: "ref"; text: string; refs: number[] };

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function annotate(text: string, citations: readonly ResolvedCitation[]): TextSegment[] {
  const refsByName = new Map<string, number[]>();
  for (const c of citations) {
    for (const name of c.mentions) {
      const key = name.toLowerCase();
      refsByName.set(key, [...(refsByName.get(key) ?? []), c.n]);
    }
  }
  if (refsByName.size === 0) return text ? [{ type: "text", text }] : [];

  const names = [...refsByName.keys()].sort((a, b) => b.length - a.length).map(escapeRegExp);
  const pattern = new RegExp(`\\b(${names.join("|")})\\b`, "gi");
  const segments: TextSegment[] = [];
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const start = match.index;
    if (start > last) segments.push({ type: "text", text: text.slice(last, start) });
    segments.push({ type: "ref", text: match[0], refs: refsByName.get(match[0].toLowerCase()) ?? [] });
    last = start + match[0].length;
  }
  if (last < text.length) segments.push({ type: "text", text: text.slice(last) });
  return segments;
}
