# AGENT SPEC — `/_/` doctor identity gate: show new home before Zustand doctor is ready

**Audience:** coding agent only. Do not ask the human clarifying questions.  
**Mode:** implement end-to-end in `apps/patient`, verify, stop. Do not commit unless the human later asks.  
**Date locked:** 2026-07-30  
**Priority:** P0  

**Depends on:** `zero-splash-after-cache.agent.md`, `zero-dynamic-splash.agent.md`, `boot-shell-persist.agent.md`  

**Supersedes:** any prior behavior where `/_/` with `doctor-home-device` / valid shell still rendered `isResolving` Loading or `LegacyLauncherSection` (and its dynamic splash) because Zustand did not yet have `centers` / `job_title`.

If anything below conflicts with later chat messages, **this file wins** for `/_/` first-paint gating until superseded.

---

## 1. Mission

Opening `/_/` directly (mobile or desktop) after a prior doctor session must:

1. Show **پزشک/بیمار switcher + new doctor feed** as soon as possible — not patient bottom-nav chrome with centered three-dot Loading.
2. Not wait for `getMe` / centers sync before choosing the **new-home branch** of `/_/` (`showSwitcher` path).
3. Not fall into `LegacyLauncherSection` merely because `useIsNewDoctorLauncherEnabled()` returned false while `!isDoctorUser(zustand)` yet.
4. Still background-resolve GrowthBook with `user_id` and still sync centers; may downgrade to legacy only after safe `false` + `!pending` (unchanged from userid-safe rules).

### Observed failure mode

- URL is `/_/`.
- No switcher; patient nav («نوبت‌های من»، «پروفایل»); header skeleton; centered Loading.
- Cause: `showSwitcher = swapActive || doctorLauncherLoading` both false until `isLogin` + centers; meanwhile `shouldShowLauncher` true via `isDoctorDeviceCached()` → **Legacy** dynamic `pageLoading`. Bottom nav uses `job_title === 'doctor'` which is also unset → patient menu.

---

## 2. Locked decisions (do not reopen)

| Topic | Decision |
|-------|----------|
| `/_/` branch for cached doctor | Prefer **new home path** (`DoctorViewSwitcher` + `DoctorLauncherContent`) whenever `hasDoctorIdentity` (device cache and/or shell and/or zustand doctor) — **not** Legacy |
| `showSwitcher` | `swapActive \|\| doctorLauncherLoading \|\| hasDoctorIdentity` (or equivalent using `useLauncherPageAccess().isDoctor` which already ORs identity) |
| Optimistic hooks | Check device/shell **before** requiring `isDoctorUser(user)` / `isLogin`; `shouldOptimisticallyShowNewDoctorHome`: **`isDoctorDeviceCached()` does not require userId** |
| Shell hydrate timing | Restore shell into Zustand in **`useLayoutEffect`** (before paint) in `EntryPoint`, not only `useEffect` — so first painted frame can already have centers/`job_title` |
| `isResolving` splash on `/_/` | Do not show when `hasDoctorIdentity`; keep for true cold non-doctor resolving |
| Legacy on `/_/` | Only when identity says show launcher **and** new-home flag is conclusively off (safe resolve false + !pending), not while merely “zustand doctor not ready yet” |
| Bottom nav | After shell hydrate / doctor identity, doctor shell nav appears (`isDoctor && !partnerKey`) |
| GB / RQ / shell keys | Unchanged semantics otherwise |
| Commit | No unless asked |
| Scope | `apps/patient` only |

---

## 3. Current code facts

- `src/pages/_/index.tsx` — `showSwitcher` ignores device identity; else → Legacy/`isResolving`
- `src/common/hooks/useLauncherPageAccess.ts` — `hasDoctorIdentity`, returns `isDoctor: isDoctor \|\| hasDoctorIdentity`
- `src/modules/doctorHome/hooks/useNewDoctorLauncher.ts` — early `if (!isDoctor \|\| !isLogin \|\| !userId) return false` blocks optimistic
- `src/modules/doctorHome/utils/doctorHomeOptimisticHome.ts` — requires userId before device-cache check
- `src/common/components/layouts/entryPoint.tsx` — shell restore in `useEffect` (after paint)
- Bottom nav: `isDoctorShell = hasDoctorIdentity && !partnerKey` (no as-main-home flag)

---

## 4. Implementation plan

### Step A — Optimistic helper

In `doctorHomeOptimisticHome.ts`:

- If `isDoctorDeviceCached()` → `true` **even when userId is null/empty**
- Else if no userId → `false`
- Else trusted flag / matching shell as today

Update unit tests accordingly.

### Step B — Hooks

In `useNewDoctorLauncher.ts`:

- Compute `uid = normalizedUserId ?? readDoctorHomeShell()?.userId ?? null`
- **Loading:** if `shouldOptimisticallyShowNewDoctorHome(uid)` → `false` **before** the `!isDoctor \|\| !isLogin` early return
- **Enabled:** if optimistic (device/shell/flag) and `!customize.partnerKey` → `true` before requiring zustand doctor; still run background resolve when login+userId available; conclusive safe false + !pending still returns false

### Step C — `/_/` page branch

```ts
const { isResolving, shouldShowLauncher, isDoctor: launcherDoctorIdentity } = useLauncherPageAccess();
const showSwitcher = swapActive || doctorLauncherLoading || launcherDoctorIdentity;
```

When `showSwitcher`, render switcher + content (not Legacy). Cold non-identity users keep `isResolving` / Legacy as today.

### Step D — EntryPoint shell hydrate

Move shell restore (`isDoctorDeviceCached` + `readDoctorHomeShell` + `setUserInfo(shellToUserInfoPatch)`) to **`useLayoutEffect`** (or a layout effect that runs once before paint) so centers/`job_title` exist for first paint. Keep `getMe` in `useEffect` as now. Do not double-restore unsafely (guard with ref like `hasCalledLogin` / dedicated `hasHydratedShell`).

### Step E — Verify

1. Jest optimistic helper (device cache without userId → true)
2. `tsc` filter touched files
3. Reasoning: open `/_/` with `doctor-home-device=1` and valid shell → switcher + feed, not patient nav + three dots; no Legacy dynamic splash on that path
4. No commit

---

## 5. Files allowed to touch

- `src/modules/doctorHome/utils/doctorHomeOptimisticHome.ts`
- `src/modules/doctorHome/utils/doctorHomeOptimisticHome.spec.ts`
- `src/modules/doctorHome/hooks/useNewDoctorLauncher.ts`
- `src/pages/_/index.tsx`
- `src/common/components/layouts/entryPoint.tsx`
- `src/common/components/layouts/bottomNavigation/bottomNavigation.tsx` (optional, minimal)
- `src/modules/doctorHome/specs/launcher-identity-first-paint.agent.md` (this file)

---

## 6. Done criteria

- [ ] Device-cached `/_/` does not use Legacy/`isResolving` splash while waiting for centers
- [ ] Optimistic helper: device cache works without userId
- [ ] Hooks do not require zustand doctor before optimistic true
- [ ] Shell hydrate before paint via useLayoutEffect
- [ ] No commit unless asked

---

## 7. Out of scope

- Changing GrowthBook targeting
- Removing all Loading forever for never-seen-before doctors
- apphome redirect loading (separate concern unless trivial shared helper)

---

## 8. Execution command

Implement in one pass. Reply in Persian: what fixed the “پزشک بودن مانع نمایش” path, and how to verify by opening `/_/` directly with device cache.
