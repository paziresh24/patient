# AGENT SPEC — `/_/` doctor-only static shell: first paint = real home (no interim UI)

**Audience:** coding agent only. Do not ask the human clarifying questions.  
**Mode:** implement end-to-end in `apps/patient`, verify, stop. Do not commit unless the human later asks.  
**Date locked:** 2026-07-31  
**Priority:** P0  

**Product lock (do not reopen):**
- `/_/` is **doctors only**. Patients must not use this page as a home; non-doctors redirect away. Do **not** optimize HTML to stay “neutral for patients.”
- **No SSR / no `getServerSideProps`** for identity. Keep CDN-friendly static document (`getStaticProps` empty OK).
- Goal: hard refresh with warm cache → **first visible frame is the real doctor home** (switcher + real feed chrome/content from persist). **No** empty white cards, pulse skeleton, three-dot Loading, or layout shift handoff.

**Supersedes (UX):**
- `DoctorHomeSsgShell` / empty `#doctor-static-boot` placeholder cards as primary boot UX (`static-ls-boot.agent.md` empty-card approach).
- Any boot that shows interim boxes “until React.”
Keep useful pieces: device mark, GrowthBook leaf module, static import of launcher body, shell + RQ persist keys, redirect non-doctors.

If chat conflicts with this file on boot UX / doctor-only `/_/`, **this file wins**.

---

## 1. Mission

Cached doctor hard-refreshes `/_/`:

1. Static HTML already contains the **doctor home page structure** (not an empty `#__next` waiting for client to invent layout).
2. Persisted data (`p24-doctor-home-shell-v1`, `p24-doctor-home-rq-v1`, date/center keys as already used) fills that structure **without a second “skeleton then real” phase**.
3. React takeover must **not** unmount into empty then repaint (no shift). Same tree/geometry, or adopt pre-painted real content in place.
4. Cold first visit without cache may still resolve auth — but must **not** invent fake empty cards; prefer minimal real chrome or redirect, never the current empty-box boot.

---

## 2. Locked decisions

| Topic | Decision |
|-------|----------|
| Audience of `/_/` | Doctor-only. Keep/strengthen non-doctor → `/patient` (or existing safe exit). Do not build patient-safe empty shell. |
| SSR / GSSP | **Forbidden** for this mission |
| `getStaticProps` | Keep empty static props |
| Interim UI | **Forbidden**: empty cards, pulse skeletons, centered Loading, `#doctor-static-boot` placeholder markup |
| Remove | Empty-card static boot script behavior; delete or gut `DOCTOR_HOME_INLINE_STATIC_BOOT_SCRIPT` placeholder painting; remove related CSS that only exists for empty boot |
| HTML structure | Bake **real doctor home chrome** into the static page for `/_/` (switcher row + feed layout regions). Prefer React SSR-of-static-component at **build time** (SSG render of a presentational shell with no user-specific data) OR equivalent markup in the page — so structure is in the HTML bytes. User-specific lists come from persist on client **into those regions**, not by replacing the whole page with a different layout. |
| Persist fill | On client, restore shell → Zustand (existing entryPoint path) + RQ persist **before first paint of feed body** (`useLayoutEffect` / sync restore already used — ensure feed reads cache on first commit, no loading gate when cache hit). |
| Optional tiny script | Allowed only if it **injects real persisted list snippets** into the SSG regions; if it cannot render real content, it must paint **nothing** (not boxes). Prefer fixing React first-paint from persist over a second DOM painter. |
| GrowthBook / flag | Do not block first paint of cached new-home on GB. Keep optimistic / trusted-true rules from prior specs. |
| Legacy Plasmic launcher | Must not flash on cached new-home path |
| Nested Hamdast modal dynamics | OK to stay dynamic |
| Commit | No unless asked |
| Scope | `apps/patient` only |

---

## 3. Implementation plan

### Step A — Kill interim boot UX
1. Remove empty-card painting from `doctorHomeStaticBoot.ts` / `_document` mount script (or remove mount entirely if unused).
2. Remove CSS for empty `#doctor-static-boot` display rules if mount gone.
3. Grep: no empty boot cards.

### Step B — Doctor structure in static HTML
1. Ensure `pages/_/index.tsx` SSG output includes doctor chrome via normal React render at build time.
2. Presentational switcher so build HTML contains پزشک/بیمار with doctor tab active.
3. Feed regions: stable layout containers matching real home.

### Step C — First client commit = cached home
1. Shell hydrate before paint; no Loading when RQ persist has data.
2. With device cache/shell, never empty resolving UI on `/_/`.
3. React geometry matches SSG chrome.

### Step D — Verify
Build, hard refresh checks, no commit.

---

## 4. Execution command

Implement in one pass. Prefer SSG doctor chrome + persist-on-first-commit over any placeholder boot. Reply in Persian when done.
