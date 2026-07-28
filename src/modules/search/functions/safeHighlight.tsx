import { Fragment, type ReactNode } from 'react';

/**
 * رندرِ امنِ فیلدِ `formatted_title` (و هم‌خانواده‌هایش) در suggestion-box.
 *
 * suggestion API این فیلد را به‌صورتِ رشتهٔ HTML برمی‌گرداند که فقط قطعهٔ matchِ کوئری را در یک
 * highlight می‌پیچد: یا `<em>…</em>` یا (برای platform) `<span style="color: #ec1448">…</span>`.
 * هر چیزِ دیگر «داده» است، نه markup — و از ورودیِ کاربر یا storeِ کوئری‌ها می‌آید (untrusted).
 *
 * پیش از این، این فیلد با `dangerouslySetInnerHTML` رندر می‌شد؛ در نتیجه یک payloadِ ذخیره/بازتاب‌شده
 * مثل `<img src=x onerror=…>` به‌عنوانِ HTML اجرا می‌شد (XSS — reflected و stored).
 *
 * این تابع به‌جای innerHTML، رشته را فقط حولِ همان تگ‌های highlightِ شناخته‌شده توکنایز می‌کند و بقیه را
 * به‌صورتِ **Text node** رندر می‌کند (که React خودش escape می‌کند). در نتیجه هر markupِ تزریقی به‌صورتِ
 * متنِ literal دیده می‌شود و هرگز اجرا نمی‌شود — بدونِ innerHTML، بدونِ DOMPurify، بدونِ HTML-parse
 * (پس روی مسیرِ داغِ per-keystroke سبک است). امن به‌ازای همهٔ ترتیب‌های rollout:
 *   - سرور خام بفرستد (`<em><img></em>`) → segment به‌صورتِ متن دیده می‌شود؛ امن.
 *   - سرور escape کند (`<em>&lt;img&gt;</em>`) → همان‌جا decode می‌شود تا نمایش درست بماند؛ امن.
 */

const SPLIT_RE = /(<em>|<\/em>|<span style="color: #ec1448">|<\/span>)/g;

// فقط ۵ entityِ استانداردِ htmlspecialchars (رفعِ سمتِ سرور). decode فقط برای نمایشِ درست است؛
// خروجی داخلِ Text node می‌رود و باز توسطِ React escape می‌شود، پس هرگز به اجرای کد منجر نمی‌شود.
const ENTITY_RE = /&(?:amp|lt|gt|quot|#0?39);/g;
const ENTITY_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#039;': "'",
  '&#39;': "'",
};
const decodeBasicEntities = (s: string): string => s.replace(ENTITY_RE, m => ENTITY_MAP[m] ?? m);

type Mode = null | 'em' | 'span';

export function safeHighlight(formatted?: string | null): ReactNode {
  if (!formatted) return null;

  const parts = formatted.split(SPLIT_RE);
  let mode: Mode = null;
  const out: ReactNode[] = [];

  parts.forEach((part, i) => {
    if (!part) return;
    if (part === '<em>') {
      mode = 'em';
      return;
    }
    if (part === '<span style="color: #ec1448">') {
      mode = 'span';
      return;
    }
    if (part === '</em>' || part === '</span>') {
      mode = null;
      return;
    }

    const text = decodeBasicEntities(part);
    if (mode === 'em') {
      out.push(
        <em key={i} className="not-italic">
          {text}
        </em>,
      );
    } else if (mode === 'span') {
      out.push(
        <span key={i} style={{ color: '#ec1448' }}>
          {text}
        </span>,
      );
    } else {
      out.push(<Fragment key={i}>{text}</Fragment>);
    }
  });

  return out;
}

export default safeHighlight;
