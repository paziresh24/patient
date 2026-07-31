# Mission: Arash FAB — no first-paint position jump (CDN/SSR-safe)

**Audience:** coding agent only  
**Human:** do not ask, do not wait, do not offer alternatives  
**Repo:** `apps/patient` (own git root)  
**Date:** 2026-07-30  
**Spec ID:** `arash-fab-no-jump`

---

## 0. Operating rules

1. Execute end-to-end without asking the human.
2. Touch only what this mission needs — primarily `ArashFloatingAuraButton.tsx`.
3. Do not redesign FAB, Aura, call sheet, bottom nav, or voice WS.
4. Do not create a git commit unless the human later asks.
5. When Done: one short English summary. No “should we…”.

---

## 1. Goal

FAB must not flash at the **default** corner and then jump to the **saved** `localStorage` position. First **visible** frame = final clamped position. Must stay safe with **CDN-cached / SSR HTML** (no hydration mismatch from user-specific coordinates).

---

## 2. Problem (current)

```ts
useState(() => defaultPos());
useEffect(() => { setPos(loadPos()); }, []);
```

→ paint default → effect → paint saved = visible jump.

CDN serves shared HTML; `localStorage` is per-browser. Putting user position into SSR HTML or hydrating different `right`/`bottom` than HTML causes mismatch or jump.

---

## 3. Locked decisions

| Topic | Decision |
|--------|----------|
| Strategy | **Defer paint** until client has resolved position |
| While unresolved | `return null` (do not show FAB) |
| Resolve with | `useLayoutEffect` → `setPos(clampPos(loadPos())); setPositioned(true)` |
| Storage | Keep key `arash.fab.position`, shape `{ right, bottom }` |
| Clamp / drag / resize | Unchanged |
| Rejected | Sole fix of `useState(() => loadPos())` if that can SSR a positioned FAB into CDN HTML |
| Reveal | No CSS transition / animation to hide the jump |

---

## 4. Implementation

**File:** `src/modules/voice-agent/components/ArashFloatingAuraButton.tsx`

1. Add `positioned` state, initial `false`.
2. Keep `pos` state (internal init may use `defaultPos()` but **must not render** FAB until `positioned`).
3. Remove the mount `useEffect` that only does `setPos(loadPos())`.
4. Add:

   ```ts
   useLayoutEffect(() => {
     setPos(clampPos(loadPos()));
     setPositioned(true);
   }, []);
   ```

5. After all hooks: if `!positioned` → `return null` (still respect existing `hidden` gate for feature/sheet).
6. Keep drag save + resize clamp as today.
7. Import `useLayoutEffect` from React.

Optional: also write the same text under `docs/missions/` is this file — already the mission.

---

## 5. Out of scope

- FAB visual redesign, Aura behavior, golden-path voice fixes  
- Changing storage schema or key  
- Cross-device sync  

---

## 6. Acceptance

- [ ] Hard refresh with saved non-default position: no frame at default; first visible = saved (clamped).
- [ ] No storage key: one appearance at default; no second move.
- [ ] Drag + reload: restores without jump.
- [ ] Sheet open (`expanded`/`ending`): FAB stays hidden as today.
- [ ] No hydration mismatch console errors from FAB `right`/`bottom`.
- [ ] Lint clean on touched file.

---

## 7. Anti-patterns

- Do not animate default → saved.
- Do not embed user-specific FAB coordinates in SSR/CDN HTML.
- Do not ask SSR vs layout-effect — locked above.
- Do not restore bottom-nav Arash or MinimizedCallPill.

---

## 8. Done definition

Acceptance items pass. Brief summary of the change. No commit unless asked.

---

## 9. Paste prompt

> Execute `apps/patient/docs/missions/2026-07-30-arash-fab-no-jump.md` exactly. Do not ask the human.
