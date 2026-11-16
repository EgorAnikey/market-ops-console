export function pctChange(value: number, base: number | null | undefined): number | null {
  if (!base) return null;
  return (value / base - 1) * 100;
}

export function ratioPct(value: number, base: number): number | null {
  return base ? (value / base) * 100 : null;
}

export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
