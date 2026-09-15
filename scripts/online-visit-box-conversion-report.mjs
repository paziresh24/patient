/**
 * Profile conversion: view → online-visit book click, for GrowthBook new_onlinevisit_box slugs.
 * Today so far vs the same weekday/hours last week. Sends Telegram. No perishable numbers in git.
 *
 * Env (names only): PROFILE_SPLUNK_USER, PROFILE_SPLUNK_PASSWORD,
 * TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, optional TELEGRAM_API_BASE,
 * GROWTHBOOK_API_HOST, GROWTHBOOK_CLIENT_KEY.
 */
import { writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const TEHRAN = 'Asia/Tehran';
const FEATURE = 'new_onlinevisit_box';
const GB_HOST = process.env.GROWTHBOOK_API_HOST || 'https://growthbook-api.paziresh24.com';
const GB_KEY = process.env.GROWTHBOOK_CLIENT_KEY || 'sdk-St1dBftdp07geqtD';
const SPLUNK = 'https://profile-splunk.paziresh24.com';
const TG_API = (process.env.TELEGRAM_API_BASE || 'https://chaparchi.paziresh24.com').replace(/\/$/, '');

const extractSlugs = featureValue => {
  if (Array.isArray(featureValue)) return featureValue.filter(s => typeof s === 'string' && s);
  if (featureValue && Array.isArray(featureValue.slugs)) {
    return featureValue.slugs.filter(s => typeof s === 'string' && s);
  }
  return [];
};

const slugsFromFeature = feature => {
  const slugs = new Set(extractSlugs(feature?.defaultValue));
  for (const rule of feature?.rules ?? []) {
    if (rule.force !== true && rule.force !== 1) continue;
    const slugCond = rule.condition?.slug;
    if (typeof slugCond === 'string' && slugCond) slugs.add(slugCond);
    if (slugCond && Array.isArray(slugCond.$in)) {
      for (const item of slugCond.$in) if (typeof item === 'string' && item) slugs.add(item);
    }
  }
  return [...slugs];
};

const tehranParts = date => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TEHRAN,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = type => Number(parts.find(p => p.type === type)?.value ?? 0);
  return { y: get('year'), m: get('month'), d: get('day'), h: get('hour'), min: get('minute') };
};

const pad = n => String(n).padStart(2, '0');
const tehranStamp = (y, m, d, h, min) => `${y}-${pad(m)}-${pad(d)}T${pad(h)}:${pad(min)}:00+03:30`;

const windows = now => {
  const p = tehranParts(now);
  const startToday = new Date(tehranStamp(p.y, p.m, p.d, 0, 0));
  const last = new Date(startToday.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lp = tehranParts(last);
  const elapsedMs = now.getTime() - startToday.getTime();
  const startLast = new Date(tehranStamp(lp.y, lp.m, lp.d, 0, 0));
  const endLast = new Date(startLast.getTime() + elapsedMs);
  return {
    today: { earliest: startToday.toISOString(), latest: now.toISOString() },
    lastWeek: { earliest: startLast.toISOString(), latest: endLast.toISOString() },
    labelToday: `${p.y}-${pad(p.m)}-${pad(p.d)} تا ${pad(p.h)}:${pad(p.min)}`,
    labelLast: `${lp.y}-${pad(lp.m)}-${pad(lp.d)} تا ${pad(tehranParts(endLast).h)}:${pad(tehranParts(endLast).min)}`,
  };
};

const splunkQuote = slugs => slugs.map(s => `"${s.replace(/"/g, '\\"')}"`).join(',');

const buildSearch = slugs => {
  const slugOr = slugs.length
    ? `(slug IN (${splunkQuote(slugs)}) OR data.slug IN (${splunkQuote(slugs)}) OR ${slugs
        .map(s => `match(page_url,"${s.replace(/"/g, '')}") OR match(data.page_url,"${s.replace(/"/g, '')}")`)
        .join(' OR ')})`
    : '0=1';
  return `search index=profile ${slugOr} (event_type="doctor profile page view" OR event_type="doctor profile press online visit book button")
| eval step=case(event_type="doctor profile page view","view", event_type="doctor profile press online visit book button","click", true(),"other")
| stats count as events by step`;
};

const formBody = obj =>
  Object.entries(obj)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');

const gitlabToken = () => {
  const filled = spawnSync('git', ['credential', 'fill'], {
    input: 'protocol=https\nhost=gitlab.paziresh24.com\n\n',
    encoding: 'utf8',
  });
  const map = {};
  for (const line of String(filled.stdout || '').split(/\r?\n/)) {
    const i = line.indexOf('=');
    if (i > 0) map[line.slice(0, i)] = line.slice(i + 1);
  }
  return map.password || process.env.GITLAB_TOKEN || '';
};

const gitlabVar = async (project, key) => {
  const token = gitlabToken();
  if (!token) return '';
  const res = await fetch(
    `https://gitlab.paziresh24.com/api/v4/projects/${encodeURIComponent(project)}/variables/${encodeURIComponent(key)}`,
    { headers: { 'PRIVATE-TOKEN': token } },
  );
  if (!res.ok) return '';
  const json = await res.json();
  return json.value || '';
};

const loginSplunk = async () => {
  const user = process.env.PROFILE_SPLUNK_USER || 'admin';
  const password = process.env.PROFILE_SPLUNK_PASSWORD || '';
  if (!password) throw new Error('PROFILE_SPLUNK_PASSWORD missing');
  const jar = [];
  const getSet = res => {
    const raw = res.headers.getSetCookie?.() || [];
    for (const c of raw) jar.push(c.split(';')[0]);
  };
  const cookieHeader = () => jar.join('; ');
  const loginPage = await fetch(`${SPLUNK}/en-US/account/login`, { headers: { cookie: cookieHeader() } });
  getSet(loginPage);
  const cval = (jar.find(c => c.startsWith('cval=')) || '').slice(5);
  const post = await fetch(`${SPLUNK}/en-US/account/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      cookie: cookieHeader(),
    },
    body: formBody({ username: user, password, cval, set_has_logged_in: 'false' }),
    redirect: 'manual',
  });
  getSet(post);
  const csrf = (jar.find(c => c.startsWith('splunkweb_csrf_token_8000=')) || '').split('=')[1];
  if (!csrf) throw new Error('Splunk CSRF cookie missing after login');
  return { cookie: cookieHeader(), csrf };
};

const runSplunk = async (auth, search, earliest, latest) => {
  const res = await fetch(`${SPLUNK}/en-US/splunkd/__raw/services/search/jobs/export`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      cookie: auth.cookie,
      'X-Splunk-Form-Key': auth.csrf,
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: formBody({ search, earliest_time: earliest, latest_time: latest, output_mode: 'json' }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Splunk ${res.status}: ${text.slice(0, 300)}`);
  const counts = { view: 0, click: 0 };
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    try {
      const row = JSON.parse(line);
      const step = row.result?.step || row.step;
      const count = Number(row.result?.events || row.result?.count || 0);
      if (step === 'view' || step === 'click') counts[step] = count;
    } catch {
      // ignore non-json lines
    }
  }
  return counts;
};

