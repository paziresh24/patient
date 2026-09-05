# AGENT SPEC — Doctor Home Flag: user_id-safe latch (fix sticky legacy)

**Audience:** coding agent only. Do not ask the human clarifying questions.  
**Mode:** implement end-to-end in `apps/patient`, verify, stop. Do not commit unless the human later asks.  
**Date locked:** 2026-07-30  
**Priority:** P0  
**Supersedes (partial):** `launcher-gate-persist.agent.md` decisions that allowed early resolve/`false` persist before GrowthBook `user_id` targeting was trustworthy. Keep the persist key, TTL helper, logout clears, and “no splash when latched **true**” intent.  
**Depends on:** `boot-shell-persist.agent.md`, existing `doctorHomeLauncherFlag.ts`

If anything below conflicts with later chat messages or older specs, **this file wins** until explicitly superseded.

---

## 1. Mission

Doctors targeted by GrowthBook flag `doctor-home:enable` (rules based on attribute **`user_id`**) must keep seeing the **new** doctor home after refresh.

### Regression to fix

After launcher-flag persist, some targeted doctors land on **legacy Plasmic launcher** (wallet card, میانبرها, امکانات کاربردی) with **no** پزشک/بیمار switcher.

Root cause:

1. Flag evaluation ran (or was persisted) when GrowthBook had missing/stale `user_id` → `isOn('doctor-home:enable') === false`.
2. That `false` was written to `p24-doctor-home-launcher-flag-v1`.
3. Loading gate treats any latch (including `enabled: false`) as “ready” → skips splash → `useIsNewDoctorLauncherEnabled()` returns false → `/_/` renders `LegacyLauncherSection`.

### Non-goals

- Do not remove flag persist entirely.
- Do not change GrowthBook dashboard rules.
- Do not change patient CDN / auth cookies.
- Do not redesign doctor home UI.

---

## 2. Product / targeting fact (do not ignore)

**`doctor-home:enable` is decided by GrowthBook using the `user_id` attribute.**

Therefore:

- Calling `growthbook.isOn('doctor-home:enable')` before `String(growthbook.getAttributes().user_id) === String(currentDoctorUserId)` is **invalid** for latch/persist.
- After setting attributes, features must be refreshed before reading the flag (do not assume `ready === true` means evaluation used the new `user_id`).
- Persisting a premature `false` is worse than showing a short loading state.

---

## 3. Locked decisions (do not reopen)

| Topic | Decision |
|-------|----------|
| Flag key | Keep `doctor-home:enable` |
| Persist key | Keep `p24-doctor-home-launcher-flag-v1` (same helper module) |
| When `isOn` is allowed | Only inside `resolveFlagForUser` **after** all of: (a) `userId` argument is non-empty, (b) GB attributes `user_id` equals that `userId`, (c) `await growthbook.refreshFeatures({ skipCache: true })` (or equivalent that re-evaluates with new attrs) completed — then `isOn` |
| Persist `enabled: true` | Allowed after a valid `isOn` read as above |
| Persist `enabled: false` | Allowed **only** after a valid `isOn` read as above **and** auth is no longer pending (`useUserInfoStore.pending === false`) so identity is stable. Do **not** persist `false` during shell/`getMe` race |
| Hydrate from LS for UI | Hydrate **`enabled: true`** → treat as latched on; show new home immediately; still re-resolve in background when safe and update if GB says otherwise |
| Hydrate `enabled: false` from LS | **Do not** treat as authoritative for skipping loading / forcing legacy on first paint. Ignore persisted `false` for the loading short-circuit (treat as cache miss for “fast path”). Re-resolve safely; only then show legacy if still false. Optionally delete persisted `false` on read until confirmed, or overwrite only after safe resolve |
| Loading rule | `useIsNewDoctorLauncherLoading`: false only when latched **`enabled === true`** for current user (memory or trusted persist). If no trusted true latch → keep loading while doctor+login+userId until safe resolve finishes |
| `canResolve` | Require `isLogin && userId && growthbook` path ready **and** prefer waiting until `pending === false` before the **first trusted** resolve that may persist `false`. Background re-check after pending clears is mandatory if an optimistic true latch was used from persist |
| Shell restore | Shell may set Zustand user early; that does **not** by itself authorize `isOn`. Still set GB `user_id` from that id, refreshFeatures, then evaluate |
| Logout / mismatch | Keep clearing persist key (already wired) |
| One-time recovery | On boot, if persist payload is `enabled: false`, clear it or ignore it (per hydrate rule above) so sticky legacy self-heals without asking the human to wipe LS manually |
| Tests | Update/add unit tests: ignore/clear false persist on read path if you implement ignore-in-helper; document safe-resolve preconditions in hook tests only if easy — helper tests sufficient |
| Scope | `apps/patient` only |
| Commit | Do not commit unless human asks |

---

## 4. Current code facts (read these first)

