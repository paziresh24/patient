# AGENT SPEC — Doctor Home Boot Shell Persist

**Audience:** coding agent only. Do not ask the human clarifying questions.  
**Mode:** implement end-to-end in `apps/patient`, verify, stop. Do not commit unless the human later asks.  
**Date locked:** 2026-07-30  
**Priority:** P0  

If anything below conflicts with later chat messages, **this file wins** until explicitly superseded.

---

## 1. Mission

After a full page refresh on doctor home (`/_/`), the doctor must see:

1. The doctor feed shell immediately (not an empty page waiting for `getMe`/centers).
2. Previously selected date + center restored.
3. Existing React Query persist (`p24-doctor-home-rq-v1`) able to hydrate section data on first paint.
4. Network still runs in the background and updates UI when server data differs.
5. Logout / different user never shows the previous doctor’s shell.

Do **not** change patient CDN behavior, server cookie redirects, or production auth.

---

## 2. Locked decisions (do not reopen)

| Topic | Decision |
|-------|----------|
| Storage | `localStorage` only (no IndexedDB, no cookies) |
| Shell key | `p24-doctor-home-shell-v1` |
| Date key | `p24-doctor-home-selected-date` |
| Center key | `p24-doctor-home-selected-center` (`all` means `null` in store) |
| Shell TTL | 24 hours from `savedAt` |
| Date restore rule | If stored date is more than 14 calendar days from today (local), reset to today |
| Center restore rule | If stored id not in current `provider.centers`, set `null` (all centers) |
| When to restore shell into Zustand | On client boot inside `EntryPoint` **before** awaiting `getMe`, **only if** `isDoctorDeviceCached()` is true |
| When to save shell | After successful centers+profile sync when `isDoctorUser(info)` and `centers.length > 0` |
| What to store in shell | Minimal: `userId`, `savedAt`, `version`, `provider.job_title='doctor'`, `provider.slug?`, `provider.centers` array (keep existing center object fields returned by API; do not strip unknown fields) |
| Sensitive fields | Do **not** add `national_code`, `cell`, tokens, cookies into shell. Existing center payloads from API may stay as-is (already used in memory today). |
| Logout | Clear shell + date + center keys; keep existing clears for RQ persist + doctor-home-device |
| User mismatch | After `getMe`, if shell.userId !== String(me.id) → clear shell + RQ doctor-home persist + date/center, then continue normal flow |
| selectedDate default | Still Gregorian `YYYY-MM-DD` via `jalali-moment` `moment().format('YYYY-MM-DD')` when no valid stored date |
| Language | Code/comments/commit messages English; no new user-facing copy required |
| Tests | Add focused unit tests if easy for shell read/write/TTL/mismatch helpers; skip E2E |
| Scope repo | Only `apps/patient` |

---

## 3. Current code facts (read these first)

- User store: `src/modules/login/store/userInfo.ts` — `setUserInfo` derives doctor from **non-empty centers**; preserves slug.
- Boot: `src/common/components/layouts/entryPoint.tsx` — `getMe` then `getCentersByUserId` + `getDoctorProfile`.
- Doctor feed gate: `useDoctorHomeContext` requires `is_doctor` + `job_title === 'doctor'`; overview returns null if not doctor.
- Device flag: `src/common/utils/doctorDeviceCache.ts` — `doctor-home-device`.
- RQ persist already exists: `src/modules/doctorHome/utils/doctorHomeQueryPersist.ts` (includes `vacations`).
- Date store: `src/modules/doctorHome/store/selectedDate.ts` (memory only).
- Center store: `src/modules/doctorHome/store/selectedCenter.ts` (memory only).
- Similar persist pattern to copy: `src/modules/doctorHome/store/walletBalanceVisibility.ts`.

---

## 4. Implementation plan (execute in order)

### Step A — Shell helper module

Create `src/modules/doctorHome/utils/doctorHomeShell.ts`:

Export:

```ts
export type DoctorHomeShellV1 = {
  version: 1;
  userId: string;
  savedAt: number;
  provider: {
    job_title: 'doctor';
    slug?: string;
    centers: unknown[]; // actual center objects from user store
  };
};

export const DOCTOR_HOME_SHELL_KEY = 'p24-doctor-home-shell-v1';
export const DOCTOR_HOME_SHELL_TTL_MS = 24 * 60 * 60 * 1000;

export function readDoctorHomeShell(): DoctorHomeShellV1 | null
export function writeDoctorHomeShell(input: Omit<DoctorHomeShellV1, 'version' | 'savedAt'> & { savedAt?: number }): void
export function clearDoctorHomeShell(): void
export function shellToUserInfoPatch(shell: DoctorHomeShellV1): Partial<UserInfo> // enough for setUserInfo
```

Rules inside helpers:

- `read`: parse JSON; if version≠1, missing userId, expired TTL, centers not non-empty array → return null and optionally remove key.
- wrap all storage in try/catch (private mode).
- `write`: always set `version: 1` and `savedAt: Date.now()`.

Optional small unit test file colocated: `doctorHomeShell.spec.ts` covering TTL expiry + bad JSON + happy path.

### Step B — selectedDate / selectedCenter persist

Update:

- `src/modules/doctorHome/store/selectedDate.ts`
- `src/modules/doctorHome/store/selectedCenter.ts`

