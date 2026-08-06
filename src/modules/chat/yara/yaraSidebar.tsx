/**
 * The conversation rail — «گفت‌وگوی جدید» + search + dated history.
 *
 * It replaces the drawer that used to open *inside* the thread. The drawer was
 * an in-search-box habit: there, the panel was a guest on someone else's page,
 * so history had to fold away. `/yara` is the page, and on a page you are going
 * to come back to, the way in and out of a conversation belongs beside the
 * conversation, not on top of it.
 *
 * Two things it deliberately does not do:
 *
 *  - it never fetches on open/close, only on mount, so toggling the rail on a
 *    phone is free;
 *  - the filter is client-side over the titles already loaded. A server-side
 *    conversation search would send a patient's own words back out over the
 *    wire to match them, and the rail is not worth that.
 */
import { useEffect, useMemo, useState } from 'react';
import { listConversations, type ConversationSummary } from '../chatApi';
import { groupConversations } from './yaraTurn';

interface YaraSidebarProps {
  activeId: string;
  /** Reload trigger: bump it after a turn so a brand-new conversation appears. */
  refreshKey: number;
  statusDot: React.ReactNode;
  onPick: (id: string) => void;
  onNewChat: () => void;
}

const SearchIcon = () => (
  <svg
    aria-hidden="true"
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    className="shrink-0"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

export const YaraSidebar = ({ activeId, refreshKey, statusDot, onPick, onNewChat }: YaraSidebarProps) => {
  const [items, setItems] = useState<ConversationSummary[] | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    let alive = true;
    void listConversations().then(rows => {
      if (alive) setItems(rows);
    });
    return () => {
      alive = false;
    };
  }, [refreshKey]);

  const groups = useMemo(() => {
    const needle = filter.trim();
    const rows = (items ?? []).filter(c => !needle || String(c.title ?? '').includes(needle));
    return groupConversations(rows);
  }, [items, filter]);

  return (
    <aside
      data-testid="yara-sidebar"
      className="flex h-full min-h-0 flex-col overflow-hidden border-0 border-e border-solid border-[#e6e8ec] bg-white"
    >
      <div className="flex flex-col gap-3 p-4">
        <button
          type="button"
          onClick={onNewChat}
          className="flex h-[2.625rem] w-full items-center justify-center gap-2 rounded-[0.625rem] bg-primary text-sm font-bold text-white transition-colors hover:bg-[#2a4fd6]"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            +
          </span>
          گفت‌وگوی جدید
        </button>
        <div className="flex h-[2.375rem] items-center gap-2 rounded-[0.5625rem] bg-[#f2f3f5] px-3 text-[#98a2b3]">
          <SearchIcon />
          <input
            className="min-w-0 flex-1 bg-transparent text-xs text-[#101828] outline-none placeholder:text-[#98a2b3]"
            placeholder="جست‌وجو در گفت‌وگوها"
            aria-label="جست‌وجو در گفت‌وگوها"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
        {items === null && <p className="px-3 text-xs text-[#98a2b3]">در حال بارگذاری…</p>}
        {items !== null && groups.length === 0 && (
          <p className="px-3 text-xs leading-6 text-[#667085]">
            {filter.trim() ? 'گفت‌وگویی با این عنوان پیدا نشد.' : 'هنوز گفت‌وگوی ذخیره‌شده‌ای ندارید.'}
          </p>
        )}
        {groups.map(group => (
          <div key={group.label}>
            <div className="px-[0.625rem] pb-1.5 pt-3.5 text-[0.6875rem] font-bold text-[#98a2b3]">{group.label}</div>
            {group.items.map(c => {
              const on = c.conversation_id === activeId;
              return (
                <button
                  key={c.conversation_id}
                  type="button"
                  data-testid="yara-conversation"
                  aria-current={on ? 'true' : undefined}
                  onClick={() => onPick(c.conversation_id)}
                  className={`mb-0.5 w-full rounded-[0.5625rem] px-3 py-2.5 text-right transition-colors ${
                    on ? 'bg-primary/10 shadow-[inset_0_0_0_1px_#d6e0ff]' : 'hover:bg-[#f7f8fa]'
                  }`}
                >
                  <span className="block truncate text-xs font-medium text-[#101828]">{c.title || 'بدون عنوان'}</span>
                  <span className="mt-0.5 block truncate text-[0.6875rem] text-[#98a2b3]">
                    {c.turn_count} پیام · {new Date(c.last_message_at).toLocaleDateString('fa-IR')}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-0 border-t border-solid border-[#e6e8ec] px-4 py-3 text-xs text-[#667085]">
        {statusDot}
      </div>
    </aside>
  );
};

export default YaraSidebar;
