# AGENT SPEC — Doctor Home: zero splash after first cache (optimistic feed)

**Audience:** coding agent only. Do not ask the human clarifying questions.  
**Mode:** implement end-to-end in `apps/patient`, verify, stop. Do not commit unless the human later asks.  
**Date locked:** 2026-07-30  
**Priority:** P0  

**Supersedes (UI gating):** loading / splash behavior in `launcher-gate-persist.agent.md` and `launcher-flag-userid-safe.agent.md` wherever they require waiting on GrowthBook/`getMe` before showing new doctor home **when a prior successful session is already cached**.  

**Keeps from prior specs:**  
- Shell persist (`boot-shell-persist.agent.md`)  
- RQ persist + background refetch  
- GrowthBook `user_id`-safe evaluation before **persisting `false`** or switching to legacy (`launcher-flag-userid-safe.agent.md`)  

If anything below conflicts with later chat messages or older specs, **this file wins** for splash/loading UX until explicitly superseded.

---

## 1. Mission

After the doctor has successfully used new doctor home **at least once** on this device (cached), a full refresh of `/_/` must:

1. Show **DoctorViewSwitcher + new doctor feed immediately** (no centered three-dot `<Loading />`).
2. Not block on `getMe`, GrowthBook `ready`/`refreshFeatures`, or flag re-resolve.
3. Still run network/GB in the **background** and update UI if server/flag state changed.
4. Never sticky-lock the user onto legacy Plasmic from a premature `false` flag read (user_id targeting still applies for **downgrade** decisions).

**Product rule (human):**  
> بار اول دیتا گرفته و کش می‌شود؛ از آن به بعد نباید منتظر بمانم — فید و doctor home باید سریع نمایش داده شود.

---

## 2. Locked decisions (do not reopen)

| Topic | Decision |
|-------|----------|
| Full-page splash on `/_/` | **Forbidden** when any of the optimistic-new-home signals below is true |
| Optimistic “show new home now” signals (any one enough) | (A) `readTrustedEnabledLauncherFlag(userId) === true`, OR (B) in-memory latch `enabled === true` for userId, OR (C) `isDoctorDeviceCached()` **and** doctor identity available (shell or Zustand doctor with centers), OR (D) valid `readDoctorHomeShell()` for current restored userId |
| What to render when optimistic | Same path as enabled: `DoctorViewSwitcher` + `DoctorLauncherContent` (new feed). Do **not** show `<Loading />` body |
| Background work | Always: `getMe`, centers sync, RQ refetch (`refetchOnMount: 'always'`), and GrowthBook resolve with **user_id set + refreshFeatures** |
| When may UI switch to legacy? | Only after a **user_id-safe** resolve returns `enabled === false` **and** `pending === false`. Then persist false and show legacy |
| When may UI keep/show loading? | **Only** cold first visit: doctor+login+userId (or becoming doctor) but **no** optimistic signal yet, and safe resolve not finished. Prefer keeping this path as short as possible |
| Persist `true` | After any user_id-safe `isOn === true`, write `p24-doctor-home-launcher-flag-v1` |
| Persist `false` | Only after user_id-safe `isOn === false` and `!pending` |
| Sticky false heal | Keep `readTrustedEnabledLauncherFlag`: clears persisted `false` and returns null (false is not a fast-path) |
| Device cache without flag true | `isDoctorDeviceCached()` alone is enough for **no splash + show new home** while re-resolving; if safe resolve later says false, then legacy |
| Shell without device flag | Valid shell restore for userId ⇒ optimistic new home (shell implies prior doctor session) |
| `canResolve` | May run when `isLogin && userId && (isReady \|\| after loadFeatures)`; must still **set user_id + refreshFeatures** before `isOn`. May start even if `pending` **only to confirm `true`** / refresh persist; concluding UI downgrade to legacy still requires `!pending` |
| Loading hook contract | `useIsNewDoctorLauncherLoading()` returns `false` whenever optimistic signal is true OR safe resolve finished for userId. Returns `true` only for cold path above |
| Enabled hook contract | If optimistic signal → return `true` immediately (show new home). Background resolve may later set false → return false |
| Dynamic import | `DoctorLauncherContent` dynamic `loading:` fallback may still flash briefly on first JS chunk load — acceptable once; do **not** add a second full-page Loading gate on top. Do not block on flag. Optional later: remove dynamic loading spinner or preload chunk — out of scope unless trivial |
| Scope | `apps/patient` only |
| Commit | Do not commit unless human asks |
| Language | Code/comments English; no new user-facing copy |

---

## 3. Current code facts (read these first)

