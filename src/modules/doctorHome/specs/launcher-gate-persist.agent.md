# AGENT SPEC — Doctor Launcher Gate Persist (no splash on refresh)

**Audience:** coding agent only. Do not ask the human clarifying questions.  
**Mode:** implement end-to-end in `apps/patient`, verify, stop. Do not commit unless the human later asks.  
**Date locked:** 2026-07-30  
**Priority:** P0  
**Depends on:** `boot-shell-persist.agent.md` (shell already restores doctor identity before `getMe`)

If anything below conflicts with later chat messages, **this file wins** until explicitly superseded.

---

## 1. Mission

After full refresh on `/_/` (doctor view), the doctor must **not** see the centered three-dot `<Loading />` while waiting for `getMe` / GrowthBook when we already know they use the new doctor launcher.

Observed bug: header + پزشک/بیمار switcher render, but body is `<Loading />` because:

```ts
useIsNewDoctorLauncherLoading → pending || !growthbook.ready || !hasLatchedForUser
```

Shell persist fixed identity; this gate still blocks `DoctorLauncherContent`.

Do **not** change patient CDN, auth cookies, or GrowthBook feature semantics for users without a prior latch.

---

## 2. Locked decisions (do not reopen)

| Topic | Decision |
|-------|----------|
| Storage | `localStorage` only |
| Flag persist key | `p24-doctor-home-launcher-flag-v1` |
| Payload | `{ version: 1, userId: string, enabled: boolean, savedAt: number }` |
| TTL | 30 days from `savedAt`; expired → treat as miss and remove key |
| When to write | Every successful in-memory latch via `readFlag` / after `resolveFlagForUser` settles |
| When to hydrate memory latch | Synchronously when hooks need latch for a `userId` and memory latch missing/mismatched — call `hydrateLauncherFlagLatch(userId)` |
| Loading rule | `useIsNewDoctorLauncherLoading` returns **false** whenever memory latch exists for current `userId` (after hydrate attempt). Do **not** keep loading solely because `pending` or `!growthbook.ready` if latch is present. |
| Loading when no latch | Still true while doctor+login+userId and (pending \|\| !ready \|\| !latched) — first-ever visit unchanged |
| `canResolve` | Allow flag resolve when `isLogin && userId` **even if `pending`**, once GrowthBook `ready` (or after loadFeatures). Removes artificial wait on `getMe` when shell already set userId |
| Logout / mismatch | Clear flag key via `clearPersistedLauncherFlag()` alongside existing shell/RQ clears (`userInfo.logout` + EntryPoint getMe mismatch / getMe failure paths that already clear shell) |
| Flag off persisted | If `enabled: false` was latched, still hydrate — loading false, enabled false → legacy launcher path (correct) |
| Tests | Unit tests for persist helper: happy path, TTL, bad JSON, userId mismatch read returns null |
| Scope | Only `apps/patient` |
| Language | Code/comments English; no new UI copy |

---

## 3. Current code facts (read these first)

- Gate UI: `src/pages/_/index.tsx` — `doctorLauncherLoading ? <Loading /> : <DoctorLauncherContent />`
- Also: `src/pages/index.tsx`, `useDoctorViewHeaderSurface.ts`
- Logic: `src/modules/doctorHome/hooks/useNewDoctorLauncher.ts` — module-level `latched` lost on full reload
- Logout clears: `src/modules/login/store/userInfo.ts`
- Mismatch clears: `src/common/components/layouts/entryPoint.tsx`
- Shell helpers pattern: `src/modules/doctorHome/utils/doctorHomeShell.ts`

---

## 4. Implementation plan (execute in order)

### Step A — Persist helper

Create `src/modules/doctorHome/utils/doctorHomeLauncherFlag.ts`:

```ts
export const DOCTOR_HOME_LAUNCHER_FLAG_KEY = 'p24-doctor-home-launcher-flag-v1';
export const DOCTOR_HOME_LAUNCHER_FLAG_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type DoctorHomeLauncherFlagV1 = {
  version: 1;
  userId: string;
  enabled: boolean;
  savedAt: number;
};

export function readPersistedLauncherFlag(userId: string): boolean | null
export function writePersistedLauncherFlag(userId: string, enabled: boolean): void
export function clearPersistedLauncherFlag(): void
```

