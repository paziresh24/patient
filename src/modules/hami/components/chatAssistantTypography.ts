/** نام در هدر پنل — با تشدید وَ */
export const VARDAST_BRAND_NAME = 'وَردست';

/** نام در بقیه متن‌های UI */
export const VARDAST_NAME = 'وردست';

/** مقیاس تایپوگرافی یکپارچه پنل وردست */
export const vardastPanelClass = 'text-sm leading-6 text-slate-700 antialiased';

export const vardastGlass = {
  panel: 'vardast-glass-panel',
  backdrop: 'vardast-glass-backdrop',
  header: 'vardast-glass-header',
  footer: 'vardast-glass-footer',
  surface: 'vardast-glass-surface',
  bubble: 'vardast-glass-bubble',
  card: 'vardast-glass-bubble',
  chip: 'vardast-glass-chip',
  badge: 'vardast-glass-badge',
  trigger: 'vardast-glass-trigger',
} as const;

export const vardastType = {
  greeting: 'text-[15px] font-semibold leading-snug tracking-tight text-slate-900',
  body: 'text-sm font-normal leading-6 text-slate-600',
  caption: 'text-xs font-medium leading-5 text-slate-500',
  profileName: 'text-[15px] font-semibold leading-tight text-slate-900',
  profileStatus: 'text-xs font-medium leading-4 text-emerald-600',
  cardTitle: 'text-sm font-semibold leading-6 text-slate-900',
  cardMeta: 'text-xs font-medium leading-4 text-slate-500',
  actionChip:
    'vardast-glass-chip inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold text-primary transition active:scale-[0.98] hover:bg-primary/15',
} as const;

export const vardastRichContentClass =
  'break-words text-[13px] font-normal leading-[1.85] text-slate-700 [&_*:first-child]:mt-0 [&_*:last-child]:mb-0 [&_b]:font-semibold [&_b]:text-slate-900 [&_br]:block [&_br]:h-0 [&_div]:leading-[1.85] [&_h2]:mb-2.5 [&_h2]:mt-0 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:leading-6 [&_h2]:text-slate-900 [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-[13px] [&_h3]:font-semibold [&_h3]:text-slate-800 [&_li]:mb-1.5 [&_li]:list-disc [&_li]:ps-5 [&_li]:leading-[1.85] [&_li]:marker:text-slate-400 [&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:ps-5 [&_ol]:leading-[1.85] [&_p]:m-0 [&_p]:leading-[1.85] [&_p+p]:mt-2.5 [&_strong]:font-semibold [&_strong]:text-slate-900 [&_ul]:mb-2 [&_ul]:ps-5 [&_ul]:leading-[1.85]';
