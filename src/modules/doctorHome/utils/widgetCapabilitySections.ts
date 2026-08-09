import type { HamdastCatalogApp } from '@/modules/hamdast/apis/appList';

export type WidgetSectionLayout =
  | 'assistant_carousel'
  | 'profile_toggles'
  | 'automation_cards'
  | 'social_banner'
  | 'list_rows';

export interface WidgetCapabilitySectionDef {
  id: string;
  title: string;
  subtitle?: string;
  layout: WidgetSectionLayout;
  appKeys?: string[];
  functions?: string[];
  categoryKeys?: string[];
}

export interface WidgetCapabilitySection {
  id: string;
  title: string;
  subtitle?: string;
  layout: WidgetSectionLayout;
  apps: HamdastCatalogApp[];
}

const PROFILE_WIDGET_CATEGORY = 'profile_widget';

/** سکشن‌های قابلیت‌محور */
export const WIDGET_CAPABILITY_SECTIONS: WidgetCapabilitySectionDef[] = [
  {
    id: 'assistants',
    title: 'دستیاران هوشمند مطب',
    subtitle: 'دریافت شرح‌حال و کمک حین ویزیت',
    layout: 'assistant_carousel',
    functions: ['assistant'],
    appKeys: ['vitatak', 'vitatalk', 'avix', 'vardast', 'hami', 'barg'],
    categoryKeys: ['assistant'],
  },
  {
    id: 'profile_upgrade',
    title: 'ارتقای سریع پروفایل',
    subtitle: 'افزودن قابلیت به صفحه پذیرش شما',
    layout: 'profile_toggles',
  },
  {
    id: 'social',
    title: 'مسئولیت اجتماعی',
    layout: 'social_banner',
    appKeys: ['marham', 'marhem'],
    categoryKeys: ['charity', 'social'],
  },
  {
    id: 'automation',
    title: 'اتوماسیون و ابزارها',
    subtitle: 'یکپارچه‌سازی و خودکارسازی مطب',
    layout: 'automation_cards',
    functions: ['addon', 'automation'],
    categoryKeys: ['automation', 'tools', 'addon'],
  },
];

const appSortRank = (app: HamdastCatalogApp) => {
  if (app.badges?.includes('NEW')) return 0;
  if (app.badges?.includes('SOON')) return 1;
  return 2;
};

const sortApps = (apps: HamdastCatalogApp[]) =>
  [...apps].sort((a, b) => {
    const diff = appSortRank(a) - appSortRank(b);
    if (diff !== 0) return diff;
    return (a.title ?? a.app_key).localeCompare(b.title ?? b.app_key, 'fa');
  });

const getSectionDef = (id: string) => WIDGET_CAPABILITY_SECTIONS.find(def => def.id === id);

const matchesSection = (app: HamdastCatalogApp, section: WidgetCapabilitySectionDef) => {
  if (section.appKeys?.includes(app.app_key)) return true;

  if (section.functions?.length && app.functions?.some(fn => section.functions!.includes(fn))) {
    return true;
  }

  if (section.categoryKeys?.length && app.category?.key && section.categoryKeys.includes(app.category.key)) {
    return true;
  }

  return false;
};

/** فقط دسته profile_widget — نه functions:widget که روی همه اپ‌ها ست شده */
export const isProfileWidgetApp = (app: HamdastCatalogApp) =>
  app.category?.key === PROFILE_WIDGET_CATEGORY;

export const isAssistantWidgetApp = (app: HamdastCatalogApp) => {
  const assistants = getSectionDef('assistants');
  return assistants ? matchesSection(app, assistants) : false;
};

export interface ActiveWidgetGroup {
  id: 'assistant' | 'profile' | 'other';
  title: string;
  subtitle?: string;
  apps: HamdastCatalogApp[];
}

const ACTIVE_WIDGET_GROUP_DEFS: Array<Pick<ActiveWidgetGroup, 'id' | 'title' | 'subtitle'>> = [
  {
    id: 'assistant',
    title: 'دستیاران هوشمند',
    subtitle: 'دریافت شرح‌حال و کمک حین ویزیت',
  },
  {
    id: 'profile',
    title: 'ابزارک‌های پروفایل',
    subtitle: 'قابلیت‌های فعال در صفحه پذیرش شما',
  },
  {
    id: 'other',
    title: 'سایر ابزارک‌ها',
  },
];

const resolveActiveWidgetGroupId = (app: HamdastCatalogApp): ActiveWidgetGroup['id'] => {
  if (isProfileWidgetApp(app)) return 'profile';
  if (isAssistantWidgetApp(app)) return 'assistant';
  return 'other';
};

export const groupActiveAppsByCategory = (
  apps: HamdastCatalogApp[],
  installedKeys: Set<string>,
): ActiveWidgetGroup[] => {
  const buckets: Record<ActiveWidgetGroup['id'], HamdastCatalogApp[]> = {
    assistant: [],
    profile: [],
    other: [],
  };

  for (const app of apps) {
    if (!installedKeys.has(app.app_key)) continue;
    buckets[resolveActiveWidgetGroupId(app)].push(app);
  }

  return ACTIVE_WIDGET_GROUP_DEFS.map(def => ({
    ...def,
    apps: sortApps(buckets[def.id]),
  })).filter(group => group.apps.length > 0);
};

const resolveSectionId = (app: HamdastCatalogApp): string => {
  const assistants = getSectionDef('assistants');
  if (assistants && matchesSection(app, assistants)) return 'assistants';

  if (isProfileWidgetApp(app)) return 'profile_upgrade';

  const social = getSectionDef('social');
  if (social && matchesSection(app, social)) return 'social';

  return 'automation';
};

export const groupAppsByCapability = (apps: HamdastCatalogApp[]): WidgetCapabilitySection[] => {
  const buckets = new Map<string, HamdastCatalogApp[]>(
    WIDGET_CAPABILITY_SECTIONS.map(section => [section.id, []]),
  );

  for (const app of apps) {
    buckets.get(resolveSectionId(app))!.push(app);
  }

  return WIDGET_CAPABILITY_SECTIONS.map(def => ({
    id: def.id,
    title: def.title,
    subtitle: def.subtitle,
    layout: def.layout,
    apps: sortApps(buckets.get(def.id) ?? []),
  })).filter(section => section.apps.length > 0);
};

export const getAppHref = (appKey: string, link?: string) => link || `/_/${appKey}/launcher`;

export const getBadgeLabel = (badges?: string[]) => {
  if (badges?.includes('NEW')) return 'جدید';
  if (badges?.includes('SOON')) return 'به‌زودی';
  return null;
};