Rules:

- `readPersistedLauncherFlag`: parse; version≠1 / missing fields / TTL expired / `userId` mismatch → null (+ remove key when corrupt/expired)
- try/catch all storage
- `write`: always `version: 1`, `savedAt: Date.now()`

Optional: `doctorHomeLauncherFlag.spec.ts`

### Step B — Wire latch in `useNewDoctorLauncher.ts`

1. Keep module-level `latched`.
2. Add `hydrateLauncherFlagLatch(userId: string): boolean` — if `latched?.userId === userId` return `latched.enabled`; else read persist; if hit, set `latched = { userId, enabled }` and return enabled; else return… actually return whether hydrated. Prefer:

```ts
function ensureLatched(userId: string): boolean {
  if (latched?.userId === userId) return true;
  const enabled = readPersistedLauncherFlag(userId);
  if (enabled == null) return false;
  latched = { userId, enabled };
  return true;
}
```

3. In `readFlag`: after setting memory latch, `writePersistedLauncherFlag(userId, enabled)`.
4. `useIsNewDoctorLauncherLoading`:
   - Call `ensureLatched(normalizedUserId)` when doctor+login+id
   - Return `isDoctor && isLogin && !!normalizedUserId && !ensureLatched(...) && (pending || !isReady)`  
   - Equivalently: if latched for user → **false**; else existing wait conditions.
5. `useIsNewDoctorLauncherEnabled`:
   - On mount/effect for userId, `ensureLatched` so initial state can be enabled without waiting
   - Change `canResolve` to `isLogin && normalizedUserId != null && isReady` (**drop `!pending`**)
   - When `!isLogin`, clear **memory** latch only (`latched = null`); do **not** clear localStorage here (logout owns clear)
6. Export `clearPersistedLauncherFlag` usage from logout/entrypoint — not from the `!isLogin` effect.

### Step C — Clear on logout + mismatch

- `userInfo.ts` `logout`: add `clearPersistedLauncherFlag()`
- `entryPoint.tsx`: add clear on userId mismatch and on getMe failure (same places that clear shell)

### Step D — Do not regress

- Do not remove GrowthBook live resolve — still refresh latch when GB ready (write persist again)
- Do not change `/_/` layout structure beyond what loading hook already controls
- Do not touch RQ persist / shell keys

---

## 5. Files allowed to touch

- `src/modules/doctorHome/utils/doctorHomeLauncherFlag.ts` (new)
- `src/modules/doctorHome/utils/doctorHomeLauncherFlag.spec.ts` (optional new)
- `src/modules/doctorHome/hooks/useNewDoctorLauncher.ts`
- `src/modules/login/store/userInfo.ts`
- `src/common/components/layouts/entryPoint.tsx`
- `src/modules/doctorHome/specs/launcher-gate-persist.agent.md` (this file — already written)

Avoid drive-by refactors.

---

## 6. Verification (must run)

From `apps/patient`:

1. `npx jest src/modules/doctorHome/utils/doctorHomeLauncherFlag.spec.ts --runInBand` (if tests added)
2. `npx tsc --noEmit` filtered to touched paths — no new errors
3. Reasoning check: refresh with persist hit → loading false even if pending true

No commit unless human asks.

---

## 7. Done criteria

- [ ] Persist helper with TTL + clear
- [ ] Latch hydrates from LS before loading gate
- [ ] Loading ignores pending/GB when latched
- [ ] `canResolve` no longer waits on `pending`
- [ ] Logout + mismatch clear flag key
- [ ] Tests pass (if present)
- [ ] No commit

---

## 8. Out of scope

- Changing GrowthBook flag default / targeting
- Plasmic legacy launcher content
- Shell / date / center persist (already done)
- PR / commit

---

## 9. Execution command

Implement this entire spec in one pass. Prefer small focused diffs. When finished, reply in Persian: what changed, storage key, and how to verify (refresh `/_/` — feed should appear without centered three-dot wait when flag was previously true).