Pattern:

- On store creation (client only), read localStorage.
- For date: validate `YYYY-MM-DD`; apply 14-day window vs `moment().format('YYYY-MM-DD')`; else today.
- For center: stored `all` → `null`; else string id.
- On `setSelectedDate` / `setSelectedCenterId`, write through to localStorage.
- Export `clearDoctorHomeViewSelection()` that removes both keys and resets stores to today + null — call from logout path.

SSR safety: only touch `localStorage` when `typeof window !== 'undefined'`.

### Step C — Wire EntryPoint

File: `src/common/components/layouts/entryPoint.tsx`

1. **Before** `getMe` (inside the existing client `useEffect` boot, after `hasCalledLogin` guard):

```
if (isDoctorDeviceCached()) {
  const shell = readDoctorHomeShell();
  if (shell) {
    setUserInfo({
      id: shell.userId,
      is_doctor: true,
      provider: shell.provider,
    });
    // setUserInfo already forces job_title from centers; ensure centers non-empty
  }
}
```

Do not set `isLogin: true` via hacks outside `setUserInfo` — `setUserInfo` already sets `isLogin: true`. Accept that this briefly marks login before getMe; if getMe fails, existing catch already clears user state — also call `clearDoctorHomeShell()` + `clearDoctorHomeViewSelection()` there.

2. **After successful centers sync** when doctor:

```
writeDoctorHomeShell({
  userId: String(updatedInfo.id),
  provider: {
    job_title: 'doctor',
    slug: updatedInfo.provider?.slug,
    centers: updatedInfo.provider?.centers ?? [],
  },
});
```

3. **After getMe success**, before/after sync:

```
const shell = readDoctorHomeShell();
if (shell && shell.userId !== String(userData.id)) {
  clearDoctorHomeShell();
  clearDoctorHomeViewSelection();
  clearDoctorHomePersistedCache(); // existing RQ persist clear
  removeDoctorHomeQueries(queryClient); // only if queryClient accessible; if not, rely on provider logout effect / call clear persist storage only
}
```

If `queryClient` is not available in EntryPoint, only clear shell + view selection + `clearDoctorHomePersistedCache()` (storage). Provider already removes queries on logout.

### Step D — Logout

File: `src/modules/login/store/userInfo.ts` `logout`:

Add:

- `clearDoctorHomeShell()`
- `clearDoctorHomeViewSelection()`

Keep existing `clearDoctorDeviceCache()` and `clearDoctorHomePersistedCache()`.

### Step E — Center validation after sync

When centers update in EntryPoint, if `useSelectedCenterStore.getState().selectedCenterId` is set and not found in new centers → `setSelectedCenterId(null)`.

Import the store directly (zustand getState) — acceptable in this codebase.

### Step F — Do not regress

- Keep RQ persist as-is (including `vacations`).
- Keep `refetchOnMount: 'always'` / background refresh behavior.
- Do not re-introduce blocking SSR GrowthBook on `/apphome` or `/_/`.
- Do not register doctor shell SW on local hosts.

---

## 5. Files allowed to touch

- `src/modules/doctorHome/utils/doctorHomeShell.ts` (new)
- `src/modules/doctorHome/utils/doctorHomeShell.spec.ts` (optional new)
- `src/modules/doctorHome/store/selectedDate.ts`
- `src/modules/doctorHome/store/selectedCenter.ts`
- `src/modules/doctorHome/store/clearDoctorHomeViewSelection.ts` (or export clear from one of the stores)
- `src/common/components/layouts/entryPoint.tsx`
- `src/modules/login/store/userInfo.ts`

Avoid drive-by refactors outside this list.

---

## 6. Verification (must run)

From `apps/patient`:

1. `npx tsc --noEmit` — ignore pre-existing errors outside touched files; **no new errors** in touched files.
2. If Jest unit test added: `npx jest src/modules/doctorHome/utils/doctorHomeShell.spec.ts --runInBand` (or project’s `test:ci` path pattern).
3. Manual reasoning check (no browser required if blocked):  
   - shell restore only when device cache flag set  
   - logout clears keys  
   - date >14 days rejected  

Do not claim “done” without at least tsc filter on touched paths / jest if present.

---

## 7. Done criteria (agent self-check)

- [ ] Shell helper exists with TTL + clear
- [ ] Date/center persist + clear
- [ ] EntryPoint restores shell when `isDoctorDeviceCached()` before getMe
- [ ] EntryPoint writes shell after successful doctor centers sync
- [ ] userId mismatch clears shell + view selection + RQ persist storage
- [ ] logout clears shell + view selection
- [ ] Invalid selected center cleared after centers sync
- [ ] No new user-facing Persian copy
- [ ] No commit created (unless human later asks)

---

## 8. Out of scope (ignore)

- Plasmic launcher API persist
- Persisting full getMe profile fields beyond provider centers/slug
- Changing `/apphome` patient UX
- Fixing ISP TLS issues for `__dev-proxy/ravi-apis`
- Scroll restoration for sheets (already handled separately)
- Creating a PR

---

## 9. Execution command for the next agent

Implement this entire spec in one pass. Prefer small focused diffs. If a helper already partially exists, extend it rather than duplicating. When finished, reply in Persian with: what changed, which keys were added, and how to verify with one refresh on `/_/`.
