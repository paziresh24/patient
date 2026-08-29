import { useEffect, useState } from 'react';

/**
 * وضعیتِ حضورِ پزشک برای کارتِ نتیجه‌ی جستجو: نقطه‌ی سبزِ «آنلاین در پیام‌رسان» و متنِ
 * «X پیش آنلاین بوده» که جای `top_title`ِ «پاسخ: …» می‌نشیند.
 *
 * چرا این فایل وجود دارد: تا امروز این رفتار در کدِ این repo نبود — یک اسکریپتِ خارجی
 * (`hami.paziresh24.com/scripts/search-cards-presence.js`) از طریقِ فلگِ
 * `search:external-scripts-config` تزریق می‌شد و روی DOMِ کارتِ Plasmic می‌نشست. آن مسیر سه
 * مشکل داشت: به نامِ کلاسِ **تولیدشده‌ی** Plasmic قلاب بود (با هر تغییرِ کارت بی‌صدا می‌شکست)،
 * برای CI نامرئی بود، و رفتارش نسخه‌بندی نمی‌شد. حالا رفتار بومی است و همین‌جا نگهداری می‌شود.
 *
 * ⚠️ الگویِ درخواست عمداً **batch** است، نه per-card: ۲۰ کارت × یک fetchِ مستقل خودش یکی از
 * منابعِ TBTِ صفحه‌ی لیستینگ است. هر کارت فقط slugش را ثبت می‌کند و همه‌ی slugهای یک پنجره در
 * **یک POST** می‌روند — همان قراردادی که امروز روی production دیده می‌شود.
 */

const PRESENCE_ENDPOINT = 'https://support-n8n.paziresh24.com/webhook/doctor-search-cards';

/** همان پنجره‌ای که اسکریپتِ قبلی داشت؛ عمداً تغییر نکرد تا الگویِ ترافیک عوض نشود. */
const BATCH_WINDOW_MS = 300;

export interface DoctorPresence {
  slug: string;
  online?: boolean;
  /** متنِ آماده‌ی فارسی از سرور، مثلِ «۳۷ دقیقه پیش آنلاین بوده». پزشکِ بدونِ سابقه null است. */
  last_seen?: string | null;
}

const cache = new Map<string, DoctorPresence | null>();
const waiting = new Map<string, Array<(value: DoctorPresence | null) => void>>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;

/** `/dr/foo/` و `foo` و مقدارِ encode‌شده همه به یک کلید می‌رسند. */
export function normalizeSlug(slug?: string | null): string | null {
  if (!slug) return null;

  const cleaned = String(slug)
    .trim()
    .replace(/^\/dr\//, '')
    .replace(/\/$/, '');

  if (!cleaned) return null;

  try {
    return decodeURIComponent(cleaned);
  } catch {
    return cleaned;
  }
}

async function flush() {
  flushTimer = null;

  const slugs = Array.from(waiting.keys());
  if (!slugs.length) return;

  const resolvers = new Map(waiting);
  waiting.clear();

  let list: DoctorPresence[] = [];
  try {
    const res = await fetch(PRESENCE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slugs }),
    });
    if (res.ok) list = (await res.json()) ?? [];
  } catch {
    // شکستِ این بج نباید کارت را خراب کند — کارت بدونِ بج رندر می‌شود، همان رفتارِ امروز
    // وقتی سرویس در دسترس نیست.
  }

  const bySlug = new Map<string, DoctorPresence>();
  (Array.isArray(list) ? list : []).forEach(item => {
    const key = normalizeSlug(item?.slug);
    if (key) bySlug.set(key, { ...item, slug: key });
  });

  resolvers.forEach((callbacks, slug) => {
    const value = bySlug.get(slug) ?? null;
    cache.set(slug, value);
    callbacks.forEach(cb => cb(value));
  });
}

function requestPresence(slug: string): Promise<DoctorPresence | null> {
  if (cache.has(slug)) return Promise.resolve(cache.get(slug) ?? null);

  return new Promise(resolve => {
    const list = waiting.get(slug);
    if (list) {
      list.push(resolve);
    } else {
      waiting.set(slug, [resolve]);
    }

    if (!flushTimer) flushTimer = setTimeout(flush, BATCH_WINDOW_MS);
  });
}

export interface DoctorPresenceState {
  /** تا وقتی جوابِ سرور نرسیده null است — یعنی «هنوز نمی‌دانیم»، نه «سابقه ندارد». */
  presence: DoctorPresence | null;
  resolved: boolean;
}

export function useDoctorPresence(slug?: string | null): DoctorPresenceState {
  const key = normalizeSlug(slug);
  const [state, setState] = useState<DoctorPresenceState>(() =>
    key && cache.has(key) ? { presence: cache.get(key) ?? null, resolved: true } : { presence: null, resolved: false },
  );

  useEffect(() => {
    if (!key) {
      setState({ presence: null, resolved: false });
      return;
    }

    let active = true;
    setState(cache.has(key) ? { presence: cache.get(key) ?? null, resolved: true } : { presence: null, resolved: false });

    requestPresence(key).then(value => {
      if (active) setState({ presence: value, resolved: true });
    });

    return () => {
      active = false;
    };
  }, [key]);

  return state;
}

/** فقط برای تست — کشِ ماژول را خالی می‌کند. */
export function __resetDoctorPresenceCache() {
  cache.clear();
  waiting.clear();
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = null;
}

export default useDoctorPresence;
