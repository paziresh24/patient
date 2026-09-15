import flatten from 'lodash/flatten';

/** Search card item for center profile doctor list (seapi). */
export type CenterSearchDoctor = Record<string, any> & {
  id: string;
  title: string;
  badges: any[];
  actions: any[];
};

const asArray = <T>(value: unknown): T[] => (Array.isArray(value) ? value : []);

const asTrimmedString = (value: unknown): string => (typeof value === 'string' && value.trim() ? value.trim() : '');

/**
 * Normalizes a search row so a half-empty document (all fields null) renders as an empty card
 * instead of crashing the page or silently disappearing from the list.
 * Only non-object rows are dropped; missing id/title degrade to empty strings.
 */
export function sanitizeCenterSearchDoctor(raw: unknown): CenterSearchDoctor | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;

  const doctor = raw as Record<string, any>;
  const id = doctor.id ?? doctor._id;
  const title = asTrimmedString(doctor.title) || asTrimmedString(doctor.display_name);

  const badges = asArray<any>(doctor.badges).filter(item => item && typeof item === 'object');
  const actions = asArray<any>(doctor.actions).filter(
    item => item && typeof item === 'object' && typeof item.title === 'string',
  );

  return {
    ...doctor,
    id: id == null ? '' : String(id),
    _id: doctor._id ?? id ?? '',
    title,
    badges,
    actions,
  };
}

/** Sanitize one search API page before it enters react-query cache. */
export function sanitizeCenterSearchResultPage(page: any) {
  if (!page || typeof page !== 'object') return page;

  const result = asArray(page?.search?.result)
    .map(sanitizeCenterSearchDoctor)
    .filter((doctor): doctor is CenterSearchDoctor => doctor != null);

  return {
    ...page,
    search: {
      ...(page.search ?? {}),
      result,
    },
  };
}

export function flattenCenterSearchDoctors(pages: any[] | undefined): CenterSearchDoctor[] {
  const raw = flatten(pages?.map(page => page?.search?.result ?? []) ?? []);
  return raw.map(sanitizeCenterSearchDoctor).filter((doctor): doctor is CenterSearchDoctor => doctor != null);
}
