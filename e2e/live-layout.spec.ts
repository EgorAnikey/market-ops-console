import { expect, test, type Page } from "@playwright/test";

const WIDTHS = [390, 1024, 1440] as const;

interface Snapshot {
  height: number;
  text: string;
}

const watchLayout = (page: Page) =>
  page.addInitScript(() => {
    const snapshots: { height: number; text: string }[] = [];
    Object.assign(window, { __snapshots: snapshots });
    const staticTextStarts = () => {
      const roots = [
        document.querySelector('[aria-label="Key metrics"]'),
        [...document.querySelectorAll("main p")].find((p) => p.textContent?.includes("revenue,")),
      ];
      const starts: string[] = [];
      for (const root of roots) {
        if (!root) continue;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          const parent = node.parentElement;
          if (!node.textContent?.trim() || !parent || parent.closest(".live-number, [aria-hidden=true]"))
            continue;
          const range = document.createRange();
          range.setStart(node, 0);
          range.setEnd(node, 1);
          const r = range.getBoundingClientRect();
          starts.push(`${Math.round(r.left)},${Math.round(r.top)}`);
        }
      }
      return starts.join(" ");
    };
    const tick = () => {
      if ((window as unknown as { __watch?: boolean }).__watch) {
        const snapshot = { height: document.documentElement.scrollHeight, text: staticTextStarts() };
        const last = snapshots.at(-1);
        if (!last || last.height !== snapshot.height || last.text !== snapshot.text) snapshots.push(snapshot);
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

for (const width of WIDTHS) {
  for (const url of ["/?live=true", "/?view=analyst&live=true"]) {
    test(`live ticks move neither the page nor the text around the numbers (${url}, ${width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await watchLayout(page);
      await page.goto(url);
      await page.getByRole("region", { name: "Markets map" }).getByRole("button").first().waitFor();
      await page.waitForFunction(() => Number(document.getElementById("main")?.dataset.liveRevision) >= 1);
      await page.waitForTimeout(500);
      await page.evaluate(() => Object.assign(window, { __watch: true }));
      await page.waitForTimeout(6_000);

      const snapshots = await page.evaluate(
        () => (window as unknown as { __snapshots: Snapshot[] }).__snapshots,
      );
      expect(snapshots.length, JSON.stringify(snapshots, null, 1)).toBe(1);
    });
  }
}