const pct = (num, den) => (den > 0 ? `${((100 * num) / den).toFixed(1)}٪` : '—');
const delta = (now, prev) => {
  if (prev == null || Number.isNaN(prev)) return '—';
  const d = now - prev;
  const sign = d > 0 ? '+' : '';
  return `${sign}${d.toFixed(1)} واحد درصد`;
};

const sendTelegram = async (token, chatId, text) => {
  const url = `${TG_API}/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(`Telegram: ${json.description || res.status}`);
  return json;
};

const main = async () => {
  const gb = await fetch(`${GB_HOST}/api/features/${GB_KEY}`).then(r => r.json());
  const slugs = slugsFromFeature(gb.features?.[FEATURE] || {});
  const win = windows(new Date());
  const search = buildSearch(slugs);

  let telegramToken = process.env.TELEGRAM_BOT_TOKEN || '';
  let telegramChat = process.env.TELEGRAM_CHAT_ID || '';
  if (!telegramToken || !telegramChat) {
    telegramToken = telegramToken || (await gitlabVar('anahita-mansouri/ravi-webservices', 'TELEGRAM_BOT_TOKEN'));
    telegramChat = telegramChat || (await gitlabVar('anahita-mansouri/ravi-webservices', 'TELEGRAM_CHAT_ID'));
  }

  const auth = await loginSplunk();
  const today = await runSplunk(auth, search, win.today.earliest, win.today.latest);
  const lastWeek = await runSplunk(auth, search, win.lastWeek.earliest, win.lastWeek.latest);
  const todayRate = today.view > 0 ? (100 * today.click) / today.view : null;
  const lastRate = lastWeek.view > 0 ? (100 * lastWeek.click) / lastWeek.view : null;

  const slugLine = slugs.length ? slugs.map(s => `• ${s}`).join('\n') : 'هیچ اسلاگی در فلگ فعال نیست';
  const text = [
    '<b>نرخ تبدیل کارد جدید ویزیت آنلاین</b>',
    `فلگ: <code>${FEATURE}</code>`,
    `پنجره: امروز ${win.labelToday} نسبت به هفته پیش ${win.labelLast} (تهران)`,
    '',
    '<b>اسلاگ‌های گروه گرجوال</b>',
    slugLine,
    '',
    '<b>ویوی پروفایل → دکمه شروع ویزیت آنلاین</b>',
    `امروز: ${today.view} ویو → ${today.click} کلیک → ${todayRate == null ? '—' : pct(today.click, today.view)}`,
    `هفته پیش (همان ساعت): ${lastWeek.view} ویو → ${lastWeek.click} کلیک → ${lastRate == null ? '—' : pct(lastWeek.click, lastWeek.view)}`,
    `تغییر نرخ: ${todayRate == null || lastRate == null ? '—' : delta(todayRate, lastRate)}`,
    '',
    'منبع: index=profile / doctor profile page view و press online visit book button',
  ].join('\n');

  if (telegramToken && telegramChat) {
    await sendTelegram(telegramToken, telegramChat, text);
  } else {
    writeFileSync('tmp-online-visit-box-report.txt', text, 'utf8');
    throw new Error('TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID missing; wrote tmp-online-visit-box-report.txt');
  }

  console.log(
    JSON.stringify(
      { ok: true, slugs: slugs.length, today, lastWeek, telegram: true },
      null,
      2,
    ),
  );
};

main().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
