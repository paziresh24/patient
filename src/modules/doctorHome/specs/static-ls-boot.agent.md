# AGENT SPEC — Static LS boot before React (no SSR)

**Audience:** coding agent only. Do not ask the human clarifying questions.  
**Mode:** implement end-to-end in `apps/patient`, verify, stop. Do not commit unless asked.  
**Date locked:** 2026-07-31  
**Priority:** P0  

**Product intent:** `/_/` stays a **simple static CDN page**. Do **not** add SSR/`getServerSideProps` for doctor identity. First useful paint for cached doctors must come from a **tiny sync script + localStorage**, not from React hydration (~1MB JS).

**Supersedes (UX):** `DoctorHomeSsgShell` pulse skeleton gated on `data-doctor-client-ready` as the primary boot UX. Keep GrowthBook leaf / static `LauncherHomePage` import from `remove-page-dynamic-ssr.agent.md` unless this file conflicts on boot UX — **this file wins for boot paint**.

---

## 1. Mission

On hard refresh of `/_/` when `doctor-home-device=1` (and preferably valid `p24-doctor-home-shell-v1`):

1. **Before** Next.js/`_app` JS runs, user sees doctor switcher chrome + solid feed placeholders (not long pulse-skeleton waiting for React).
2. When React sets `data-doctor-client-ready`, the static boot node is hidden and real launcher takes over.
3. No SSR. Keep `getStaticProps` empty on `/_/`.

---

## 2. Locked decisions

| Topic | Decision |
|-------|----------|
| SSR / GSSP for identity | **Forbidden** |
| Mechanism | Mount `#doctor-static-boot` in `_document` **before** `<Main />` + sync inline script immediately after |
| Gate | Path is launcher home (`/_`, `/_/`, optional `/fa/_/` …) **and** `localStorage doctor-home-device === '1'` |
| Shell key | If `p24-doctor-home-shell-v1` valid (same rules as `readDoctorHomeShell`), may show a center label; if missing, still paint switcher + cards when device flag set |
| RQ persist parse | **Out of scope for v1** — do not parse `p24-doctor-home-rq-v1` in the inline script |
| Styling | Prefer **inline styles** in boot HTML so paint does not depend on Tailwind chunk order |
| `DoctorHomeSsgShell` | Remove from `pages/_/index.tsx` (delete component file if unused) |
| React takeover | Existing `data-doctor-client-ready` on `LauncherHomePage` hides `#doctor-static-boot` via CSS |
| Attr | Set `data-doctor-boot-painted="1"` on `<html>` when boot paints |
| Commit | No unless asked |
| Scope | `apps/patient` only |

---

## 3. Implementation plan

### A — Constants + script module
`src/common/utils/doctorHomeStaticBoot.ts` exporting mount id, attr names, and `DOCTOR_HOME_INLINE_STATIC_BOOT_SCRIPT` (IIFE string).

### B — `_document.tsx`
Before `<Main />`: empty mount div + script tag with the IIFE.

### C — CSS
Hide `#doctor-static-boot` by default; show when painted; hide when `html[data-doctor-client-ready]`. Remove or leave dead `data-doctor-ssg-shell` rules.

### D — Page
Drop `DoctorHomeSsgShell` from `pages/_/index.tsx`.

### E — Verify
Grep script wired; reasoning: device-cached refresh shows boot UI before React; after hydrate boot disappears. Optional production rebuild. No commit.

---

## 4. Done criteria

- [ ] Cached doctor `/_/` paints switcher-like UI from inline script without waiting for React
- [ ] No new SSR
- [ ] Boot hidden after `data-doctor-client-ready`
- [ ] No commit unless asked

---

## 5. Execution command

Implement in one pass. Reply in Persian: what changed, how to hard-refresh verify.
