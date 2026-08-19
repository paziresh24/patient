import { getCookie } from 'cookies-next';
import { isPWA } from '@/common/utils/isPwa';
import { splunkInstance } from '@/common/services/splunk';

export type RaviReviewEventType =
  | 'rate_summary_load'
  | 'rate_summary_error'
  | 'review_list_load'
  | 'review_list_error'
  | 'review_filter_change'
  | 'review_sort_change'
  | 'review_helpful_submit'
  | 'review_helpful_error'
  | 'review_report_submit'
  | 'review_report_error'
  | 'review_edit_submit'
  | 'review_delete_submit'
  | 'review_share_click'
  | 'review_reply_submit'
  | 'review_section_view';

export type RaviReviewEventPayload = {
  event_type: RaviReviewEventType;
  slug?: string;
  doctor_id?: string;
  feedback_id?: string;
  filter?: string;
  sort?: string;
  status_code?: number;
  duration_ms?: number;
  error_code?: string;
  page?: number;
  hide_rates?: boolean;
  count?: number;
  ok?: boolean;
};

const BEACON_URL =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_RAVI_APIS_BASE_URL
    ? process.env.NEXT_PUBLIC_RAVI_APIS_BASE_URL
    : process.env.RAVI_APIS_BASE_URL) || 'https://ravi-apis.paziresh24.com';

function source(): 'patient_app' | 'patient_web' {
  return isPWA() ? 'patient_app' : 'patient_web';
}

async function postBeacon(payload: RaviReviewEventPayload): Promise<void> {
  try {
    await fetch(`${BEACON_URL.replace(/\/$/, '')}/ravi/v1/ops/ravi-events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        source: source(),
        terminal_id: typeof window !== 'undefined' ? getCookie('terminal_id') : undefined,
      }),
      keepalive: true,
    });
  } catch {
    // fire-and-forget
  }
}

/**
 * Lean rate/review UI events → Ravi Splunk only (index=ravi).
 * Prefers HEC when NEXT_PUBLIC_RAVI_SPLUNK_HEC_TOKEN is set; otherwise ships via API beacon.
 */
export const trackRaviReviewEvent = async (payload: RaviReviewEventPayload): Promise<void> => {
  const hecToken =
    typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_RAVI_SPLUNK_HEC_TOKEN : undefined;
  const ok = payload.ok !== false;
  const group = ok ? 'ravi_review_ui' : 'ravi_error';

  if (hecToken) {
    await splunkInstance('ravi').sendEvent({
      group,
      type: payload.event_type,
      event: {
        source: source(),
        slug: payload.slug,
        doctor_id: payload.doctor_id,
        feedback_id: payload.feedback_id,
        filter: payload.filter,
        sort: payload.sort,
        status_code: payload.status_code,
        duration_ms: payload.duration_ms,
        error_code: payload.error_code,
        page: payload.page,
        hide_rates: payload.hide_rates,
        count: payload.count,
        ok,
        ts: new Date().toISOString(),
      },
    });
    return;
  }

  await postBeacon(payload);
};
