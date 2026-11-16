import "server-only";
import raw from "@data/fixtures.json";
import { fixturesFileSchema, type ChatContext, type Fixture } from "@/contracts/chat";
import { dataset } from "@/server/dataset";

const fixtures = fixturesFileSchema.parse(raw);

const match = (text: string): Fixture | undefined => {
  const q = text.toLowerCase();
  return fixtures.fixtures.find((f) => (f.keywords ?? []).some((k) => q.includes(k)));
};

function contextTerms(context: ChatContext | undefined): string {
  if (!context) return "";
  const market = dataset.markets.find((m) => m.id === context.marketId)?.name;
  const region = dataset.regions.find((r) => r.id === context.regionId)?.name;
  return [market, region].filter(Boolean).join(" ");
}

export function pickFixture(question: string, context?: ChatContext): Fixture {
  return match(question) ?? match(contextTerms(context)) ?? fixtures.default;
}
