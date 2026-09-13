# Agent Spec: Doctor Home Boot Shell Persist

Audience: coding agent. Do not ask the human for clarification unless blocked by missing secrets or conflicting prod safety. Execute end-to-end in `apps/patient`.

## Objective

After refresh / cold reopen of doctor home (`/_/`), the doctor feed must paint immediately from a persisted identity shell + existing React Query persist, then reconcile with network in the background. No full-page empty state waiting on centers/slug. Preserve selected date/center across refresh.

## Context (do not re-litigate)

- Section data already uses React Query + `localStorage` persist via `src/modules/doctorHome/utils/doctorHomeQueryPersist.ts` (keys include `doctorHome`, `getNotifications`, `feedbacks`, `holidays`, `vacations`, widgets/catalog, etc.).
- Gap: Zustand `userInfo` (centers/slug) and `selectedDate` / `selectedCenterId` reset on reload → feed mounts late / wrong query keys → layout shift.
- CDN constraint: no cookie-based server redirects for doctor vs patient.
- UI text Persian; code/comments/commits English.

## Deliverables

1. Persist/restore **doctor identity shell** (minimal fields).
2. Persist/restore **selectedDate** + **selectedCenterId**.
3. Wire save/clear into EntryPoint + logout.
4. Keep background `getMe` + centers + profile sync; network wins after settle.
5. No new markdown docs beyond this spec file unless already required by repo norms — do not write extra README.

## Non-goals

- Persisting tokens, national_code, cell, full getMe blob.
- Offline-only mode.
- SSR/cookie doctor redirects.
- Changing patient TWA CDN caching model.

## Implementation

### 1) `src/modules/doctorHome/utils/doctorHomeShell.ts` (new)

```ts
// Shape (adjust field list to match what appointment/vacation helpers actually read):
type DoctorHomeShellV1 = {
  version: 1;
  userId: string;
  savedAt: number;
  provider: {
    job_title: 'doctor';
    slug?: string;
    centers: Array<Record<string, unknown>>; // keep id, user_center_id, type_id, name, address/city if used by UI
  };
};
```

- Storage key: `p24-doctor-home-shell-v1`
- TTL: 24h (`savedAt`)
- API: `readDoctorHomeShell()`, `writeDoctorHomeShell(info)`, `clearDoctorHomeShell()`, `shellMatchesUserId(userId)`
- `write` only when centers non-empty and doctor identity true (`isDoctorUser` / job_title doctor pattern already in codebase)
- Strip sensitive fields; only what query keys + feed need

### 2) Hydrate early

In client boot path used by doctor home (prefer `EntryPoint` and/or first client tick before feed gate):

- If shell valid → merge into `useUserInfoStore` via existing `setUserInfo` so `provider.centers` + `slug` exist before/while `getMe` runs.
- Conservative rule: only apply shell hydrate when `isDoctorDeviceCached()` is true **or** current path is `/_/` / `/_/*` doctor launcher. If both false, skip hydrate.
- After `getMe`: if `userId` mismatch → `clearDoctorHomeShell()` + clear RQ doctor-home persist (`clearDoctorHomePersistedCache` / `removeDoctorHomeQueries`) and do not keep shell data on screen.
- After successful centers+slug sync → `writeDoctorHomeShell(updatedInfo)`.

### 3) Selected date / center

Files: `store/selectedDate.ts`, `store/selectedCenter.ts`

- Mirror pattern used by `walletBalanceVisibility.ts` / `appointmentsScheduleExpanded.ts` (localStorage + hydrate on init).
- Keys: `p24-doctor-home-selected-date`, `p24-doctor-home-selected-center` (`all` or omit for null).
- On hydrate: if stored date older than 14 days from today → reset to today.
- When centers update: if `selectedCenterId` not in centers → set `null`.
- Clear both keys in logout alongside shell clear.

### 4) Logout

`src/modules/login/store/userInfo.ts` `logout`:

- Call `clearDoctorHomeShell()` and clear selected date/center keys (and existing `clearDoctorHomePersistedCache()`).

### 5) Feed gate

Ensure `useDoctorHomeContext` / overview does not stay empty when shell already has centers. Do not invent a second isDoctor definition — align with existing `setUserInfo` centers-based doctor identity.

### 6) Background sync (must keep)

Do not remove `getMe` / `getCentersByUserId` / `getDoctorProfile`. Shell is bootstrap only. After sync, overwrite store and let React Query `refetchOnMount: 'always'` / existing invalidate paths refresh section data.

## Files likely touched

- `src/modules/doctorHome/utils/doctorHomeShell.ts` (new)
- `src/common/components/layouts/entryPoint.tsx`
- `src/modules/login/store/userInfo.ts`
- `src/modules/doctorHome/store/selectedDate.ts`
- `src/modules/doctorHome/store/selectedCenter.ts`
- Possibly `useDoctorHomeContext.ts` / `doctorHomeOverview.tsx` only if gate still blocks incorrectly

## Verification

Run from `apps/patient`:

1. Manual / reasoning check: hydrate → feed can enable vacation/appointments keys with shell centers+slug.
2. `npx tsc --noEmit` filtered to touched paths if full tsc is noisy; fix errors you introduced.
3. Do not commit unless user explicitly asks.

Acceptance:

- Refresh `/_/` with prior doctor session + device cache: feed paints without waiting for centers network.
- Date/center survive refresh; invalid center resets to all.
- Logout clears shell + selections + does not leak to next account.
- Network sync still runs after paint.

## Out of scope follow-ups (ignore unless broken by this work)

- Scroll restore on sheet close (already partially handled).
- Plasmic legacy launcher API persist.
- Dev port / `__dev-proxy` / hung `:443` server issues.

## Done when

Code merged in working tree implements A+B above, logout clears, mismatch reconciles, and typecheck clean on touched files.
