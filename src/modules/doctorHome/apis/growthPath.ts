export type GrowthPathStepState = 'done' | 'active' | 'upcoming';

export type GrowthPathStep = {
  state: GrowthPathStepState;
  title: string;
  key?: string;
  action_url?: string;
};

export type GrowthPath = {
  completed_count: number;
  total_count: number;
  steps: GrowthPathStep[];
};

const normalizeStepState = (raw: unknown): GrowthPathStepState => {
  const value = String(raw ?? '').toLowerCase();
  if (value === 'done' || value === 'completed') return 'done';
  if (value === 'active' || value === 'current') return 'active';
  return 'upcoming';
};

export const normalizeGrowthPath = (raw: unknown): GrowthPath | null => {
  if (!raw || typeof raw !== 'object') return null;
  const path = raw as Record<string, unknown>;
  const stepsRaw = path.steps;
  if (!Array.isArray(stepsRaw) || stepsRaw.length === 0) return null;

  const steps: GrowthPathStep[] = [];
  for (const item of stepsRaw) {
    if (!item || typeof item !== 'object') continue;
    const step = item as Record<string, unknown>;
    const title = typeof step.title === 'string' ? step.title.trim() : '';
    if (!title) continue;
    const normalized: GrowthPathStep = {
      state: normalizeStepState(step.state),
      title,
    };
    if (typeof step.key === 'string') normalized.key = step.key;
    if (typeof step.action_url === 'string') normalized.action_url = step.action_url;
    steps.push(normalized);
  }

  if (steps.length === 0) return null;

  const completed =
    typeof path.completed_count === 'number'
      ? path.completed_count
      : steps.filter(step => step.state === 'done').length;
  const total =
    typeof path.total_count === 'number' ? path.total_count : Math.max(completed, steps.length);

  return { completed_count: completed, total_count: total, steps };
};

export const getGrowthPathTeaser = (path: GrowthPath) => {
  const remaining = Math.max(0, path.total_count - path.completed_count);
  const percent = path.total_count > 0 ? Math.min(100, Math.round((path.completed_count / path.total_count) * 100)) : 0;
  const stepTitle =
    path.steps.find(step => step.state === 'active')?.title ??
    path.steps.find(step => step.state === 'upcoming')?.title ??
    null;

  return {
    remaining,
    percent,
    stepTitle,
    complete: path.total_count > 0 && remaining === 0,
  };
};
