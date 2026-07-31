# Mission: Arash Voice v0 — Make the golden path boring

**Audience:** coding agent only  
**Human:** do not ask, do not wait, do not offer feature alternatives  
**Date:** 2026-07-30  
**Repos:** `apps/patient` + `labs/voice-agent/ws-server` (separate git roots — never commit across them)

---

## 0. Operating rules (mandatory)

1. Execute end-to-end without asking the human.
2. **v0 freeze:** prefer fixing golden-path failures over any new feature or chrome polish.
3. For unspecified basic UX, apply global mobile defaults silently. Do not surface those choices.
4. **No silent UX pivots** (do not move show_ui, reinvent FAB, restore bottom-nav Arash, restore MinimizedCallPill).
5. One failure class per change set when possible.
6. Do **not** create a git commit unless the human later asks.
7. If blocked by env/sandbox, state the exact command to run and stop — do not invent workarounds that change product scope.
8. When Done: short English summary of what was fixed vs deferred. No “should we…”.

---

## 1. Goal (one sentence)

Make the doctor’s Arash call **reliably hear → think → speak → barge-in → minimize via FAB → hang up**, three times in a row — not prettier.

---

## 2. Product freeze (locked)

| Topic | Locked decision |
|--------|------------------|
| Transport | WebSocket PCM (`labs/voice-agent/ws-server`), not LiveKit |
| Entry | Global draggable Aura FAB (`ArashFloatingAuraButton`); sheet open/`ending` → FAB hidden |
| Minimized chrome | FAB only — **no** bottom pill, **no** Arash slot in bottom nav |
| Hang up | Only from sheet controls |
| Status chrome | Aura must mirror real `WsVoiceStatus` (+ volume when speaking) — **no** fake `active ? speaking : listening` once session exists |
| show_ui | Do **not** redesign placement/architecture in this mission unless it breaks the golden path |
| Scope bans | No new tools, no page_agent migration, no TTS/voice/personality rewrites, no LiveKit, no FAB redesign |

---

## 3. Golden path (sole primary acceptance)

Run as a **doctor** with feature `arash_voice_agent` on, local patient HTTPS + voice `npm start` on `:3001`.

1. Open Arash (FAB tap) → sheet opens → connecting → greeting TTS plays.  
2. Ask (voice): roughly «نوبت‌های امروز چندتاست؟» (or equivalent appointment intent).  
3. Hear a short correct Persian answer grounded in panel/bootstrap data (not hallucinated count).  
4. On a later long reply, **barge-in** (speak over agent) → playback stops → agent stops talking over you.  
5. Dismiss sheet (swipe/dismiss) → call stays active → FAB returns with **correct** Aura state.  
6. Tap FAB → sheet reopens.  
7. Hang up → ending UI → teardown → FAB idle again.  
8. Repeat full path **3 consecutive successes**.

If any step flakes, mission is **not Done** — fix that failure class, re-run 3/3.

---

## 4. Reliability bar (tests the agent must perform)

### 4.1 Environment (before claiming anything)

- Voice: `cd labs/voice-agent/ws-server && npm start` (not `npm run dev` / file-watch — watch kills mid-call).  
- Patient: existing local HTTPS setup (`apps/patient`) with `/api/voice/*` proxy to `:3001`.  
- Confirm voice health if available: `GET http://127.0.0.1:3001/health`.  
- Do not claim Done if voice is down or sandbox prevents start — report exact command.

### 4.2 Automated / smoke (run if present; do not invent a huge suite)

- In `labs/voice-agent/ws-server`: `node scripts/m1-smoke.js` (must pass; includes utterance confidence / mean gate regressions).  
- Patient: lint diagnostics on touched files (`ReadLints` or project lint if quick).

### 4.3 Manual golden-path checklist (agent verifies, ticks mentally)

- [ ] 3/3 golden path  
- [ ] Barge-in on long TTS  
- [ ] No «متوجه نشدم» / repeat apology when transcript on screen is clearly good (low_confidence false reject)  
- [ ] Empty/duplicate endpoints stay **silent** (no apology TTS on empty buffer)  
- [ ] FAB hidden while sheet open; visible when minimized; no pill  
- [ ] Bottom nav has no Arash center control  
- [ ] Second call after hangup starts clean (no stuck `agentSpeaking` / zombie session)  
- [ ] No React “Rendered more hooks than during the previous render”  

