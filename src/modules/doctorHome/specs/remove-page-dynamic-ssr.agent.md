# AGENT SPEC — Remove `/_/` page-level `dynamic(ssr:false)` (faster first paint)

**Audience:** coding agent only. Do not ask the human clarifying questions.  
**Mode:** implement end-to-end in `apps/patient`, verify with production build, stop. Do not commit unless the human later asks.  
**Date locked:** 2026-07-31  
**Priority:** P0  

**Supersedes (partial):** any comment/decision that `/_/` **must** wrap the entire `LauncherHomePage` in `next/dynamic(..., { ssr: false })` to keep `getStaticProps` / SSG. That was a build workaround that **hurts runtime first paint** (extra JS chunk waterfall + empty body until chunk loads). Keep nested dynamics for Legacy / Hamdast as already decided in older specs.  

**Depends on (do not regress):**  
`boot-shell-persist.agent.md`, `launcher-flag-userid-safe.agent.md`, `zero-splash-after-cache.agent.md`, `zero-dynamic-splash.agent.md`, `launcher-identity-first-paint.agent.md`  
Plus current boot UX: inline `data-doctor-device`, CSS hide of `[data-doctor-boot-loading]` / patient nav, and `DoctorHomeSsgShell` + `data-doctor-client-ready` (keep unless proven unnecessary after static import).

If later chat messages conflict with this file on **page-level dynamic vs static import of LauncherHomePage**, **this file wins** until explicitly superseded.

---

## 1. Mission

On refresh of `/_/` for a doctor device (cache / shell present), the **real** launcher UI (switcher + feed path) must appear **without waiting for a second async chunk** that only exists because the page does:

```ts
const LauncherHomePage = dynamic(() => import('.../launcherHomePage'), {
  ssr: false,
  loading: () => null,
});
```

**Product outcome:** fewer blank/skeleton-only frames; launcher JS ships with (or is eagerly linked from) the page bundle so after main JS parses, React can paint real UI immediately (SSG shell may still bridge the pre-hydration gap).

**Non-goal:** abandoning static `getStaticProps` for `/_/` unless `next build` proves it is impossible without page-level `ssr: false`. Prefer fixing import cycles / isolating GrowthBook over reintroducing page-level dynamic.

---

## 2. Why the dynamic exists today (root cause — do not “fix” by restoring it)

| Fact | Detail |
|------|--------|
| Intent when added | Make `/_/` ● SSG (`getStaticProps` → `{ props: {} }`) without `Collecting page data` hanging / timing out when the page graph pulled GrowthBook/`_app` / heavy launcher + Plasmic |
| Runtime cost | HTML has no real launcher body → client loads page JS → **then** fetches `launcherHomePage` chunk → blank or SSG shell until then |
| Mitigation already in tree | `DoctorHomeSsgShell` in SSR HTML + CSS on `html[data-doctor-device="1"]:not([data-doctor-client-ready])` — covers emptiness, does **not** remove the chunk wait |
| Heavy edge already isolated | `LegacyLauncherSection`, `HamdastAppModal`, `AppFrame` remain `dynamic(..., { ssr: false })` inside `launcherHomePage.tsx` — keep those |
| Known cycle risk | `useNewDoctorLauncher.ts` imports `growthbook` from `src/pages/_app` — page → launcher → `_app` during SSG worker evaluation is the main hang suspect |

---

## 3. Locked decisions (do not reopen)

| Topic | Decision |
|-------|----------|
| Page-level `LauncherHomePage` | **Static ES import** in `src/pages/_/index.tsx`. Remove `next/dynamic` for this module. Default SSR of the component is allowed (do **not** set `ssr: false` on the page body). |
| `getStaticProps` on `/_/` | **Keep** `{ props: {} }` (or equivalent empty static props). Goal remains CDN-friendly TTFB for the document shell. |
| If `next build` hangs / fails collecting `/_` | **Do not** restore page-level `dynamic(ssr:false)`. Instead fix the graph, in preferred order: (1) extract GrowthBook singleton out of `_app` into a leaf module (e.g. `src/common/growthbook/client.ts`) and import that from `_app` + hooks; (2) ensure Legacy/Plasmic stay behind existing nested `dynamic`; (3) add SSR-safe guards only where a module throws at import/render time during SSG. |
| Nested dynamics in `launcherHomePage.tsx` | Keep `LegacyLauncherSection`, `HamdastAppModal`, `AppFrame` as dynamic/`ssr: false` (or `loading: () => null` for legacy if it flashes on new-home path — prefer leave legacy alone if new-home path never mounts it when optimistic). |
| `DoctorLauncherContent` | Keep **static** import (per `zero-dynamic-splash.agent.md`). Do not re-dynamic it. |
| `DoctorHomeSsgShell` + `data-doctor-client-ready` | **Keep by default.** SSR still cannot read `doctor-home-device` / shell during React SSR the same way the inline script does; first React render of optimistic hooks is still `deviceCached === false` until `useLayoutEffect`. Shell bridges HTML→hydration. Remove shell **only if** after static import you prove doctor refresh paints switcher/feed in the static HTML itself (unlikely without cookie SSR). |
| Optimistic / GB / shell / RQ / bottom nav / CSS boot hides | Do not regress; out of scope except import-cycle extraction required for build. |
| `src/pages/index.tsx` (patient home) | Out of scope unless it also page-level-dynamics the whole doctor launcher the same way (it does not today — skip). |
| UI copy | No new user-facing strings required. Shell labels already exist. |
| Commit | Do not commit unless asked. |
| Scope | `apps/patient` only. |

