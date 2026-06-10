export interface VardastWorkflowAppPopupAction {
  title: string;
  app_key: string;
  type?: 'app_popup';
  parameters?: Record<string, string>;
}

const parseVardastActionParameters = (raw: unknown): Record<string, string> | undefined => {
  if (!raw || typeof raw !== 'object') return undefined;

  const parameters = Object.entries(raw as Record<string, unknown>).reduce<Record<string, string>>((acc, [key, value]) => {
    if (typeof value === 'string' && value.trim()) {
      acc[key] = value.trim();
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      acc[key] = String(value);
    }
    return acc;
  }, {});

  return Object.keys(parameters).length > 0 ? parameters : undefined;
};

export const parseVardastActions = (raw: unknown): VardastWorkflowAppPopupAction[] => {
  if (!Array.isArray(raw)) return [];

  return raw
    .map(item => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const title = typeof record.title === 'string' ? record.title.trim() : '';
      const appKey = typeof record.app_key === 'string' ? record.app_key.trim() : '';
      const type = typeof record.type === 'string' ? record.type.trim() : 'app_popup';

      if (!title || !appKey || type !== 'app_popup') return null;

      const parameters = parseVardastActionParameters(record.parameters);

      const action: VardastWorkflowAppPopupAction = {
        title,
        app_key: appKey,
        ...(parameters ? { parameters } : {}),
      };

      return action;
    })
    .filter((item): item is VardastWorkflowAppPopupAction => item !== null);
};

export const areVardastActionsEqual = (
  current: VardastWorkflowAppPopupAction[],
  next: VardastWorkflowAppPopupAction[],
) => JSON.stringify(current) === JSON.stringify(next);
