# Mission: Arash FAB stays visible after auth/centers sync

**Audience:** coding agent only  
**Human:** do not ask, do not wait, do not offer alternatives  
**Repo:** `apps/patient` (own git root)  
**Date:** 2026-07-30  
**Spec ID:** `arash-fab-gate-stable`

---

## 0. Operating rules

1. Execute end-to-end without asking the human.
2. **Blast radius = Arash voice UI gate only.** Do not change doctor-home redirect, `isDoctorUser` semantics used elsewhere, `entryPoint` centers sync, GrowthBook global setup, or panel APIs.
3. Do not redesign FAB, sheet, Aura visuals, drag, or no-jump positioning logic (keep `positioned` / `useLayoutEffect`).
4. Do not create a git commit unless the human later asks.
5. When Done: short English summary. No “should we…”.

---

## 1. Spec (problem → goal)

### Problem

FAB appears for a logged-in doctor, then **disappears after a few seconds without opening the call sheet**.

Root cause: visibility is gated on `isDoctorUser(user)`, which requires `provider.centers.length > 0`. After `getMe`, `pending` becomes false and FAB can show (often with shell/cache centers). Shortly after, `syncDoctorCenters` in `entryPoint.tsx` may write `centers: []` (empty API / non-array payload) or merge clears centers → `isDoctorUser` false → `VoiceCallHost` returns `null` and unmounts FAB.

This is **not** the intentional hide when `expanded` / `ending`.

### Goal

Once Arash chrome has legitimately shown for a doctor session, it must **not vanish** solely because `centers` transiently empties during background sync. Patient users and feature-off users must still never see FAB.

### Non-goals (do not touch)

| Area | Why |
|------|-----|
| `isDoctorUser()` in `useDoctorHomeRedirect.ts` | Used by redirect, launcher, loading — changing it ripples doctor home |
| `entryPoint.tsx` `syncDoctorCenters` / `getMe` | Auth/centers pipeline for whole doctor shell |
| `clearDoctorDeviceCache` / shell write rules | Device redirect behavior |
| GrowthBook refresh in `setUserInfo` | Global feature targeting |
| Call sheet / WS / barge / show_ui | Out of scope |

---

## 2. Locked design (Arash-local gate only)

Introduce a **small helper used only by Arash voice UI**, e.g.:

`apps/patient/src/modules/voice-agent/utils/isArashEligibleDoctor.ts`

```ts
/** Visibility gate for Arash chrome only — must not be used for redirect/home. */
export function isArashEligibleDoctor(user: UserInfo): boolean {
  // Prefer existing centers check when available.
  if (isDoctorUser(user)) return true;
  // Survive transient empty centers after getMe / sync:
  if (user?.provider?.job_title === 'doctor') return true;
  // Cold path: device already marked doctor this browser.
  if (typeof window !== 'undefined' && isDoctorDeviceCached()) return true;
  return false;
}
```

(Adjust imports; keep function pure and documented as **Arash-only**.)

### Apply in exactly these two places

1. `VoiceCallHost.tsx` — replace `isDoctorUser(user)` with `isArashEligibleDoctor(user)`.  
2. `ArashFloatingAuraButton.tsx` — replace `isDoctorUser(user)` in `gateOk` with `isArashEligibleDoctor(user)`.

Keep all other gates unchanged:

- `useFeatureIsOn(ARASH_VOICE_AGENT_FEATURE)`
- `!pending` on host (and FAB’s existing pending/login checks)
- `user?.id` / `isLogin` as today on FAB
- `expanded` / `ending` still hide FAB (call chrome)

### Explicitly do NOT

- Change `isDoctorUser` implementation.  
- Change `entryPoint` merge / `centers: []` fallback.  
- Use `isArashEligibleDoctor` outside `modules/voice-agent/`.  
- Soften feature flag (keep GrowthBook).  
- Show FAB to patients (`job_title` not doctor and no device cache and no centers).

---

## 3. Safety / isolation checklist

Before coding, agent must confirm plan touches **only**:

- new `voice-agent/utils/isArashEligibleDoctor.ts` (or equivalent under `voice-agent/`)
- `VoiceCallHost.tsx`
- `ArashFloatingAuraButton.tsx`
- optional export from `voice-agent/index.ts` **only if needed** (prefer no public export)

No edits under:

- `modules/doctorHome/**`
- `common/hooks/useDoctorHomeRedirect.ts` (except import if reading `isDoctorUser`)
- `common/components/layouts/entryPoint.tsx`
- `login/store/userInfo.ts`

---

## 4. Acceptance

- [ ] Doctor with feature on: FAB appears after auth; **stays visible** for ≥30s without opening sheet even if `centers` briefly empty in store (simulate by temporarily clearing centers in DevTools if needed — or reason from code path).  
- [ ] Opening sheet still hides FAB; dismiss sheet shows FAB again.  
- [ ] Patient / logged-out / feature off: no FAB.  
- [ ] Doctor home redirect / launcher / `isDoctorUser` call sites unchanged (diff does not modify those files).  
- [ ] Lint clean on touched files.  
- [ ] No-jump `positioned` / `useLayoutEffect` behavior preserved.

---

## 5. Anti-patterns

- “Fix” by editing `entryPoint` centers sync — **forbidden** in this mission.  
- Changing global `isDoctorUser` — **forbidden**.  
- Asking human whether to change entryPoint — already decided: **no**.  
- Expanding into golden-path voice / FAB redesign.

---

## 6. Done definition

Acceptance pass. Diff limited to voice-agent gate helper + two consumers. Short summary of files touched. No commit unless asked.

---

## 7. Paste prompt

> Execute `apps/patient/docs/missions/2026-07-30-arash-fab-gate-stable.md` exactly. Do not ask the human. Do not modify entryPoint or isDoctorUser.
