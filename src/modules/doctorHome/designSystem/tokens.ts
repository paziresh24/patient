/**
 * Paziresh24 design tokens — aligned with tailwind.config + Plasmic DS
 * primary #3861fb · brand #3F3F79 · secondary #00acac · gray #F8FAFB
 */
export const ds = {
  radius: {
    card: 'rounded-2xl',
    tile: 'rounded-xl',
    inner: 'rounded-lg',
    pill: 'rounded-full',
  },
  shadow: {
    card: 'shadow-card',
    sm: 'shadow-sm',
  },
  surface: {
    pageColor: '#F2F3F5',
    page: 'bg-[#F2F3F5]',
    card: 'bg-white border border-slate-100',
    muted: 'bg-slate-100',
    primarySoft: 'bg-primary/5',
    primaryTint: 'bg-[#DBE8FE]',
    secondarySoft: 'bg-secondary/10',
    warningSoft: 'bg-amber-50',
  },
  type: {
    section: 'text-sm font-bold text-slate-800',
    display: 'text-base font-bold text-slate-800',
    dateDay: 'text-xs font-medium text-slate-500',
    metric: 'text-3xl font-bold text-slate-800',
    cardTitle: 'text-sm font-bold text-slate-800',
    cardBody: 'text-sm text-slate-600',
    caption: 'text-xs text-slate-500',
    label: 'text-xs font-medium text-slate-500',
    link: 'text-xs font-medium text-primary',
  },
  timeline: {
    done: 'bg-secondary text-white',
    current: 'bg-primary text-white',
    upcoming: 'bg-white border-2 border-slate-200',
    line: 'border-slate-200',
  },
} as const;
