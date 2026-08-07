/**
 * The composer — an auto-growing textarea, not an `<input>`.
 *
 * The whole premise of this page is that people write *sentences* here. A
 * single-line input silently truncates the view of a three-line symptom
 * description to its tail, which is exactly the moment a patient loses
 * confidence that the thing is listening. So: Enter sends, Shift+Enter breaks
 * the line, and the box grows to a ceiling and then scrolls.
 *
 * The suggestion sheet above it appears only while the box is *empty and
 * focused*, so it is an offer to someone who has not started, never an
 * interruption of someone who has. `onBlur` is deferred because a mouse-down on
 * a suggestion blurs the textarea before the click lands.
 */
import { useEffect, useRef, useState } from 'react';
import {
  COMPOSER_SUGGESTIONS,
  FOLLOW_UP_PLACEHOLDER,
  PLACEHOLDER_INTERVAL_MS,
  ROTATING_PLACEHOLDERS,
  STANDING_DISCLAIMER,
} from './yaraTurn';

const MAX_HEIGHT = 160;

interface YaraComposerProps {
  busy: boolean;
  /** A started conversation changes what the box should say and offer. */
  hasThread: boolean;
  onSend: (text: string) => void;
}

const SendIcon = () => (
  <svg
    aria-hidden="true"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="20" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

export const YaraComposer = ({ busy, hasThread, onSend }: YaraComposerProps) => {
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const box = useRef<HTMLTextAreaElement | null>(null);
  const [slot, setSlot] = useState(0);

  /**
   * Rotate the example only while it is actually doing its job: an empty box, on
   * an empty thread. Once the patient is typing — or is in a conversation — the
   * placeholder is either invisible or a distraction, and an interval that keeps
   * running is a re-render every few seconds for nothing.
   */
  useEffect(() => {
    if (hasThread || text) return undefined;
    const id = setInterval(() => setSlot(n => (n + 1) % ROTATING_PLACEHOLDERS.length), PLACEHOLDER_INTERVAL_MS);
    return () => clearInterval(id);
  }, [hasThread, text]);

  // Re-measure on every value change, including the reset to '' after a send —
  // otherwise a grown box stays tall over an empty placeholder.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }, [text]);

  const submit = () => {
    const value = text.trim();
    if (!value || busy) return;
    setText('');
    setFocused(false);
    onSend(value);
  };

  const canSend = Boolean(text.trim()) && !busy;
  const placeholder = hasThread ? FOLLOW_UP_PLACEHOLDER : ROTATING_PLACEHOLDERS[slot];
  // ⛔ The example sheet is for someone who has not started. Mid-conversation the
  // *relevant* next steps are the assistant's own suggestion chips, and a list of
  // unrelated openers next to them invites abandoning the thread.
  const showSheet = focused && !text.trim() && !hasThread;

  return (
    <div className="border-0 border-t border-solid border-[#e6e8ec] bg-white px-4 pb-3 pt-4">
      <div className="relative mx-auto w-full max-w-[47.5rem]">
        {showSheet && (
          <div
            data-testid="yara-suggest-sheet"
            className="absolute bottom-[calc(100%+0.625rem)] z-20 w-full overflow-hidden rounded-[0.875rem] border border-solid border-[#e6e8ec] bg-white shadow-[0_0.75rem_2rem_rgba(16,24,40,.12)]"
          >
            <div className="px-3.5 pb-1.5 pt-2.5 text-[0.6875rem] font-bold text-[#98a2b3]">
              نمونه‌هایی که می‌توانید بپرسید
            </div>
            {COMPOSER_SUGGESTIONS.map(label => (
              <button
                key={label}
                type="button"
                data-testid="yara-suggest-item"
                // mouse-down, not click: the textarea blurs first and the sheet
                // would be gone before a click could reach it.
                onMouseDown={e => {
                  e.preventDefault();
                  setFocused(false);
                  onSend(label);
                }}
                className="flex w-full items-center gap-2.5 border-0 border-t border-solid border-[#f2f3f5] px-3.5 py-2.5 text-right text-xs text-[#344054] transition-colors hover:bg-[#f7f8fa]"
              >
                <span className="min-w-0 flex-1 truncate">{label}</span>
              </button>
            ))}
          </div>
        )}

        <form
          className="flex items-end gap-2 rounded-[0.875rem] border border-solid border-[#d0d5dd] bg-white px-3 py-2 transition-colors focus-within:border-primary"
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <button
            type="submit"
            aria-label="ارسال"
            title="ارسال"
            disabled={!canSend}
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-[0.625rem] transition-colors ${
              canSend ? 'bg-primary text-white hover:bg-[#2a4fd6]' : 'bg-[#f2f3f5] text-[#98a2b3]'
            }`}
          >
            <SendIcon />
          </button>
          <textarea
            ref={box}
            rows={2}
            className="max-h-40 min-h-[3.5rem] min-w-0 flex-1 resize-none bg-transparent py-2 text-sm leading-7 text-[#101828] outline-none transition-[height] placeholder:text-[#98a2b3]"
            placeholder={placeholder}
            // ⚠️ No `key` here. Keying the textarea by the rotating slot swaps the
            // DOM node, which drops focus mid-typing and — caught by the
            // Enter/Shift+Enter test — leaves callers holding a detached element.
            // The placeholder is a plain attribute; changing it is enough.
            aria-label="پیام شما به یارا"
            value={text}
            maxLength={600}
            disabled={busy}
            onChange={e => setText(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 120)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
          />
        </form>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[0.6875rem] leading-5 text-[#98a2b3]">
          <span>{STANDING_DISCLAIMER}</span>
          <span>نسخهٔ بتا — فعلاً رایگان · Shift + Enter برای خط جدید</span>
        </div>
      </div>
    </div>
  );
};

export default YaraComposer;
