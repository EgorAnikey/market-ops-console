@AGENTS.md

# Project conventions (read before changing code)

Market Operations console: Next.js 16 App Router, React 19, TypeScript strict. See README.md for architecture.

## Layering (imports only flow downwards)

```
app/            routes + route handlers (thin: validate → call server/ → respond)
features/<x>/   feature UI: components/, hooks/, panels/ (containers), lib/ (pure helpers)
components/     design-system primitives (ui/) and chart primitives (charts/); no domain imports in ui/
domain/         pure functions over the dataset (no React, no fetch); every module with real logic has a test
contracts/      zod schemas = the only source of shared types (client ⇄ server)
server/         server-only code (`import "server-only"`)
lib/            framework-free utilities (format, sse, viz, http, observability)
```

## Rules

- Tests live in a `__tests__/` folder next to the code they cover (`domain/__tests__/kpis.test.ts`); shared test helpers in `src/test/`; browser E2E in `e2e/`, one important user scenario per test, named after the outcome it guarantees. Only tests that earn their place: a scenario from the brief or a real bug that is easy to bring back, at the lowest level that can see it. Don't repeat in a unit test what an E2E test proves, and don't test trivial code or implementation details.
- Stories live in `__stories__/` next to the component and cover building blocks only, never panels or other containers. Each component has a `Default` story; every other story changes exactly one prop and is named after it. Use the real dataset through domain functions (no hand-made data) and `useArgs` for interactive props. Every story is rendered by `src/__tests__/stories.test.tsx`.
- Dropdowns use `components/ui/Select` (Radix Select, styled with tokens), never a native `<select>`; in forms, `FormSelect` connects it to react-hook-form.
- No `any`, no non-null assertions on external data. Validate at boundaries with the schemas in `contracts/`.
- Files stay under ~150 lines. If a component grows, extract a hook (`use*`) or a sub-component.
- Presentational charts take props only; containers (`panels/`) wire hooks to them.
- One source per fact: KPIs only via `domain/kpis.ts`, URL state only via `useDashboardState`, table columns only via `useKpiColumns`.
- Colours only via tokens in `src/styles/tokens.css` (Tailwind semantic classes or `var(--token)`). Never hex in components (chart series palette in `lib/viz/color.ts` is the single exception).
- Model output is rendered as text nodes only. Never `dangerouslySetInnerHTML`.
- Every chart ships inside `ChartFrame` with a table alternative, keyboard access and an accessible name.
- Components that only trigger the assistant use `useAssistantActions()` (stable); only the panel reads `useAssistantState()`, which changes every streamed frame.
- Keyboard activation for role="button"/"checkbox" elements goes through `onActivate()` in `lib/a11y.ts`.
- Form controls use the `control-border` token (≥3:1); never rely on a fill change alone to show state.
- Any scroll container gets `relative` so `sr-only` content inside can't escape it and break reflow.
- If an action can remove the focused element, move focus deliberately (`useFocusRescue` or an explicit `focus()`).
- Charts with text size themselves with `useElementWidth` and draw in real pixels; never scale text via a fixed viewBox.
- Nothing may change the page height after first render: chart SVGs take their height from `CHART_SVG_CLASS` + `chartHeightVars` (container query, correct in server HTML), data the first render needs is seeded into the query cache in `app/page.tsx`, chart ↔ table toggles keep the chart's footprint (`ChartFrame`), and live ticks change values, never structure: data-length lists keep fixed slots (on a phone, overflow goes into a `Dialog`, never a nested scroll area), data-length text truncates to one line, and every number that changes live sits in a `FixedWidth` slot sized by `useValueSamples` (empty while live is off), so the text around it never moves. Guarded by `e2e/layout.spec.ts` and `e2e/live-layout.spec.ts`.
- Every permission check goes through `domain/permissions.ts`: the UI asks `useSession().can(…)`, and the API route calls `requirePermission(…)`. Every data route also calls `requireSession()`; only `/api/health` and `/api/rum` stay open. Never rely on the UI alone.
- Animations that should follow live ticks read `useMotionRevision()`; never infer a tick from the DOM.
- Small standalone controls get `touch-target` (40px hit area on touch screens only).
- AI-generated content uses the `ai` tokens; authoritative data uses `fact` tokens. Never mix them.
- Components read data only via `useDatasetIndex`, which already includes live updates. Live data lives in React state (`LiveProvider`), never written into the query cache: an external store changing during hydration discards server HTML. Never keep what the user is looking at in the data. Only live ticks animate, never navigation: charts ease numbers with `useTweenedNumbers(values, revision)` (`revision` from `useLive()`), reordered rows use `useFlip` + `data-flip-key`. No CSS transitions on data-driven attributes: CSS can't tell a tick from a drill.

## Definition of done

`npm run check` (lint + typecheck + unit/component tests) and `npm run test:e2e` pass; new domain logic has tests; new UI states (loading/empty/error) are handled.