- Gate UI: `src/pages/_/index.tsx` — `swapActive = useIsNewDoctorLauncherEnabled()`; legacy when false and not loading
- Hook: `src/modules/doctorHome/hooks/useNewDoctorLauncher.ts` — `readFlag` always persists; `ensureLatched` trusts any boolean; loading false on any latch; `canResolve` currently ignores `pending`
- Persist: `src/modules/doctorHome/utils/doctorHomeLauncherFlag.ts`
- `setUserInfo` already sets GB `user_id` + `refreshFeatures` — races with early resolve are real
- Older spec `launcher-gate-persist.agent.md` caused this regression; follow **this** file instead for flag semantics

---

## 5. Implementation plan (execute in order)

### Step A — Persist helper tweaks

In `doctorHomeLauncherFlag.ts` (and spec tests):

- Add `readPersistedLauncherFlagTrustingTrueOnly(userId): true | null` **or** change `readPersistedLauncherFlag` usage so consumers that drive “skip loading / show new home” only accept `true`.
- Recommended: keep `readPersistedLauncherFlag` as-is for raw read; add:

```ts
/** Fast-path hydrate: only trusted positive latch. False/missing → null (cache miss). */
export function readTrustedEnabledLauncherFlag(userId: string): true | null
```

- If raw read is `{ enabled: false }` for this userId, **remove the key** (self-heal sticky false from the buggy build) and return null from the trusted reader.

### Step B — Fix `useNewDoctorLauncher.ts`

1. `ensureLatched` / hydrate for fast path: only latch from persist when trusted **true**.
2. `resolveFlagForUser(userId)`:
   - Always `setAttributes` including `user_id: userId`, `loggedIn: true`, `is_doctor: true` (merge existing attrs).
   - Always `await growthbook.refreshFeatures({ skipCache: true })` (and `loadFeatures` if not ready, if still needed in this codebase).
   - Assert `String(growthbook.getAttributes().user_id) === String(userId)` before `isOn`; if not, throw/retry once — never `readFlag` on mismatch.
3. `readFlag`:
   - Compute `enabled = growthbook.isOn('doctor-home:enable')`.
   - Update memory latch always.
   - `writePersistedLauncherFlag` if `enabled === true` **OR** (`enabled === false` && `!useUserInfoStore.getState().pending`).
   - If `enabled === false` while pending: do **not** write persist; do not leave a sticky false in LS.
4. `useIsNewDoctorLauncherLoading`: return false **only** if memory/persist trusted enabled true; else true for doctor+login+userId until resolve settles (then false regardless of enabled so legacy can show without infinite spinner).
5. `canResolve`: `isLogin && userId && isReady`. For the resolve that is allowed to conclude `false` for UI, also require `!pending` **or** run two-phase: optimistic resolve only to confirm `true` while pending; full resolve including false after `!pending`.
   - Simplest locked approach: **`canResolve = isLogin && userId && isReady && !pending`** again for correctness, while fast path from **persisted true** still skips loading. First visit / wiped LS waits for getMe — acceptable. Persisted true users keep instant new home.
6. After safe resolve returns `true`/`false`, update React state; if `true`, persist; if `false` after `!pending`, persist false and show legacy.

### Step C — Do not regress

- Logout/mismatch still clear flag key.
- Shell + RQ persist untouched.
- No new Persian UI strings.

### Step D — Verify

From `apps/patient`:

1. Jest for launcher flag helper (trusted-true / clears false).
2. `tsc` filter on touched files — no new errors.
3. Reasoning: with LS `{enabled:true,userId}`, refresh → new home, no legacy; with sticky `{enabled:false}`, boot clears/ignores → must re-resolve with user_id → targeted doctor returns to new home; with no LS, may load until `!pending` then correct UI.

---

## 6. Files allowed to touch

- `src/modules/doctorHome/utils/doctorHomeLauncherFlag.ts`
- `src/modules/doctorHome/utils/doctorHomeLauncherFlag.spec.ts`
- `src/modules/doctorHome/hooks/useNewDoctorLauncher.ts`
- `src/modules/doctorHome/specs/launcher-flag-userid-safe.agent.md` (this file)

Touch `entryPoint.tsx` / `userInfo.ts` only if clear-on-mismatch already missing (should already clear flag).

---

## 7. Done criteria

- [ ] Premature `false` cannot sticky-lock legacy via localStorage
- [ ] `isOn` only after GB `user_id` matches doctor id + refreshFeatures
- [ ] Persisted **true** still skips centered Loading on refresh
- [ ] Targeted doctor (flag on for their user_id) sees new doctor home, not Plasmic legacy
- [ ] Tests updated; no commit unless asked

---

## 8. Out of scope

- Changing who is in the GrowthBook percentage / allowlist
- Plasmic launcher content
- PR creation

---

## 9. Execution command for the next agent

Implement this entire spec in one pass. Prefer small diffs in the hook + flag helper. When finished, reply in Persian: what changed, how sticky-false is healed, and how to verify on `/_/` with DevTools showing GB `user_id` + flag on.
