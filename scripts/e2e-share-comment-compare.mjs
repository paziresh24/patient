const RAVI_APIS = 'https://ravi-apis.paziresh24.com';
const APIGW = 'https://apigw.paziresh24.com';
const SLUG = 'dr-mdehghani';
const COMMENT_ID = '5693691';
const SHARE_TEXT = 'این نظر رو در پذیرش24 ببین 👇';

async function fetchJson(url, label) {
  const started = Date.now();
  const res = await fetch(url);
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { _raw: text.slice(0, 120) };
  }
  return { label, url, status: res.status, ms: Date.now() - started, body, ok: res.ok };
}

function extractUrl(data) {
  const url = data?.url ?? data?.data?.url ?? data?.link;
  return typeof url === 'string' && url ? url : null;
}

async function fetchShareCommentUrl(doctorSlug, commentId) {
  const endpoint =
    RAVI_APIS +
    '/ravi/v1/share/doctors/' +
    encodeURIComponent(doctorSlug) +
    '/' +
    encodeURIComponent(commentId);
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  return extractUrl(data);
}

async function fetchOldShareCommentUrl(slug, id) {
  const endpoint =
    APIGW +
    '/ravi/v1/share_comment?slug=' +
    encodeURIComponent(slug) +
    '&id=' +
    encodeURIComponent(id);
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  return extractUrl(data);
}

function buildSharePayload(url) {
  return { text: SHARE_TEXT, url };
}

function isShortLink(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && u.hostname.includes('p4z.ir');
  } catch {
    return false;
  }
}

async function main() {
  console.log('=== E2E Share API Comparison ===\n');

  let commentIds = [COMMENT_ID];
  try {
    const fb = await fetch(
      RAVI_APIS + '/ravi/v1/feedbacks/doctors/' + SLUG + '?filter=default&limit=3&offset=0',
    );
    if (fb.ok) {
      const data = await fb.json();
      const list = data?.data ?? data?.list ?? [];
      const ids = list.map(x => String(x.id ?? x.Id ?? '')).filter(Boolean);
      commentIds = [...new Set([COMMENT_ID, ...ids])].slice(0, 3);
      console.log('Sample comment IDs from live feedbacks:', commentIds.join(', '), '\n');
    }
  } catch (e) {
    console.log('Could not fetch feedbacks list:', e.message, '\n');
  }

  const results = [];
  for (const id of commentIds) {
    const oldCall = await fetchJson(APIGW + '/ravi/v1/share_comment?slug=' + SLUG + '&id=' + id, 'OLD');
    const newCall = await fetchJson(RAVI_APIS + '/ravi/v1/share/doctors/' + SLUG + '/' + id, 'NEW');
    const oldUrl = extractUrl(oldCall.body);
    const newUrl = extractUrl(newCall.body);
    const oldPayload = oldUrl ? buildSharePayload(oldUrl) : null;
    const newPayload = newUrl ? buildSharePayload(newUrl) : null;

    results.push({ id, oldCall, newCall, oldUrl, newUrl, oldPayload, newPayload });
  }

  for (const r of results) {
    console.log('--- comment_id: ' + r.id + ' ---');
    console.log('OLD endpoint:', r.oldCall.url);
    console.log('  status:', r.oldCall.status, '| time:', r.oldCall.ms + 'ms');
    console.log('  body keys:', Object.keys(r.oldCall.body || {}).join(', '));
    console.log('  url:', r.oldUrl ?? '(missing)');
    console.log('NEW endpoint:', r.newCall.url);
    console.log('  status:', r.newCall.status, '| time:', r.newCall.ms + 'ms');
    console.log('  body keys:', Object.keys(r.newCall.body || {}).join(', '));
    console.log('  url:', r.newUrl ?? '(missing)');

    const sameShape = r.oldCall.ok && r.newCall.ok && typeof r.oldUrl === 'string' && typeof r.newUrl === 'string';
    const sameShareText = r.oldPayload?.text === r.newPayload?.text;
    const bothShort = isShortLink(r.oldUrl) && isShortLink(r.newUrl);
    console.log('  same response shape (both 200 + url string):', sameShape ? 'YES' : 'NO');
    console.log('  same share text payload:', sameShareText ? 'YES' : 'NO');
    console.log('  both short links (l.p4z.ir):', bothShort ? 'YES' : 'NO');
    console.log('  urls identical:', r.oldUrl === r.newUrl ? 'YES (same)' : 'NO (expected: different short links)');
    console.log('');
  }

  console.log('--- App function path (fetchShareCommentUrl) ---');
  let appPass = false;
  try {
    const appUrl = await fetchShareCommentUrl(SLUG, COMMENT_ID);
    const payload = buildSharePayload(appUrl);
    console.log('fetchShareCommentUrl result:', appUrl);
    console.log('RaviCard navigator.share payload:', JSON.stringify(payload));
    appPass = !!appUrl && payload.text === SHARE_TEXT;
    console.log('PASS:', appPass);
  } catch (e) {
    console.log('FAIL:', e.message);
  }
  console.log('');

  console.log('--- Old vs new function parity ---');
  try {
    const oldFn = await fetchOldShareCommentUrl(SLUG, COMMENT_ID);
    const newFn = await fetchShareCommentUrl(SLUG, COMMENT_ID);
    console.log('old function url:', oldFn);
    console.log('new function url:', newFn);
    console.log(
      'parity:',
      typeof oldFn === 'string' && typeof newFn === 'string' ? 'PASS (both return url string)' : 'FAIL',
    );
  } catch (e) {
    console.log('parity check FAIL:', e.message);
  }
  console.log('');

  console.log('--- Error cases ---');
  const bad = await fetchJson(RAVI_APIS + '/ravi/v1/share/doctors/invalid-slug-xyz/0', 'NEW invalid');
  console.log('invalid slug/comment status:', bad.status, '| body:', JSON.stringify(bad.body));

  const allPass = results.every(
    r => r.oldCall.ok && r.newCall.ok && r.oldUrl && r.newUrl && r.oldPayload.text === r.newPayload.text,
  );

  console.log('\n=== SUMMARY ===');
  console.log('Cases tested:', results.length);
  console.log('All cases: old+new OK, same share payload shape:', allPass ? 'PASS' : 'FAIL');
  console.log('App function path:', appPass ? 'PASS' : 'FAIL');
  console.log('Overall:', allPass && appPass ? 'PASS' : 'FAIL');

  process.exit(allPass && appPass ? 0 : 1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
