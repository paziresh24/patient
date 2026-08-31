import { applyDoctorPresence, buildLastSeenBadgeHtml, findLastSeenNode, formatLastSeenHtml } from './doctorPresence';

/** کارتی با همان دو نودی که اسکریپتِ قبلی رویشان می‌نشست. */
function makeCard(topTitle = 'پاسخ: کمتر از ۱ ساعت') {
  const card = document.createElement('div');
  card.className = 'ProductCard__abc';
  card.innerHTML = `
    <a href="/dr/dr-ali-rezaei/"><svg class="svgbadge_check__x"><path d="M0 0"></path></svg></a>
    <div class="plasmic__wab_expr_html_text_a">نام پزشک</div>
    <div class="plasmic__wab_expr_html_text_b">${topTitle}</div>
  `;
  return card;
}

const node = (card: HTMLElement) => card.querySelector<HTMLElement>('.plasmic__wab_expr_html_text_b')!;
const badge = (card: HTMLElement) => card.querySelector('svg')!;

describe('formatLastSeenHtml', () => {
  it('بخشِ زمانی تا «پیش» را bold می‌کند', () => {
    expect(formatLastSeenHtml('۳۷ دقیقه پیش آنلاین بوده')).toBe('<b>۳۷ دقیقه پیش</b> آنلاین بوده');
  });

  it('«دیروز» را bold می‌کند', () => {
    expect(formatLastSeenHtml('دیروز ساعت ۱۰:۳۰ آنلاین بوده')).toBe('<b>دیروز</b> ساعت ۱۰:۳۰ آنلاین بوده');
  });

  it('«آنلاین در پیام رسان» کاملاً bold است', () => {
    expect(formatLastSeenHtml('  آنلاین در  پیام رسان ')).toBe('<b>آنلاین در پیام رسان</b>');
  });

  it('متنِ بدونِ کلیدواژه دست‌نخورده ولی escape‌شده برمی‌گردد', () => {
    expect(formatLastSeenHtml('حاضر')).toBe('حاضر');
  });

  it('HTMLِ ورودی از سرور را خنثی می‌کند (سابقه‌ی XSS)', () => {
    expect(formatLastSeenHtml('<img src=x onerror=alert(1)> پیش')).toBe(
      '<b>&lt;img src=x onerror=alert(1)&gt; پیش</b>',
    );
    expect(buildLastSeenBadgeHtml('<b>x</b>')).toBe('<span dir="rtl">&lt;b&gt;x&lt;/b&gt;</span>');
  });
});

describe('findLastSeenNode', () => {
  it('گرهِ حاویِ «پاسخ» را پیدا می‌کند، نه اولین گرهِ expr', () => {
    const card = makeCard();
    expect(findLastSeenNode(card)).toBe(node(card));
  });

  it('اگر هیچ گرهی «پاسخ» نداشته باشد null می‌دهد', () => {
    const card = makeCard('اولین نوبت: فردا');
    expect(findLastSeenNode(card)).toBeNull();
  });
});

describe('applyDoctorPresence', () => {
  it('تا وقتی جوابِ سرور نرسیده هیچ چیزی را تغییر نمی‌دهد', () => {
    const card = makeCard();
    applyDoctorPresence(card, { presence: null, resolved: false });
    expect(node(card).textContent).toContain('پاسخ');
    expect(node(card).style.display).toBe('');
  });

  it('متنِ last_seen جای «پاسخ» می‌نشیند', () => {
    const card = makeCard();
    applyDoctorPresence(card, { presence: { slug: 'dr-ali-rezaei', last_seen: '۳۷ دقیقه پیش آنلاین بوده' }, resolved: true });
    expect(node(card).innerHTML).toBe('<span dir="rtl"><b>۳۷ دقیقه پیش</b> آنلاین بوده</span>');
  });

  it('پزشکِ بدونِ سابقه آن خط را اصلاً نمی‌بیند', () => {
    const card = makeCard();
    applyDoctorPresence(card, { presence: { slug: 'dr-ali-rezaei', last_seen: null }, resolved: true });
    expect(node(card).style.display).toBe('none');
    expect(node(card).innerHTML).toBe('');
  });

  it('پزشکِ آنلاینِ بدونِ سابقه، متنِ کارت را از دست نمی‌دهد', () => {
    const card = makeCard();
    applyDoctorPresence(card, { presence: { slug: 'dr-ali-rezaei', online: true, last_seen: null }, resolved: true });
    expect(node(card).textContent).toContain('پاسخ');
    expect(badge(card).innerHTML).toContain('#22c55e');
  });

  it('پزشکِ آنلاین نقطه‌ی سبز می‌گیرد و تیکِ قبلی می‌رود', () => {
    const card = makeCard();
    applyDoctorPresence(card, { presence: { slug: 'dr-ali-rezaei', online: true, last_seen: 'آنلاین در پیام رسان' }, resolved: true });
    expect(badge(card).innerHTML).not.toContain('<path');
    expect(badge(card).innerHTML).toContain('#22c55e');
  });

  it('اجرای دوباره چیزی را دوباره نمی‌نویسد (idempotent)', () => {
    const card = makeCard();
    const state = { presence: { slug: 'dr-ali-rezaei', online: true, last_seen: 'دیروز آنلاین بوده' }, resolved: true };
    applyDoctorPresence(card, state);
    const first = node(card).innerHTML;
    applyDoctorPresence(card, state);
    applyDoctorPresence(card, state);
    expect(node(card).innerHTML).toBe(first);
    expect(badge(card).innerHTML.match(/22c55e/g)).toHaveLength(1);
  });

  it('از حالتِ پنهان به متنِ تازه برمی‌گردد', () => {
    const card = makeCard();
    applyDoctorPresence(card, { presence: { slug: 'dr-ali-rezaei', last_seen: null }, resolved: true });
    applyDoctorPresence(card, { presence: { slug: 'dr-ali-rezaei', last_seen: '۲ ساعت پیش آنلاین بوده' }, resolved: true });
    expect(node(card).style.display).toBe('');
    expect(node(card).textContent).toBe('۲ ساعت پیش آنلاین بوده');
  });

  it('کارتِ بدونِ آن گره خراب نمی‌شود', () => {
    const card = makeCard('اولین نوبت: فردا');
    expect(() =>
      applyDoctorPresence(card, { presence: { slug: 'dr-ali-rezaei', last_seen: '۱ ساعت پیش آنلاین بوده' }, resolved: true }),
    ).not.toThrow();
    expect(card.textContent).toContain('اولین نوبت: فردا');
  });
});