- Splash UI: `src/pages/_/index.tsx` — `doctorLauncherLoading ? <Loading /> : <DoctorLauncherContent />`
- Also similar pattern: `src/pages/index.tsx`, `useDoctorViewHeaderSurface.ts`
- Gate logic: `src/modules/doctorHome/hooks/useNewDoctorLauncher.ts` — today loading stays true until trusted **persisted true** or `safeResolvedUserId`; `canResolve` waits `!pending` → user with cleared sticky-false + shell still sees splash (regression vs product rule)
- Device: `src/common/utils/doctorDeviceCache.ts` — `isDoctorDeviceCached()`
- Shell: `src/modules/doctorHome/utils/doctorHomeShell.ts` — `readDoctorHomeShell()`
- Flag helper: `src/modules/doctorHome/utils/doctorHomeLauncherFlag.ts` — `readTrustedEnabledLauncherFlag`

---

## 4. Implementation plan (execute in order)

### Step A — Shared “optimistic new home” helper

Add in `useNewDoctorLauncher.ts` (or tiny util next to flag helper):

```ts
function shouldOptimisticallyShowNewDoctorHome(userId: string | null): boolean
```

Rules:

- false if no `userId`
- true if `ensureTrustedEnabledLatch(userId)` (persist/memory true)
- true if `isDoctorDeviceCached()` and (`readDoctorHomeShell()?.userId === userId` OR zustand user already doctor for that id — prefer shell/device checks that work before/during EntryPoint)
- true if `readDoctorHomeShell()?.userId === userId` with non-empty centers (even if device key race)

Keep function pure enough to call from both hooks synchronously on render.

### Step B — Fix loading + enabled hooks

**`useIsNewDoctorLauncherLoading`:**

```
if (!doctor || !login || !userId) return false;
if (shouldOptimisticallyShowNewDoctorHome(userId)) return false;
if (safeResolvedUserId === userId) return false;
return true; // cold first visit only
```

**`useIsNewDoctorLauncherEnabled`:**

```
if (!doctor || !login || !userId) return false;
if (shouldOptimisticallyShowNewDoctorHome(userId)) {
  // still kick background resolve when canResolve / when login+userId
  return true;
}
// else after safe resolve use latched/isResolved; default false until then
```

Background resolve:

- Always set GB `user_id`, `refreshFeatures({ skipCache: true })`, assert match, then `isOn`.
- If result `true` → latch + persist true.
- If result `false` and `!pending` → latch false, persist false (enabled becomes false → legacy).
- If result `false` while `pending` → do not persist false; do not downgrade UI yet.

### Step C — Do not regress

- Do not remove RQ/shell persist.
- Do not reintroduce full-page Loading whenever optimistic signal is true.
- Logout/mismatch still clear flag + shell + device as already wired.

### Step D — Verify

From `apps/patient`:

1. Unit-test optimistic helper if extracted; or extend flag tests if logic lives in helper file.
2. `tsc` filter on touched files — no new errors.
3. Reasoning checks:
   - Device cached + shell, no flag key → **no** centered Loading; new feed mounts; GB runs in background.
   - Persisted true → no Loading.
   - Cold visit no cache → Loading until first safe resolve (acceptable once).
   - Safe false after !pending → legacy, no infinite Loading.

---

## 5. Files allowed to touch

- `src/modules/doctorHome/hooks/useNewDoctorLauncher.ts`
- `src/modules/doctorHome/utils/doctorHomeOptimisticHome.ts` (optional new)
- `src/modules/doctorHome/utils/doctorHomeOptimisticHome.spec.ts` (optional)
- `src/modules/doctorHome/utils/doctorHomeLauncherFlag.ts` (only if sharing helpers)
- `src/modules/doctorHome/specs/zero-splash-after-cache.agent.md` (this file)

Avoid changing `/_/` layout unless the Loading gate condition itself must move; prefer fixing the hook so the existing JSX stays.

---

## 6. Done criteria

- [ ] After first successful doctor-home session on device, refresh `/_/` never shows centered three-dot Loading due to flag/`getMe` wait
- [ ] Optimistic new home when device cache and/or shell and/or trusted flag true
- [ ] Background user_id-safe GB resolve still updates; can downgrade to legacy only after safe false + !pending
- [ ] Cold first visit may still load once
- [ ] No commit unless asked

---

## 7. Out of scope

- Removing Next.js dynamic() chunk loading entirely
- GrowthBook allowlist changes
- Plasmic content
- PR / commit

---

## 8. Execution command for the next agent

Implement this entire spec in one pass. Prefer fixing `useNewDoctorLauncher.ts` (+ small helper) over page rewrites. When finished, reply in Persian: what signals skip splash, how background GB still works, and how to verify with one refresh on `/_/` after a prior doctor session.
