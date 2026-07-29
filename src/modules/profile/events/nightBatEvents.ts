import { splunkInstance } from '@/common/services/splunk';
import { detectBot, getClientUserAgent } from '@/common/utils/detectBot';

type EventPayload = Record<string, unknown>;

const baseClientFields = (): EventPayload => {
  const ua = getClientUserAgent();
  return {
    page_type: undefined,
    is_bot: detectBot(ua),
    user_agent: ua,
    path: typeof window !== 'undefined' ? window.location.pathname : null,
  };
};

/** Flat fields for Splunk Search (`event_group` / `event_type` via library). */
export function sendDoctorProfileEvent(group: string, type: string, event: EventPayload = {}) {
  return splunkInstance('doctor-profile').sendEvent({
    group,
    type,
    event: {
      ...baseClientFields(),
      page_type: 'doctor',
      ...event,
    },
  });
}

export function sendCenterProfileEvent(group: string, type: string, event: EventPayload = {}) {
  return splunkInstance('center-profile').sendEvent({
    group,
    type,
    event: {
      ...baseClientFields(),
      page_type: 'center',
      ...event,
    },
  });
}

export function sendDoctorProfileEventServer(
  group: string,
  type: string,
  event: EventPayload,
  userAgent?: string | null,
) {
  return splunkInstance('doctor-profile').sendEvent({
    group,
    type,
    event: {
      page_type: 'doctor',
      is_bot: detectBot(userAgent),
      user_agent: userAgent ?? null,
      ...event,
    },
  });
}

export function sendCenterProfileEventServer(
  group: string,
  type: string,
  event: EventPayload,
  userAgent?: string | null,
) {
  return splunkInstance('center-profile').sendEvent({
    group,
    type,
    event: {
      page_type: 'center',
      is_bot: detectBot(userAgent),
      user_agent: userAgent ?? null,
      ...event,
    },
  });
}
