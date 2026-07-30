import flatten from 'lodash/flatten';

/** Search card item for center profile doctor list (seapi). */
export type CenterSearchDoctor = Record<string, any> & {
  id: string;
  title: string;
  badges: any[];
  actions: any[];
};

const asArray = <T>(value: unknown): T[] => (Array.isArray(value) ? value : []);

/**
 * Drops malformed search rows so one bad doctor cannot break center profile render.
 * Requires a stable id (_id fallback) and a display title.
 */
export function sanitizeCenterSearchDoctor(raw: unknown): CenterSearchDoctor | null {
  if (!raw || typeof raw !== 'object') return null;

  const doctor = raw as Record<string, any>;
  const id = doctor.id ?? doctor._id;
  if (id == null || id === '') return null;

  const title =
    typeof doctor.title === 'string' && doctor.title.trim()
      ? doctor.title.trim()
      : typeof doctor.display_name === 'string' && doctor.display_name.trim()
        ? doctor.display_name.trim()
        : null;
  if (!title) return null;

  const badges = asArray<any>(doctor.badges).filter(item => item && typeof item === 'object');
  const actions = asArray<any>(doctor.actions).filter(
    item => item && typeof item === 'object' && typeof item.title === 'string',
  );

  return {
    ...doctor,
    id: String(id),
    _id: doctor._id ?? id,
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
