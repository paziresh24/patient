import type { DoctorPresenceState } from '@/modules/search/hooks/useDoctorPresence';

/**
 * منطقِ نشستنِ «حضورِ پزشک» روی کارتِ Plasmic — پورتِ بومیِ اسکریپتِ تزریقیِ قدیمی
 * (`hami.paziresh24.com/scripts/search-cards-presence.js`).
 *
 * چرا هنوز DOM را دست می‌زنیم: مارکاپِ کارت در `PlasmicProductCard` **تولیدشده** است و با هر
 * sync دوباره ساخته می‌شود؛ اگر متن را آن‌جا declarative رندر کنیم، اولین `plasmic-sync` پاکش
 * می‌کند. پس همان‌جا که کارت رندر شده، از داخلِ کامپوننتِ خودمان و **محدود به ریشه‌ی همان کارت**
 * اعمالش می‌کنیم — بدونِ `MutationObserver`ِ سراسری و بدونِ اسکنِ کلِ صفحه، برخلافِ اسکریپتِ قبلی.
 */

const LAST_SEEN_APPLIED = 'qcLastSeenApplied';
const LAST_SEEN_HIDDEN = 'qcLastSeenHidden';
const ONLINE_APPLIED = 'quickChatOnlineApplied';

/** متنِ `top_title`ی که این بج جایش می‌نشیند با «پاسخ» شروع می‌شود. */
const TOP_TITLE_NEEDLE = 'پاسخ';
const MESSENGER_ONLINE_TEXT = 'آنلاین در پیام رسان';

export function escapeHtml(text: string): string {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * بخشِ زمانیِ متن bold می‌شود و بقیه ساده می‌ماند — دقیقاً همان قالبی که کاربر امروز می‌بیند:
 * «**۳۷ دقیقه پیش** آنلاین بوده»، «**دیروز** ساعت …»، «**آنلاین در پیام رسان**».
 */
export function formatLastSeenHtml(lastSeen: string): string {
  const raw = String(lastSeen);

  if (raw.replace(/\s+/g, ' ').trim() === MESSENGER_ONLINE_TEXT) {
    return `<b>${escapeHtml(MESSENGER_ONLINE_TEXT)}</b>`;
  }

  const yesterday = 'دیروز';
  const yesterdayIndex = raw.indexOf(yesterday);
  if (yesterdayIndex !== -1) {
    const before = raw.slice(0, yesterdayIndex);
    const after = raw.slice(yesterdayIndex + yesterday.length);
    return `${escapeHtml(before)}<b>${escapeHtml(yesterday)}</b>${escapeHtml(after)}`;
  }

  const ago = 'پیش';
  const agoIndex = raw.indexOf(ago);
  if (agoIndex === -1) return escapeHtml(raw);

  return `<b>${escapeHtml(raw.slice(0, agoIndex + ago.length))}</b>${escapeHtml(raw.slice(agoIndex + ago.length))}`;
}

export function buildLastSeenBadgeHtml(lastSeen: string): string {
  return `<span dir="rtl">${formatLastSeenHtml(lastSeen)}</span>`;
}

/** گرهِ `top_title` که متنِ «پاسخ: …» را نگه می‌دارد — یا همان گرهی که قبلاً خودمان نوشته‌ایم. */
export function findLastSeenNode(card: HTMLElement): HTMLElement | null {
  const nodes = card.querySelectorAll<HTMLElement>("[class*='wab_expr_html_text']");

  for (const node of Array.from(nodes)) {
    const applied = node.dataset[LAST_SEEN_APPLIED];
    const hidden = node.dataset[LAST_SEEN_HIDDEN] === '1';
    const carriesTopTitle = (node.textContent || '').includes(TOP_TITLE_NEEDLE);

    if (carriesTopTitle || (applied != null && applied !== '') || hidden) return node;
  }

  return null;
}

function hideLastSeen(node: HTMLElement) {
  if (node.dataset[LAST_SEEN_HIDDEN] === '1') return;

  node.dataset[LAST_SEEN_HIDDEN] = '1';
  node.dataset[LAST_SEEN_APPLIED] = '';
  node.innerHTML = '';
  node.style.display = 'none';
}

function showLastSeen(node: HTMLElement, lastSeen: string) {
  if (node.dataset[LAST_SEEN_APPLIED] === lastSeen) return;

  node.dataset[LAST_SEEN_HIDDEN] = '';
  node.style.display = '';
  node.dataset[LAST_SEEN_APPLIED] = lastSeen;
  node.innerHTML = buildLastSeenBadgeHtml(lastSeen);
}

/** تیکِ آبیِ تأیید جای خود را به نقطه‌ی سبزِ «آنلاین در پیام‌رسان» می‌دهد. */
function applyOnlineIndicator(card: HTMLElement) {
  const badge = card.querySelector<SVGElement>("svg[class*='svgbadge_check']");
  if (!badge) return;
  if ((badge as unknown as HTMLElement).dataset[ONLINE_APPLIED]) return;

  (badge as unknown as HTMLElement).dataset[ONLINE_APPLIED] = '1';
  badge.innerHTML =
    '<circle cx="12.75" cy="12.75" r="7.2" fill="#22c55e"></circle>' +
    '<circle cx="12.75" cy="12.75" r="7.2" fill="none" stroke="#ffffff" stroke-width="1.8"></circle>';
}

/**
 * تا وقتی جوابِ سرور نرسیده (`resolved === false`) هیچ چیزی عوض نمی‌شود — نه متن پاک می‌شود نه
 * جایگزین. پزشکی که جوابش آمده و سابقه‌ای ندارد، آن خط را اصلاً نمی‌بیند (مثلِ امروز).
 */
export function applyDoctorPresence(card: HTMLElement | null, state: DoctorPresenceState, slug?: string | null): void {
  if (!card) return;

  // قراردادِ پایدارِ DOM برای مصرف‌کننده‌های بیرونی — تا کسی مجبور نباشد به نامِ کلاسِ
  // تولیدشده‌ی Plasmic قلاب شود، همان اشتباهی که اسکریپتِ قبلی کرد.
  if (slug && card.dataset.doctorSlug !== slug) card.dataset.doctorSlug = slug;

  if (!state.resolved) return;

  const { presence } = state;

  if (presence?.online) applyOnlineIndicator(card);

  const node = findLastSeenNode(card);
  if (!node) return;

  const lastSeen = typeof presence?.last_seen === 'string' ? presence.last_seen.trim() : '';

  if (lastSeen) {
    showLastSeen(node, lastSeen);
  } else if (!presence?.online) {
    hideLastSeen(node);
  }
}
