export type BioCredentialItem = {
  title: string;
  subtitle?: string;
  year?: string;
  description?: string;
};

export type BioCredentials = {
  degrees: BioCredentialItem[];
  honors: BioCredentialItem[];
  experiences: BioCredentialItem[];
};

const pickString = (...candidates: unknown[]): string | undefined => {
  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return undefined;
};

const formatYearRange = (item: Record<string, unknown>): string | undefined => {
  const period = pickString(item.period, item.years, item.date, item.year);
  if (period) return period;

  const start = pickString(item.start_year, item.startYear, item.from_year, item.from);
  const end = pickString(item.end_year, item.endYear, item.to_year, item.to, item.until);
  if (start && end) return `${start}–${end}`;
  if (start) return end ? `${start}–${end}` : start;
  return end;
};

export function normalizeBioCredentialItem(raw: unknown): BioCredentialItem | null {
  if (raw == null) return null;
  if (typeof raw === 'string') {
    const title = raw.trim();
    return title ? { title } : null;
  }
  if (typeof raw !== 'object') return null;

  const item = raw as Record<string, unknown>;
  const title = pickString(item.title, item.name, item.label, item.degree, item.honor, item.role, item.position);
  if (!title) return null;

  return {
    title,
    subtitle: pickString(
      item.subtitle,
      item.organization,
      item.institution,
      item.issuer,
      item.university,
      item.company,
      item.place,
      item.location,
    ),
    year: formatYearRange(item),
    description: pickString(item.description, item.detail, item.details, item.body, item.summary),
  };
}

export function normalizeBioCredentialList(raw: unknown): BioCredentialItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeBioCredentialItem).filter((item): item is BioCredentialItem => !!item);
}

export function normalizeBioCredentials(bio: unknown): BioCredentials {
  const source = bio && typeof bio === 'object' ? (bio as Record<string, unknown>) : {};
  return {
    degrees: normalizeBioCredentialList(source.degrees),
    honors: normalizeBioCredentialList(source.honors),
    experiences: normalizeBioCredentialList(source.experiences),
  };
}

export function hasBioCredentials(credentials?: BioCredentials | null): boolean {
  if (!credentials) return false;
  return credentials.degrees.length > 0 || credentials.honors.length > 0 || credentials.experiences.length > 0;
}
