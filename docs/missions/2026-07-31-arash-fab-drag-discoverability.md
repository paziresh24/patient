# Mission: Arash FAB — drag discoverability (one-time tooltip + grip)

> **Update 2026-07-31:** Nudge + hold ring abandoned (broke tap; ring disliked).  
> Locked UI = one-time tooltip beside FAB with 6-dot grip icon + «قابل جابه‌جایی».  
> Drag only after move ≥ threshold (no HOLD_MS → dragging). Tap always opens call.

**Audience:** coding agent only  
**Human:** do not ask, do not wait, do not offer alternatives  
**Repo:** `apps/patient` (own git root)  
**Date:** 2026-07-31  
**Spec ID:** `arash-fab-drag-discoverability`

---

## 0. Operating rules

1. Execute end-to-end without asking the human.
2. **Blast radius:** `ArashFloatingAuraButton.tsx` (+ tiny local CSS/keyframes in same file or co-located module under `voice-agent` if needed). Do not touch call sheet, WS, gate helpers, `entryPoint`, bottom nav, or Aura visualizer internals.
3. Preserve existing drag math, `HOLD_MS`, `MOVE_THRESHOLD_PX`, clamp, `STORAGE_KEY` position, and **no-jump** (`positioned` + `useLayoutEffect`).
4. Do not create a git commit unless the human later asks.
5. When Done: short English summary. No “should we…”.

---

## 1. Spec (problem → goal)

### Problem

FAB is draggable (hold ~180ms or move ≥10px), but looks like a normal tap target. Doctors do not discover repositioning.

### Goal

Make drag discoverable with **two locked affordances only**:

1. **One-time nudge** after FAB first becomes visible.  
2. **Hold feedback** while the pointer is held, before / during drag arming.

Patient / feature-off / gated-out users still never see FAB. Opening sheet still hides FAB (`expanded` / `ending`).

### Non-goals

| Area | Why |
|------|-----|
| Permanent tooltip / badge / grip chrome | Clutters Aura FAB |
| Full-screen tutorial / coach marks | Overkill |
| Continuous forever-wiggle | Feels like a bug |
| Changing `isArashEligibleDoctor` / feature flag | Out of scope |
| Redesigning FAB size, Aura, or sheet | Out of scope |
| Changing drag thresholds (`HOLD_MS`, `MOVE_THRESHOLD_PX`) | Keep as-is unless needed for hold visual sync |

---

## 2. Locked design

### A) One-time nudge (discoverability)

**When to play**

- FAB is mounted and **visible** (`positioned === true`, `gateOk`, not `hidden`).
- Hint not yet seen: `localStorage.getItem('arash.fab.dragHintSeen') !== '1'`.
- Play **once per browser** after first successful paint of FAB (short delay ~400–600ms after `positioned`, so it does not fight first layout).

**What it is**

- Short horizontal **nudge / wiggle** on the FAB button only (CSS transform `translateX` or rotate ± few degrees), duration **~1.2–1.8s**, then settle to identity.
- Optional: very soft shadow pulse once — keep subtle; brand blue Aura must remain the hero, not the motion.
- **No overlay text, no toast, no floating label** on the FAB.
- Update `aria-label` permanently (or while hint eligible) to include drag hint in Persian, e.g.  
  - idle: `تماس با آرش. برای جابه‌جایی نگه دارید`  
  - active call chrome: `باز کردن تماس آرش. برای جابه‌جایی نگه دارید`  
  Keep concise; do not add a visible caption.

**When to mark seen**

Set `localStorage.setItem('arash.fab.dragHintSeen', '1')` when **either**:

- nudge animation finishes, **or**
- user completes a real drag (`wasDragging === true` on pointer end) — whichever comes first.

After seen, never auto-nudge again (even on remount / new session).

**Do not**

- Replay nudge every page load.
- Block pointer events during nudge (user can still tap/drag).
- Animate `right`/`bottom` for the hint (that fights saved position); use **transform-only** motion.
- Introduce a CSS transition on `right`/`bottom` that reopens the no-jump bug.

### B) Hold feedback (confirmation while interacting)

**Armed state**

Introduce UI state `holdArmed` (boolean), true when:

- `pointerdown` started a valid gesture, **and**
- either `HOLD_MS` timer fired **or** movement crossed `MOVE_THRESHOLD_PX` (same moment drag becomes active today).

