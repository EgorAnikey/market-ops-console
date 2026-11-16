import { describe, expect, it } from "vitest";
import { liveTickSchema } from "@/contracts/live";
import { deriveStatus } from "@/domain/status";
import { createSseParser } from "@/lib/sse/parser";
import { testDataset } from "@/test/dataset";
import { liveFactor, liveTick } from "../simulate";
import { createLiveStream } from "../stream";

const at = new Date("2026-06-01T12:00:00Z");

describe("liveTick", () => {
  it("is a pure function of the tick, so every viewer and every reconnect sees the same numbers", () => {
    expect(liveTick(testDataset, 42, at)).toEqual(liveTick(testDataset, 42, at));
    expect(liveTick(testDataset, 43, at).rows).not.toEqual(liveTick(testDataset, 42, at).rows);
  });

  it("moves only the latest month, within 10% of the published figures", () => {
    for (let t = 0; t < 100; t++) {
      const f = liveFactor("de", "veltrix", t);
      expect(f).toBeGreaterThan(0.9);
      expect(f).toBeLessThan(1.1);
    }
    const tick = liveTick(testDataset, 7, at);
    expect(liveTickSchema.parse(tick)).toEqual(tick);
    expect(tick.period).toBe(testDataset.meta.latestPeriod);
    expect(tick.rows).toHaveLength(testDataset.markets.length * testDataset.products.length);
  });

  it("keeps market KPIs consistent with the streamed rows and the status rule", () => {
    const tick = liveTick(testDataset, 11, at);
    for (const { id, kpis } of tick.markets) {
      const rows = tick.rows.filter((r) => r.marketId === id).reduce((acc, r) => acc + r.actual, 0);
      expect(kpis.revenue / rows).toBeCloseTo(1, 3);
      expect(kpis.status).toBe(deriveStatus(kpis.growthPct, kpis.forecastAttainmentPct));
    }
  });
});

describe("createLiveStream", () => {
  it("sends a tick straight away and closes when the client disconnects", async () => {
    const controller = new AbortController();
    const reader = createLiveStream(testDataset, 60_000, controller.signal).getReader();
    const { value } = await reader.read();
    const [data] = createSseParser().push(new TextDecoder().decode(value));
    expect(liveTickSchema.parse(JSON.parse(data ?? "")).period).toBe(testDataset.meta.latestPeriod);

    controller.abort();
    expect((await reader.read()).done).toBe(true);
  });
});
