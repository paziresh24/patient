/**
 * Keeping a conversation alive across navigation.
 *
 * owner (2026-08-07), two separate complaints with one cause:
 *
 *  - «وقتی بین صفحات یارا جابجا می‌شیم و بعد بک مرورگر رو می‌زنیم نباید یه‌باره از
 *    یارا خارج بشه» — switching conversations changed nothing in the URL, so the
 *    browser's back stack had no Yara steps to go back *through*; the first back
 *    left the page.
 *  - «روی دکتری که پیشنهاد شده کلیک می‌کنم و بعد بک می‌زنم، کلا به هوم یارا
 *    برمی‌گرده» — a doctor profile is a full navigation out of the SPA, so Yara
 *    re-mounted with an empty thread. Nothing was wrong with the back button;
 *    there was simply nothing to come back *to*.
 *
 * The URL fixes the first (`/yara?c=<id>` is a real history entry). This module
 * fixes the second: a snapshot in `sessionStorage`, restored on mount.
 *
 * ### Why sessionStorage and not localStorage
 *
 * A thread is per-tab and per-session. `localStorage` would resurrect a
 * stranger's conversation on a shared device days later — on a page where the
 * content is symptoms, that is not a caching decision.
 *
 * Everything here is defensive: a corrupt or foreign snapshot must degrade to
 * "start fresh", never to a thrown error on mount.
 */
import type { YaraTurn } from './yaraTurn';

const KEY = 'yara:thread';
/** Enough for a long consultation; short enough to stay far under the quota. */
const MAX_TURNS = 40;

export interface YaraSnapshot {
  conversationId: string;
  turns: YaraTurn[];
  scrollTop: number;
  /** Epoch ms. A snapshot older than the session is still this tab's, but stale. */
  savedAt: number;
}

/** Ninety minutes: longer than any visit to a doctor profile, shorter than "later today". */
export const SNAPSHOT_TTL_MS = 90 * 60 * 1000;

export function readSnapshot(now = Date.now()): YaraSnapshot | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<YaraSnapshot>;
    if (!Array.isArray(parsed?.turns) || parsed.turns.length === 0) return null;
    if (typeof parsed.savedAt !== 'number' || now - parsed.savedAt > SNAPSHOT_TTL_MS) return null;
    return {
      conversationId: String(parsed.conversationId ?? ''),
      turns: parsed.turns as YaraTurn[],
      scrollTop: Number(parsed.scrollTop) || 0,
      savedAt: parsed.savedAt,
    };
  } catch {
    return null;
  }
}

export function writeSnapshot(snapshot: Omit<YaraSnapshot, 'savedAt'>, now = Date.now()): void {
  try {
    if (!snapshot.turns.length) {
      window.sessionStorage.removeItem(KEY);
      return;
    }
    window.sessionStorage.setItem(
      KEY,
      JSON.stringify({
        ...snapshot,
        // Oldest turns are the cheapest to lose: the patient came back for the
        // answer they were just reading, not for the opening greeting.
        turns: snapshot.turns.slice(-MAX_TURNS),
        savedAt: now,
      })
    );
  } catch {
    /* quota or a privacy mode that refuses storage — losing the snapshot is fine */
  }
}

export function clearSnapshot(): void {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Should this snapshot be restored for the conversation the URL asks for?
 *
 * A mismatch means the patient arrived at a *different* conversation (a shared
 * link, or the rail on another tab), and showing them the thread they happen to
 * have in this tab would be worse than showing them nothing.
 */
export function snapshotMatches(snapshot: YaraSnapshot | null, urlConversationId: string): boolean {
  if (!snapshot) return false;
  if (!urlConversationId) return true;
  return snapshot.conversationId === urlConversationId;
}