Clear `holdArmed` on `pointerup` / `pointercancel` / gesture end.

**Visual while `holdArmed`**

- `scale` slightly up (e.g. `1.06`–`1.08`) — override / supersede the existing `active:scale-[0.96]` while armed so press-shrink does not fight hold-grow.
- Stronger presence: slightly higher elevation **or** a soft ring (slate/brand, low opacity). Prefer ring + scale; avoid glow spam.
- Optional: `opacity` ~0.92 on the white disc only — keep Aura readable.
- Cursor: `grabbing` while armed (desktop); default otherwise.

**Do not**

- Show instructional text during hold.
- Haptic unless already used elsewhere in patient app for similar gestures (do not invent new native bridge work).
- Change click-vs-drag semantics: short tap without arming still opens/expands call as today.

### C) Interaction invariants (must keep)

| Behavior | Rule |
|----------|------|
| Tap (no drag) | Still `openCall` / `expandCall` |
| Drag end | Still `clampPos` + `savePos` (`arash.fab.position`) |
| Hide when sheet open | `expanded` / `ending` → unmount/hide as today |
| Gate | `isArashEligibleDoctor` + feature + login + `!pending` unchanged |
| No-jump | Still no paint until `positioned`; no position CSS transition |

---

## 3. Implementation notes (agent)

**Primary file:**  
`apps/patient/src/modules/voice-agent/components/ArashFloatingAuraButton.tsx`

Suggested constants:

```ts
const HINT_STORAGE_KEY = 'arash.fab.dragHintSeen';
const HINT_DELAY_MS = 500;
const HINT_DURATION_MS = 1400; // match CSS animation
```

Suggested state:

- `showNudge: boolean` — class toggles CSS animation once.
- `holdArmed: boolean` — class for scale/ring.

Wire `holdArmed`:

- set true inside existing hold timer callback and when move threshold promotes `dragging`.
- clear in `endPointer`.

Wire nudge:

- `useEffect` when `positioned && !hidden && !hintSeen`: timeout → set `showNudge`, on animation end (or timeout = duration) mark storage + clear `showNudge`.
- if `hidden` becomes true mid-delay, clear timeout (do not mark seen solely because sheet opened — only mark after play finish or successful drag).

Prefer Tailwind `animate-*` + `@keyframes` in existing global/patient CSS **only if** the project already co-locates small keyframes nearby; otherwise a short `<style>` is worse — use Tailwind arbitrary animation or a tiny CSS module under `voice-agent` if needed. Prefer **one file change** if possible.

---

## 4. Safety / isolation checklist

Touch only:

- `ArashFloatingAuraButton.tsx`
- optional: one small CSS/keyframes asset under `modules/voice-agent/` if Tailwind alone cannot express the nudge

Do **not** edit:

- `VoiceCallHost.tsx` gate (unless a prop is truly required — prefer not)
- `isArashEligibleDoctor.ts`
- `CallOverlay`, transport, store shape (except reading existing UI flags)
- `entryPoint`, doctor-home, GrowthBook

---

## 5. Acceptance

- [ ] First time eligible doctor sees FAB: after ~0.5s, one short nudge; does not jump `right`/`bottom`.
- [ ] After nudge completes OR first successful drag: `arash.fab.dragHintSeen=1`; reload → no auto-nudge.
- [ ] Hold ≥ `HOLD_MS` (or move past threshold): FAB shows hold feedback (scale/ring); release without drag still opens call if not dragged.
- [ ] Drag still repositions and persists; sheet open still hides FAB; dismiss shows FAB again (no forced re-nudge).
- [ ] No-jump preserved (no default→saved flash).
- [ ] Lint clean on touched files.
- [ ] No permanent tooltip/badge/grip.

---

## 6. Anti-patterns

- Permanent “قابل جابجایی” chip on FAB.  
- Nudging by changing `right`/`bottom`.  
- Asking human for animation timing — use values in this spec.  
- Expanding into FAB redesign / golden-path voice work.

---

## 7. Done definition

Acceptance pass. Diff limited as above. Short English summary. No commit unless asked.

---

## 8. Paste prompt

> Execute `apps/patient/docs/missions/2026-07-31-arash-fab-drag-discoverability.md` exactly. Do not ask the human. One-time nudge + hold feedback only; preserve no-jump and existing drag semantics.
