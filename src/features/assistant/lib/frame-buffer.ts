export interface FrameBuffer {
  push(text: string): void;
  flush(): void;
  cancel(): void;
}

export function createFrameBuffer(onFlush: (text: string) => void): FrameBuffer {
  let pending = "";
  let frame: number | null = null;

  const flush = () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    if (!pending) return;
    const text = pending;
    pending = "";
    onFlush(text);
  };

  return {
    push(text) {
      pending += text;
      frame ??= requestAnimationFrame(flush);
    },
    flush,
    cancel() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      pending = "";
    },
  };
}
