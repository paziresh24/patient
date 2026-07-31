# Mission: Arash Floating Aura FAB

**Audience:** coding agent only  
**Human:** do not ask, do not wait for confirmation, do not offer alternatives for basic UX  
**Repo root for this work:** `apps/patient` (own git repo)  
**Date locked:** 2026-07-30

---

## 0. Operating rules (mandatory)

1. Execute this mission end-to-end without asking the human.
2. For any unspecified basic UX/mobile detail, apply global mobile standards (Material/iOS FAB patterns, safe-area, 44px touch, RTL). Do not surface those choices.
3. Do **not** change voice WS protocol, STT/LLM, show_ui content, or barge logic unless required to wire Aura status into the FAB.
4. Do **not** invent a second minimized chrome (no bottom pill). The FAB **is** the minimized state.
5. Do **not** silently move UI into/out of the call sheet beyond what this doc says.
6. When done: run lint on touched files if available; leave working tree ready; summarize what changed in one short paragraph (no “should we…”).

---

## 1. Goal

Replace the Arash entry in the doctor bottom navigation with a **draggable floating Aura button** that:

- Exists on **all pages** (mounted once via `VoiceCallHost` in `_app`)
- **Tap** opens the Arash call sheet
- **Hold + drag** repositions anywhere on screen (clamped to safe area)
- Shows **real call status** via the existing Aura visualizer
- Replaces `MinimizedCallPill` entirely

---

## 2. Locked product decisions

| Topic | Decision |
|--------|----------|
| Entry | FAB only for primary open; remove center `VoiceBottomNavButton` from bottom nav |
| Minimized chrome | FAB only — delete `MinimizedCallPill` usage |
| FAB when sheet open (`expanded`) or `ending` | **Hidden** |
| FAB when call active and sheet closed | Visible; Aura reflects live `WsVoiceStatus` (+ volume when speaking if available) |
| FAB when idle (no call) | Visible; calm Aura (`listening` or equivalent vivid idle — not dim `idle` if that looks broken) |
| Drag | Long-press then drag; tap must not fire after a drag (movement threshold ~8–12px) |
| Position persist | `localStorage` key `arash.fab.position` as `{ right: number, bottom: number }` in CSS px |
| Default position | Above bottom nav, end-side with ≥16px inset + safe-area; never under nav or notch |
| Hang up | Only from sheet controls — FAB does not end the call |
| Feature gate | Same as today: GrowthBook `arash_voice_agent` + logged-in doctor (`isDoctorUser`) |
| Desktop | FAB can show on `md+` too (host already global); keep clear of desktop chrome with same clamps |
| Header / feed cards | Out of scope — leave `VoiceCallHeaderButton` / `VoiceAssistantCard` unless they break; do not spend time removing them |

---

## 3. Current code map (read first)

- Host: `src/modules/voice-agent/components/VoiceCallHost.tsx` (mounted from `src/pages/_app.tsx`)
- Overlay / pill: `src/modules/voice-agent/components/CallOverlay.tsx`
- Nav button: `src/modules/voice-agent/components/VoiceBottomNavButton.tsx`
- Nav wiring: `src/common/components/layouts/bottomNavigation/bottomNavigation.tsx` (doctor + flag → center Aura slot)
- UI store: `src/modules/voice-agent/store/voiceCallUi.ts` (`active`, `expanded`, `openCall`, `minimizeCall`, …)
- Aura: `src/modules/voice-agent/agents-ui/agent-audio-visualizer-aura.tsx` (+ `volume` prop for WS)
- Session status: `src/modules/voice-agent/transport/wsVoiceSession.ts` (`WsVoiceStatus`, `onStatus`, `onAgentVolume`)

---

## 4. Implementation plan (do in order)

### 4.1 Bottom nav

In `bottomNavigation.tsx`:

- Remove the special `isDoctorShell && isArashVoiceEnabled` mid-slot that renders `VoiceBottomNavButton`.
- Doctor nav must fall back to the normal equal `navItems` row (same as non-Arash).
- Remove unused Arash imports if nothing else needs them.

### 4.2 New FAB component

