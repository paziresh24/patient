export type ExpertiseChipSource = {
  alias_title?: string | null;
  degree_name?: string | null;
  expertise_name?: string | null;
};

const normalizeLabel = (value?: string | null) => value?.replace(/\s+/g, ' ').trim() ?? '';

/**
 * Build profile expertise chips the same way search cards do:
 * - main line ≈ search `display_expertise` → `${degree} ${expertise}`
 * - optional extra tags ≈ search `keyword_tags_user_priority_1` (when provided)
 * Never explode pipe-separated `alias_title` service dumps into chips.
 */
export const buildDoctorExpertiseChips = (
  expertises: ExpertiseChipSource[] | null | undefined,
  options?: {
    keywordTags?: string[] | null;
  },
): string[] => {
  if (!expertises?.length) return [];

  const chips: string[] = [];
  const seen = new Set<string>();

  const push = (value?: string | null) => {
    const label = normalizeLabel(value);
    if (!label || seen.has(label)) return;
    seen.add(label);
    chips.push(label);
  };

  for (const exp of expertises) {
    const main = normalizeLabel([exp.degree_name, exp.expertise_name].filter(Boolean).join(' '));
    const alias = normalizeLabel(exp.alias_title);

    // Prefer degree + expertise (matches search display_expertise) regardless of alias_title.
    if (main && exp.expertise_name) {
      push(main);
      continue;
    }

    // degree_name only (no expertise_name) — use it with alias as fallback.
    if (exp.degree_name && !exp.expertise_name) {
      push(main || alias.split('|')[0]);
      continue;
    }

    if (alias.includes('|')) {
      // No degree+expertise at all: take first non-empty segment of the pipe list.
      const first = alias
        .split('|')
        .map(part => normalizeLabel(part))
        .find(Boolean);
      push(first);
      continue;
    }

    push(alias || main);
  }

  for (const tag of options?.keywordTags ?? []) {
    push(tag);
  }

  return chips;
};

export default buildDoctorExpertiseChips;
