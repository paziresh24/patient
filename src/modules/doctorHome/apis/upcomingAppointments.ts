import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

const ONLINE_CENTER_ID = '5532';
const ALLBOOKS_URL = '/v1/n8n-nelson/webhook/v6/allbooks';
const FEED_LIMIT = 5;

export interface UpcomingAppointment {
  book_id: string;
  patient_name: string;
  book_time_string: string;
  from: number;
  center_name: string;
  center_id: string;
  book_status: string;
  is_online_visit: boolean;
  service_name?: string;
  // اطلاعات بیمار
  cell?: string;
  national_code?: string;
  insurance_name?: string;
  // نوبت
  track_code?: string;
  payment_status?: string;
  source_site?: string;
  prescription?: string;
}

export interface UpcomingAppointmentsResponse {
  today_count: number;
  items: UpcomingAppointment[];
}

export interface AllBooksCenter {
  id?: string;
}

export interface AllBooksParams {
  centers: AllBooksCenter[];
  date: string;
  show_other_platform?: boolean;
}

export const getTodayIsoDate = () => new Date().toISOString().slice(0, 10);

const unwrapPayload = (raw: unknown): Record<string, unknown> => {
  if (!raw || typeof raw !== 'object') return {};
  const root = raw as Record<string, unknown>;
  const nested = root.data;
  if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
    return nested as Record<string, unknown>;
  }
  return root;
};

const getPatientName = (raw: Record<string, unknown>) => {
  // direct display_name field (e.g. "اکبر پاپی")
  if (typeof raw.display_name === 'string' && raw.display_name.trim()) return raw.display_name.trim();

  // top-level name + family
  const topLevel = [raw.name, raw.family].filter(Boolean).join(' ').trim();
  if (topLevel) return topLevel;

  if (typeof raw.patient_name === 'string' && raw.patient_name.trim()) return raw.patient_name.trim();

  const patient = raw.patient as Record<string, unknown> | undefined;
  const patientInfo = raw.patient_info as Record<string, unknown> | undefined;
  const fromNested = [patient?.name, patient?.family].filter(Boolean).join(' ').trim();
  if (fromNested) return fromNested;

  const fromInfo = [patientInfo?.name, patientInfo?.family].filter(Boolean).join(' ').trim();
  if (fromInfo) return fromInfo;

  return 'مراجع';
};

const str = (v: unknown) => (v != null && v !== '' ? String(v).trim() : undefined);

const normalizeBook = (raw: Record<string, unknown>): UpcomingAppointment | null => {
  const bookId = String(raw.book_id ?? raw.id ?? raw.bookId ?? '').trim();
  if (!bookId) return null;

  const center = raw.center as Record<string, unknown> | undefined;
  const service = raw.service as Record<string, unknown> | undefined;
  const patient = raw.patient as Record<string, unknown> | undefined;
  const patientInfo = raw.patient_info as Record<string, unknown> | undefined;
  const centerId = String(raw.center_id ?? center?.id ?? '');

  const cell = str(raw.cell ?? raw.mobile ?? patient?.cell ?? patientInfo?.cell ?? raw.patient_cell);
  const nationalCode = str(raw.national_code ?? patient?.national_code ?? patientInfo?.national_code ?? raw.identity_code);
  const insuranceName = str(
    (raw.insurance as Record<string, unknown>)?.name ??
    raw.insurance_name ??
    raw.insurance_type ??
    patient?.insurance_name,
  );
  const trackCode = str(raw.track_code ?? raw.tracking_code ?? raw.follow_code ?? raw.ref_code);
  const paymentStatus = str(raw.payment_status ?? raw.payment_status_text ?? raw.status_payment);
  const sourceSite = str(raw.source_site ?? raw.site ?? center?.site ?? raw.site_name);
  const prescription = str(raw.prescription ?? raw.doctor_note ?? raw.recommendation);

  return {
    book_id: bookId,
    patient_name: getPatientName(raw),
    book_time_string: String(raw.book_time_string ?? raw.time_string ?? raw.time ?? '').trim(),
    from: Number(raw.from ?? raw.book_from ?? 0) || 0,
    center_name: String(raw.center_name ?? center?.name ?? '').trim(),
    center_id: centerId,
    book_status: String(raw.book_status ?? raw.status ?? '').trim(),
    is_online_visit: centerId === ONLINE_CENTER_ID || raw.type === 'online' || raw.is_online_visit === true || raw.is_online_visit === 1,
    service_name: String(raw.service_name ?? service?.name ?? '').trim() || undefined,
    cell,
    national_code: nationalCode,
    insurance_name: insuranceName,
    track_code: trackCode,
    payment_status: paymentStatus,
    source_site: sourceSite,
    prescription,
  };
};

const extractTodayCount = (root: Record<string, unknown>, booksLength: number): number => {
  const countRaw =
    root.count ??
    root.today_count ??
    root.total_count ??
    root.total ??
    root.count_book ??
    root.books_count;

  if (countRaw != null && countRaw !== '') {
    const parsed = Number(countRaw);
    if (Number.isFinite(parsed)) return parsed;
  }

  return booksLength;
};

export const normalizeAllBooksResponse = (data: unknown, limit = FEED_LIMIT): UpcomingAppointmentsResponse => {
  const root = unwrapPayload(data);
  const booksRaw = root.books ?? root.data ?? root.items ?? root.list ?? (Array.isArray(data) ? data : []);
  const books = (Array.isArray(booksRaw) ? booksRaw : [])
    .map(item => normalizeBook(item as Record<string, unknown>))
    .filter((item): item is UpcomingAppointment => item != null);

  const sorted = [...books].sort((a, b) => {
    if (a.from && b.from) return a.from - b.from;
    return a.book_time_string.localeCompare(b.book_time_string, 'fa');
  });

  return {
    today_count: extractTodayCount(root, books.length),
    items: sorted.slice(0, limit),
  };
};

export const getAllBooks = async (params: AllBooksParams) => {
  const { data } = await apiGatewayClient.post(ALLBOOKS_URL, {
    centers: params.centers,
    date: params.date,
    show_other_platform: params.show_other_platform ?? true,
  });
  return normalizeAllBooksResponse(data);
};

export const useUpcomingAppointments = (centers: AllBooksCenter[], enabled = true, date?: string) => {
  const resolvedDate = date ?? getTodayIsoDate();
  const centerIds = centers.map(c => c.id).filter(Boolean).sort().join(',');

  return useQuery(
    ['doctorHome', 'allBooks', resolvedDate, centerIds],
    () =>
      getAllBooks({
        centers,
        date: resolvedDate,
        show_other_platform: true,
      }),
    {
      enabled: enabled && centers.length > 0,
      staleTime: 60 * 1000,
      retry: 1,
    },
  );
};
