export interface SseParser {
  push(chunk: string): string[];
  flush(): string[];
}

export function createSseParser(): SseParser {
  let buffer = "";

  const parseEvent = (block: string): string | null => {
    const data = block
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).replace(/^ /, ""));
    return data.length ? data.join("\n") : null;
  };

  const drain = (final: boolean): string[] => {
    const blocks = buffer.split("\n\n");
    buffer = final ? "" : (blocks.pop() ?? "");
    return blocks.map(parseEvent).filter((d): d is string => d !== null);
  };

  return {
    push(chunk) {
      buffer += chunk.replace(/\r\n?/g, "\n");
      return drain(false);
    },
    flush() {
      return drain(true);
    },
  };
}