### 4.4 Log signals (when debugging)

Voice server logs under session: `utterance_rejected`, `outbound llm_response`, `barge_in`, `userBargeIn`, `agentSpeaking`, `show_ui` / `hide_ui`.  
Prefer evidence from logs over guessing.

---

## 5. Known anti-patterns (do not repeat)

These caused prior thrash — treat as hard bans unless fixing a golden-path bug **requires** a minimal change:

1. **Silent UX pivot** — e.g. moving show_ui into/out of sheet because it “felt گیج” without a locked decision.  
2. **Fake Aura status** — `active ? 'speaking' : 'listening'` while a live session exists.  
3. **Second minimized chrome** — restoring `MinimizedCallPill` or nav Aura beside FAB.  
4. **Confidence gate on `Math.min` token confidence** — rejects good Persian transcripts; mean (or equivalent) is the intended gate.  
5. **Server `BARGE_IN_THRESHOLD` near 0.6** — impossible for real mic RMS; keep human-speech scale (~0.05 class).  
6. **`npm run dev` watch on voice mid-call** — restarts kill sessions; use `npm start`.  
7. **Hooks after early `return`** in `CallOverlay` / hosts — crashes when status flags added.  
8. **Apologizing on empty duplicate endpoints** — causes «متوجه نشدم» loops with echo.  
9. **Expanding scope mid-fix** (“while here, add hide_ui polish / new tool / prompt rewrite”).  
10. **Asking the human basic UX questions** already decided in freeze table or global standards.

---

## 6. Implementation guidance (only if golden path fails)

Work **smallest fix first**. Suggested order when diagnosing:

1. **Env / process** — is voice actually up? watch restarting?  
2. **STT → endpoint → LLM** — `utterance_rejected`? empty buffer?  
3. **Barge-in** — client sends `barge_in_confirmed`? TTS cancel? audio ungated after interrupt?  
4. **Status plumbing** — `CallOverlay` → `voiceCallUi.sessionStatus` / `agentVolume` → FAB  
5. **Chrome only if it blocks the path** — FAB tap targets, sheet dismiss, hooks order  

Do **not** touch WS protocol shape, tool registry growth, or FAB visual redesign unless required.

### Key paths (read before edit)

- Patient FAB / host / overlay:  
  `apps/patient/src/modules/voice-agent/components/ArashFloatingAuraButton.tsx`  
  `VoiceCallHost.tsx`  
  `CallOverlay.tsx`  
  `store/voiceCallUi.ts`  
  `transport/wsVoiceSession.ts`  
- Voice server:  
  `labs/voice-agent/ws-server/voice-agent/{session,robustness,config}.js`  
  `processors/{llm,tts,vad,stt}.js`  
- Prior FAB mission (chrome already done — do not redo):  
  `apps/patient/docs/missions/2026-07-30-arash-floating-aura-fab.md`

---

## 7. Out of scope / parking lot (v1 — do not start)

- show_ui layout polish / voice→card matching iteration  
- Removing header/feed Arash entry points  
- New panel write tools  
- Model/prompt personality passes  
- Desktop-only polish  

---

## 8. Definition of Done

Mission complete **only if**:

1. Golden path **3/3** on local doctor account, and  
2. Barge-in verified once on a long reply, and  
3. Ban list / anti-patterns not violated in the same session, and  
4. Smoke `m1-smoke.js` passes if voice-server code changed, and  
5. Final message: what failed → what you fixed → what remains deferred to v1.

If golden path already passes 3/3 with no code changes: say so, list evidence (what you ran), and stop. Do not invent polish.

---

## 9. Paste prompt for Genius / Agent

> Execute `apps/patient/docs/missions/2026-07-30-arash-voice-v0-golden-path.md` exactly. Do not ask the human. Freeze scope. Make the golden path pass 3/3 or report the exact blocker.
