export interface ScatterLabel {
  id: string;
  text: string;
  x: number;
  y: number;
  dimmed: boolean;
}

export function ScatterLabels({ labels }: { labels: readonly ScatterLabel[] }) {
  return (
    <g aria-hidden className="pointer-events-none text-[10px]">
      {labels.map((l) => (
        <text
          key={l.id}
          x={l.x}
          y={l.y}
          dy="0.32em"
          fill="var(--fg-muted)"
          stroke="var(--surface)"
          strokeWidth={3}
          strokeLinejoin="round"
          paintOrder="stroke"
          opacity={l.dimmed ? 0.55 : 1}
        >
          {l.text}
        </text>
      ))}
    </g>
  );
}
