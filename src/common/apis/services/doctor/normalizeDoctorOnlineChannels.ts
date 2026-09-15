/** Accept a string array, `{ data }`, or `{ online_visit_channel_types }`. */
export const normalizeDoctorOnlineChannels = (payload: unknown): string[] => {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { data?: unknown })?.data)
      ? (payload as { data: unknown[] }).data
      : Array.isArray((payload as { online_visit_channel_types?: unknown })?.online_visit_channel_types)
        ? (payload as { online_visit_channel_types: unknown[] }).online_visit_channel_types
        : [];

  return list.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
};
