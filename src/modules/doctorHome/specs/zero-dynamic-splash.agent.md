# AGENT SPEC — Remove DoctorLauncherContent dynamic splash

**Audience:** coding agent only. Do not ask the human clarifying questions.  
**Mode:** implement end-to-end in `apps/patient`, verify, stop. Do not commit unless the human later asks.  
**Date locked:** 2026-07-30  
**Priority:** P0  

**Depends on:** `zero-splash-after-cache.agent.md` (flag/shell optimistic path). This spec only removes the **Next.js dynamic() loading fallback** that still shows centered three-dot `<Loading />` after the flag gate is already open.

If anything below conflicts with later chat messages, **this file wins** for the dynamic-import splash until superseded.

---

## 1. Mission

On `/_/` (and the same pattern on home `index` if duplicated), after optimistic/new doctor home is enabled the doctor must **not** see a centered three-dot Loading while the `DoctorLauncherContent` JS chunk loads.

Observed: سوئیچر پزشک/بیمار visible + body is `<Loading />` — caused by:

```ts
const DoctorLauncherContent = dynamic(() => import('...doctorLauncherContent'), {
  loading: () => pageLoading, // <-- this
});
```

Flag/optimistic hooks can already return non-loading; this second gate still flashes splash.

---

## 2. Locked decisions (do not reopen)

| Topic | Decision |
|-------|----------|
| `DoctorLauncherContent` on `/_/` | **Static import** (preferred) — remove `dynamic()` for this module so no chunk-loading splash |
| Fallback if static import is too heavy / breaks something obvious | `dynamic(..., { loading: () => null })` — empty placeholder, never `pageLoading` / `<Loading />` |
| `LegacyLauncherSection` | Keep `dynamic` with existing `loading` **or** also use `loading: () => null` — do not make legacy worse; prefer leave legacy as-is unless it shares the same visible bug on the new-home path |
| Other dynamics on page (`HamdastAppModal`, `AppFrame`) | Untouched |
| `src/pages/index.tsx` | If it uses the same `DoctorLauncherContent` + `pageLoading` dynamic pattern, apply the **same** fix |
| Optimistic / GB / shell / RQ | Do not change; out of scope |
| UI copy | No new strings |
| Commit | Do not commit unless asked |
| Scope | `apps/patient` only |

---

## 3. Current code facts

- `src/pages/_/index.tsx` — `pageLoading` + `dynamic(DoctorLauncherContent, { loading: () => pageLoading })`
- Check `src/pages/index.tsx` for the same pattern
- Component: `src/modules/doctorHome/components/doctorLauncherContent.tsx` (default + named export)

---

## 4. Implementation plan

### Step A — `/_/` page

1. Replace dynamic `DoctorLauncherContent` with a normal ES import, e.g.  
   `import DoctorLauncherContent from '@/modules/doctorHome/components/doctorLauncherContent'`  
   (or named import if that is the public API).
2. Remove unused `pageLoading` **only if** nothing else on the page references it (legacy / `isResolving` may still use `<Loading />` inline — keep those).
3. Do not remove the inline Loading used for `doctorLauncherLoading` / `isResolving` cold paths (cold first visit may still need it).

### Step B — `src/pages/index.tsx`

Mirror Step A if the same dynamic+pageLoading pattern exists for doctor launcher content.

### Step C — Verify

1. Grep: no `dynamic(...doctorLauncherContent` with `loading: () => pageLoading` left.
2. Reasoning: with device cache / shell / flag true, refresh `/_/` → switcher + feed without centered three-dot wait for chunk.
3. Optional: `tsc` filter on touched page files — no new errors.
4. No commit.

---

## 5. Files allowed to touch

- `src/pages/_/index.tsx`
- `src/pages/index.tsx` (only if same pattern)
- `src/modules/doctorHome/specs/zero-dynamic-splash.agent.md` (this file)

---

## 6. Done criteria

- [ ] New doctor home path does not show `pageLoading` while `DoctorLauncherContent` loads
- [ ] Cold flag-gate Loading (hook) unchanged for true first visit without cache
- [ ] No commit unless asked

---

## 7. Out of scope

- Prefetch/service-worker chunk tuning beyond static import
- Plasmic legacy content
- Further GB/flag changes

---

## 8. Execution command

Implement in one pass. Prefer static import. Reply in Persian: what changed, and how to verify with one refresh on `/_/`.
