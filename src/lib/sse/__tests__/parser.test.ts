import { describe, expect, it } from "vitest";
import { createSseParser } from "../parser";

describe("createSseParser", () => {
  it("emits complete events and buffers partial ones across chunks", () => {
    const parser = createSseParser();
    expect(parser.push('data: {"a":1}\n\ndata: {"b"')).toEqual(['{"a":1}']);
    expect(parser.push(":2}\n")).toEqual([]);
    expect(parser.push("\n")).toEqual(['{"b":2}']);
  });

  it("normalises CRLF, skips comments and joins multi-line data", () => {
    const parser = createSseParser();
    expect(parser.push(": keep-alive\r\n\r\ndata: one\r\ndata: two\r\n\r\n")).toEqual(["one\ntwo"]);
  });

  it("flushes a trailing event without a terminating blank line", () => {
    const parser = createSseParser();
    expect(parser.push("data: tail")).toEqual([]);
    expect(parser.flush()).toEqual(["tail"]);
  });
});