---

## 4. Current code facts (as of lock date)

- `src/pages/_/index.tsx` — `dynamic(() => import('@/modules/doctorHome/components/launcherHomePage'), { ssr: false, loading: () => null })` + `DoctorHomeSsgShell` + `getStaticProps`.
- `src/modules/doctorHome/components/launcherHomePage.tsx` — sets `data-doctor-client-ready` in `useLayoutEffect`; static `DoctorLauncherContent`; nested dynamics for legacy/hamdast.
- `src/modules/doctorHome/hooks/useNewDoctorLauncher.ts` — `import { growthbook } from 'src/pages/_app'`.
- `src/common/hooks/useDoctorDeviceCached.ts` — first render always `false` (SSR-safe).
- `src/styles/globals.css` — `[data-doctor-ssg-shell]` visible only for `html[data-doctor-device="1"]:not([data-doctor-client-ready])`.
- Build route listing shows `● /_` (SSG) when page-level dynamic is present; after this change it should **still** be `● /_` (or equivalent static), not λ, unless you are forced to drop `getStaticProps` (last resort — document why in the reply).

---

## 5. Implementation plan

### Step A — Static page import

1. In `src/pages/_/index.tsx`, replace page-level `dynamic(...)` with:
   `import LauncherHomePage from '@/modules/doctorHome/components/launcherHomePage'`  
   (or named import if that is the public API — keep default export working).
2. Render `<DoctorHomeSsgShell />` + `<LauncherHomePage />` as today.
3. Remove unused `next/dynamic` import from the page file if nothing else needs it.
4. Update the file comment: static import is intentional for paint; SSG hang is handled by graph isolation, not `ssr: false`.

### Step B — Unblock SSG if build breaks

1. Run `npm run build` in `apps/patient` (or at least enough to pass “Collecting page data” / static generation for `/_`).
2. If hang/timeout/OOM on `/_`:
   - Extract `growthbook` singleton (+ any pure config) from `src/pages/_app.tsx` into a dedicated module with **no** React page tree imports.
   - Point `_app` and `useNewDoctorLauncher` (and any other `from 'src/pages/_app'` growthbook imports) at that module.
   - Re-run build.
3. If still failing, find what else `launcherHomePage` pulls at **module top-level** that touches `window` / Plasmic registration; move that behind nested dynamic or lazy init. Do **not** wrap the whole page again.

### Step C — Paint / shell sanity

1. Confirm `DoctorHomeSsgShell` still in static HTML for `/_` (grep `data-doctor-ssg-shell` in `.next/server/pages/**/_.html` or equivalent).
2. Confirm `LauncherHomePage` is **not** only behind a separate `loadableGenerated` / async page chunk in the page entry (or that Network waterfall no longer waits on a dedicated `launcherHomePage` async import before first client render of switcher). Exact webpack naming may vary — success criterion is behavioral (Step D).
3. Keep `data-doctor-client-ready` hide of SSG shell when launcher mounts.

### Step D — Verify

1. `npm run build` succeeds; route table still shows static `/_` (●) if `getStaticProps` kept.
2. `npm run start`, open `/_/` with `doctor-home-device=1` (+ valid shell/RQ if available): hard refresh → no long empty body waiting only for a secondary launcher chunk; switcher/feed (or shell→real UI) without reintroducing centered three-dot boot splash for cached doctors.
3. Grep: no `dynamic(() => import(...launcherHomePage` in `src/pages/_/index.tsx`.
4. Optional: filtered `tsc` / lint on touched files.
5. No commit.

---

## 6. Files allowed to touch

- `src/pages/_/index.tsx` (**required**)
- `src/pages/_app.tsx` (only if extracting growthbook)
- New leaf module for growthbook singleton (only if Step B needs it)
- `src/modules/doctorHome/hooks/useNewDoctorLauncher.ts` (import path only, if extracting)
- Any other files that import `growthbook` from `_app` (repoint imports) — minimize
- `src/modules/doctorHome/components/launcherHomePage.tsx` (only if needed for SSR-safe import/render; prefer not)
- `src/modules/doctorHome/components/doctorHomeSsgShell.tsx` / `globals.css` (only if adjusting shell; default keep)
- `src/modules/doctorHome/specs/remove-page-dynamic-ssr.agent.md` (this file)

Do **not** touch unrelated patient home Plasmic, auth CDN, or GrowthBook dashboard rules.

---

## 7. Done criteria

- [ ] `src/pages/_/index.tsx` uses **static** import of `LauncherHomePage` (no page-level `dynamic` / `ssr: false` for it)
- [ ] `getStaticProps` retained **or** explicit documented last-resort exception in the agent’s Persian reply
- [ ] `npm run build` completes without restoring page-level dynamic
- [ ] Cached doctor hard refresh on `/_/` no longer depends on a dedicated async `launcherHomePage` chunk waterfall for first real UI attempt
- [ ] No regression to sticky-false / optimistic new home / boot CSS / SSG shell bridging
- [ ] No commit unless asked

---

## 8. Out of scope

- Removing nested Hamdast/Legacy dynamics
- Rewriting GrowthBook targeting / flag semantics
- Making doctor identity available during true SSR via cookies (nice later; not required here)
- Prefetch/service-worker tuning beyond static import
- Committing / opening MR

---

## 9. Execution command

Implement this entire spec in one pass. Prefer static page import + growthbook leaf extraction if build requires it. When finished, reply in Persian: what changed, whether `getStaticProps`/● SSG still holds, what (if anything) was extracted for the build, and how to verify with one hard refresh on `/_/`.
