import { describe, expect, it } from "vitest";
import { alertRulePayloadSchema } from "@/contracts/alerts";
import { alertFormSchema, DEFAULT_ALERT_VALUES, toPayload } from "../form-schema";

const valid = { ...DEFAULT_ALERT_VALUES, name: "EU watch" };
const issuePaths = (input: unknown) =>
  alertFormSchema.safeParse(input).error?.issues.map((i) => i.path.join(".")) ?? [];

describe("alert form schema", () => {
  it("accepts a valid rule and produces a payload the API schema accepts", () => {
    const parsed = alertFormSchema.parse(valid);
    expect(alertRulePayloadSchema.safeParse(toPayload(parsed)).success).toBe(true);
  });

  it("rejects out-of-range thresholds per metric", () => {
    const input = { ...valid, conditions: [{ metric: "sharePct", operator: "gt", threshold: 150 }] };
    expect(issuePaths(input)).toContain("conditions.0.threshold");
  });

  it("rejects duplicate conditions and an empty channel set", () => {
    const input = {
      ...valid,
      conditions: [valid.conditions[0], valid.conditions[0]],
      channels: { inApp: false, email: false },
    };
    expect(issuePaths(input)).toEqual(expect.arrayContaining(["conditions.1.metric", "channels"]));
  });

  it("requires valid recipients only when email is enabled", () => {
    expect(issuePaths({ ...valid, channels: { inApp: false, email: true } })).toContain("recipients");
    expect(
      issuePaths({ ...valid, channels: { inApp: false, email: true }, recipients: "ops@x.io, nope" }),
    ).toContain("recipients");
    expect(toPayload(alertFormSchema.parse({ ...valid, recipients: "ignored@x.io" })).recipients).toEqual([]);
  });
});