Create `src/modules/voice-agent/components/ArashFloatingAuraButton.tsx`:

- Gate: feature + login + doctor (same as host / old nav button).
- Read `useVoiceCallUiStore`: `active`, `expanded`, `ending`, `openCall`, `expandCall`.
- Hide when `!visibleGate` OR `expanded` OR `ending`.
- Render fixed `z-index` above content but below call drawer (`z-[100]`/`z-[101]` drawer today → FAB e.g. `z-[90]` or `z-[95]` so sheet covers it when open).
- Aura:
  - Idle / no session: `listening` (vivid affordance).
  - Active: map real status from parent (see 4.3) → Aura `connecting|listening|thinking|speaking`.
  - Pass `volume` when speaking.
- Pointer:
  - `pointerdown` start; after ~180ms hold OR movement past threshold → drag mode.
  - On drag: update `right`/`bottom` from pointer, clamp to viewport − FAB size − safe area − leave ≥8px gap above bottom nav (`h-16` + safe-area).
  - `pointerup`: if not dragged → `active ? expandCall() : openCall()`.
  - `aria-label`: «تماس با آرش» / when active «باز کردن تماس آرش».
- Persist position on drag end to `localStorage`; load on mount; invalidate if off-screen after resize.

### 4.3 Wire status into FAB

`CallOverlay` already owns `WsVoiceSession` status/volume. Options (pick simplest that works):

- **Preferred:** lift status + agentVolume into `useVoiceCallUiStore` (or a tiny `voiceCallSessionStore`) updated from session callbacks; FAB subscribes.
- Or pass via React context from a thin wrapper in `VoiceCallHost`.

Do not mount a second WebSocket for the FAB.

### 4.4 CallOverlay

- Delete `MinimizedCallPill` component and the `sheetOpen ? Drawer : Pill` branch — when `!expanded && !ending && active`, render **nothing** for chrome (FAB handles it).
- Keep `minimizeCall()` on sheet dismiss (`onOpenChange` → false) exactly as today semantically (`expanded: false`).
- Keep hangup / ending flow.
- Do not reintroduce floating page overlays for minimize.

### 4.5 VoiceCallHost

```tsx
return (
  <>
    <ArashFloatingAuraButton />
    <CallOverlay />
  </>
);
```

(Gate can stay on host or on each child; avoid double-null flicker.)

### 4.6 Exports

Update `src/modules/voice-agent/index.ts` as needed. `VoiceBottomNavButton` may remain exported but unused, or delete if nothing imports it — prefer delete dead nav usage; file can stay only if still imported elsewhere (grep first).

### 4.7 Store comments

Update comments in `voiceCallUi.ts`: `expanded: false` means “sheet closed; FAB is the minimized affordance,” not “pill.”

---

## 5. Acceptance checklist (agent must verify)

- [ ] Doctor + feature on: FAB visible on multiple routes without remounting a second session.
- [ ] Feature off / patient: no FAB, no nav Aura slot.
- [ ] Bottom nav has no center Arash control; layout balanced.
- [ ] Tap FAB idle → call starts, sheet opens, FAB hides.
- [ ] Dismiss sheet → call stays active, FAB returns with correct Aura state (listening/thinking/speaking).
- [ ] No `MinimizedCallPill` in the tree.
- [ ] Hold+drag moves FAB; reload/navigation keeps position.
- [ ] Tap after drag does not open sheet.
- [ ] FAB never sits under bottom nav or off-screen.
- [ ] When sheet open, FAB not visible and not stealing taps.
- [ ] No new hooks-after-return bugs; no lint errors on touched files.

---

## 6. Done definition

Mission complete when acceptance items above are satisfied and a brief English commit-ready summary of files touched is written in the agent’s final message. **Do not create a git commit unless the human later asks.**

---

## 7. Anti-patterns (from prior regressions — do not repeat)

- Do not put the FAB inside the call sheet.
- Do not auto-minimize by inventing a second UI surface.
- Do not ask “should FAB hide when sheet is open?” — already decided: hide.
- Do not use fake Aura `active ? 'speaking' : 'listening'` once a live session exists.
- Do not expand scope to WS server / show_ui redesign.
