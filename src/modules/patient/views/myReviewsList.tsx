import Avatar from '@/common/components/atom/avatar';
import Button from '@/common/components/atom/button/button';
import Card from '@/common/components/atom/card';
import Chips from '@/common/components/atom/chips';
import Modal from '@/common/components/atom/modal/modal';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import { ChevronIcon } from '@/common/components/icons/chevron';
import { getBooks } from '@/common/apis/services/booking/getBooks';
import useModal from '@/common/hooks/useModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { trackRaviReviewEvent } from '@/modules/rate-and-review/analytics/trackRaviReviewEvent';
import { deleteFeedback, fetchMyFeedbacks, MyFeedbackItem } from '@/modules/rate-and-review/api';
import { BookStatus } from '@/modules/myTurn/types/bookStatus';
import { PaymentStatus } from '@/modules/myTurn/types/paymentStatus';
import { splitAppointmentsByOwner } from '@/modules/patient/utils/myReviewsOwnership';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const RAVI_SURVEY_BASE =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_RAVI_FRONT_BASE_URL
    ? process.env.NEXT_PUBLIC_RAVI_FRONT_BASE_URL
    : 'https://ravi-front-ravi.p24cloud.ir'
  ).replace(/\/$/, '');

/** Product copy: short P24 tone; Gemini auto-send blocked so reviewed with copywriting skill. */
const COPY = {
  heroTitle: 'نظرات من',
  heroSubtitle: 'نظرهای ثبت‌شده و پاسخ پزشک را اینجا ببین.',
  filterAll: 'همه',
  filterReviewed: 'نظر داده‌ام',
  filterPending: 'نظر نداده‌ام',
  reviewedCountLabel: 'نظر ثبت‌شده',
  pendingCountLabel: 'بدون نظر',
  noRateBadge: 'بدون امتیاز',
  emptyTextOnly: 'متنی برای این نظر نوشته نشده است.',
  editCta: 'ویرایش نظر',
  deleteCta: 'حذف',
  pendingLead: 'هنوز به این پزشک امتیازی نداده‌اید.',
  pendingCta: 'ثبت نظر',
  pendingHint: 'نظر شما به انتخاب بیماران دیگر کمک می‌کند.',
  notEligible: 'ثبت نظر برای این نوبت فعال نیست.',
  emptyState: 'هنوز نوبت یا نظری برای نمایش نیست.',
  emptyFilter: 'موردی در این فیلتر نیست.',
  error: 'مشکلی پیش آمد. دوباره تلاش کنید.',
  retry: 'تلاش مجدد',
  seeAppointments: 'مشاهده نوبت‌ها',
  deleteToastOk: 'نظر حذف شد.',
  deleteToastFail: 'حذف نظر انجام نشد.',
  deleteModalTitle: 'حذف نظر؟',
  deleteModalBody: 'نظر از نمایش عمومی برداشته می‌شود؛ تاریخچه حذف نمی‌شود.',
  deleteConfirm: 'تأیید حذف',
  deleteCancel: 'انصراف',
  doctorReply: 'پاسخ پزشک',
} as const;

type AppointmentRow = {
  bookId: string;
  doctorSlug: string;
  doctorName: string;
  centerId: string;
  centerName: string;
  bookTime: string;
  bookTimestamp?: number;
  bookStatus?: string;
  paymentStatus?: string;
  doctorId?: string | number;
  serverId?: string | number;
  patientNationalCode?: string;
};

type ReviewStatus = 'reviewed' | 'not_reviewed' | 'not_eligible';

type AppointmentReviewRow = AppointmentRow & {
  status: ReviewStatus;
  feedback?: MyFeedbackItem;
};


const doctorProfileHref = (slug?: string) => (slug ? `/dr/${encodeURIComponent(slug)}/` : '#');

const doctorLabelFromSlug = (slug?: string) => {
  if (!slug) return 'پزشک';
  try {
    return decodeURIComponent(slug).replace(/-/g, ' ');
  } catch {
    return slug.replace(/-/g, ' ');
  }
};

const normalizeId = (value: unknown) => String(value ?? '').trim();

const isEligibleForReview = (row: AppointmentRow) => {
  const status = String(row.bookStatus || '');
  const payment = String(row.paymentStatus || '');
  if (payment === PaymentStatus.refunded) return false;
  return status === BookStatus.visited || status === BookStatus.expired;
};

const buildSurveyUrl = (args: {
  userId: string | number;
  bookId: string;
  doctorSlug?: string;
  centerId?: string;
  doctorId?: string | number;
}) => {
  const centerId = normalizeId(args.centerId);
  const path = centerId === '5532' ? '/ravi/v2/survay/online-visit' : '/ravi/v2/survay/office';
  const params = new URLSearchParams({
    user_id: String(args.userId),
    book_id: String(args.bookId),
  });
  if (args.doctorSlug) params.set('doctor_slug', args.doctorSlug);
  if (centerId) params.set('center_id', centerId);
  if (args.doctorId != null && String(args.doctorId)) params.set('doctor_id', String(args.doctorId));
  return `${RAVI_SURVEY_BASE}${path}?${params.toString()}`;
};

const mapBookToRow = (turn: any): AppointmentRow | null => {
  const bookId = normalizeId(turn?.book_id);
  if (!bookId) return null;
  const doctorSlug = normalizeId(turn?.doctor_info?.slug);
  const doctorName = [turn?.doctor_info?.name, turn?.doctor_info?.family].filter(Boolean).join(' ').trim();
  return {
    bookId,
    doctorSlug,
    doctorName: doctorName || doctorLabelFromSlug(doctorSlug),
    centerId: normalizeId(turn?.center?.id ?? turn?.center_id),
    centerName: normalizeId(turn?.center?.name) || 'مرکز درمانی',
    bookTime: normalizeId(turn?.book_time_string) || '—',
    bookTimestamp: Number(turn?.from) || undefined,
    bookStatus: turn?.book_status,
    paymentStatus: turn?.payment_status,
    doctorId: turn?.doctor_info?.id,
    serverId: turn?.server_id,
    patientNationalCode: normalizeId(turn?.patient_info?.national_code) || undefined,
  };
};

const fetchAllBooks = async (): Promise<AppointmentRow[]> => {
  const collected: AppointmentRow[] = [];
  const seen = new Set<string>();
  for (let page = 1; page <= 20; page += 1) {
    const response = await getBooks({ page, return_type: 'book' });
    if (response.status === 204) break;
    const batch = Array.isArray(response.data) ? response.data : [];
    if (!batch.length) break;
    for (const item of batch) {
      const row = mapBookToRow(item);
      if (!row || seen.has(row.bookId)) continue;
      seen.add(row.bookId);
      collected.push(row);
    }
    if (batch.length < 10) break;
  }
  return collected;
};

const fetchAllMyFeedbacks = async (): Promise<MyFeedbackItem[]> => {
  const collected: MyFeedbackItem[] = [];
  let offset = 0;
  for (let page = 0; page < 20; page += 1) {
    const result = await fetchMyFeedbacks({ limit: 50, offset });
    collected.push(...result.data);
    if (!result.meta.hasNext || result.meta.nextOffset == null) break;
    offset = result.meta.nextOffset;
  }
  return collected;
};

const statusChipClass: Record<ReviewStatus, string> = {
  reviewed: '!bg-emerald-50 !text-emerald-700',
  not_reviewed: '!bg-amber-50 !text-amber-700',
  not_eligible: '',
};

const statusLabel: Record<ReviewStatus, string> = {
  reviewed: 'نظر داده‌اید',
  not_reviewed: 'نظر نداده‌اید',
  not_eligible: 'قابل ثبت نیست',
};

const RateBadge = ({ value }: { value?: number | null }) => {
  if (value == null || !Number.isFinite(value) || value <= 0) return null;
  return (
    <div className="flex h-[35px] min-w-[35px] shrink-0 items-center justify-center rounded-md bg-primary px-1.5 text-white">
      <Text fontSize="sm" fontWeight="bold" className="leading-none">
        {value.toFixed(1).replace(/\.0$/, '')}
      </Text>
    </div>
  );
};

const DoctorReply = ({ description }: { description: string }) => (
  <div className="rounded-lg bg-slate-50 p-3">
    <div className="flex items-center gap-2">
      <Text fontSize="xs" fontWeight="bold" className="text-primary">
        {COPY.doctorReply}
      </Text>
      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">پزشک</span>
    </div>
    <Text fontSize="sm" align="justify" className="mt-2 block whitespace-pre-wrap leading-7 text-slate-700">
      {description}
    </Text>
  </div>
);

const ReviewCta = ({ onClick }: { onClick: () => void }) => (
  <div className="space-y-2">
    <div className="flex w-full items-center justify-between rounded-md bg-gray p-3 px-4">
      <Text fontSize="sm">{COPY.pendingLead}</Text>
      <button type="button" className="flex min-h-11 items-center text-secondary" onClick={onClick}>
        <Text fontWeight="bold" fontSize="sm" className="ml-2">
          {COPY.pendingCta}
        </Text>
        <ChevronIcon dir="left" width="10" height="12" />
      </button>
    </div>
    <Text fontSize="xs" className="block px-1 text-slate-400">
      {COPY.pendingHint}
    </Text>
  </div>
);

export const MyReviewsList = () => {
  const router = useRouter();
  const isLogin = useUserInfoStore(state => state.isLogin);
  const pending = useUserInfoStore(state => state.pending);
  const userId = useUserInfoStore(state => state.info?.id);
  const ownerNationalCode = useUserInfoStore(state => state.info?.national_code);

  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [feedbacks, setFeedbacks] = useState<MyFeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<'all' | 'reviewed' | 'not_reviewed'>('all');
  const [deleting, setDeleting] = useState<MyFeedbackItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const deleteModal = useModal();

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [books, reviews] = await Promise.all([fetchAllBooks(), fetchAllMyFeedbacks()]);
      const { owned, excludedBookIds } = splitAppointmentsByOwner(books, ownerNationalCode);
      setAppointments(owned);
      setFeedbacks(reviews.filter(item => !excludedBookIds.has(normalizeId(item.book_id))));
      void trackRaviReviewEvent({
        event_type: 'review_list_load',
        count: owned.length,
        ok: true,
      });
    } catch {
      setError(true);
      setAppointments([]);
      setFeedbacks([]);
      void trackRaviReviewEvent({
        event_type: 'review_list_error',
        ok: false,
        error_code: 'my_reviews_join_failed',
      });
    } finally {
      setLoading(false);
    }
  }, [ownerNationalCode]);

  useEffect(() => {
    if (pending) return;
    if (!isLogin || !userId) {
      router.replace(`/login?redirect_url=${encodeURIComponent(router.asPath)}`);
      return;
    }
    void load();
  }, [pending, isLogin, userId, load, router]);

  const feedbackByBookId = useMemo(() => {
    const map = new Map<string, MyFeedbackItem>();
    for (const item of feedbacks) {
      const bookId = normalizeId(item.book_id);
      if (!bookId) continue;
      if (!map.has(bookId)) map.set(bookId, item);
    }
    return map;
  }, [feedbacks]);

  const appointmentRows = useMemo<AppointmentReviewRow[]>(() => {
    return appointments.map(appointment => {
      const feedback = feedbackByBookId.get(appointment.bookId);
      if (feedback) {
        return { ...appointment, status: 'reviewed', feedback };
      }
      if (isEligibleForReview(appointment)) {
        return { ...appointment, status: 'not_reviewed' };
      }
      return { ...appointment, status: 'not_eligible' };
    });
  }, [appointments, feedbackByBookId]);


  const counts = useMemo(() => {
    const reviewed = appointmentRows.filter(row => row.status === 'reviewed').length;
    const notReviewed = appointmentRows.filter(row => row.status === 'not_reviewed').length;
    return {
      all: appointmentRows.length,
      reviewed,
      notReviewed,
    };
  }, [appointmentRows]);

  const visibleAppointments = useMemo(() => {
    if (filter === 'reviewed') return appointmentRows.filter(row => row.status === 'reviewed');
    if (filter === 'not_reviewed') return appointmentRows.filter(row => row.status === 'not_reviewed');
    return appointmentRows;
  }, [appointmentRows, filter]);


  const openSurvey = (args: {
    bookId: string;
    doctorSlug?: string;
    centerId?: string;
    doctorId?: string | number;
    feedbackId?: string | number;
    mode: 'edit' | 'create';
  }) => {
    if (!userId) return;
    const url = buildSurveyUrl({
      userId,
      bookId: args.bookId,
      doctorSlug: args.doctorSlug,
      centerId: args.centerId,
      doctorId: args.doctorId,
    });
    void trackRaviReviewEvent({
      event_type: args.mode === 'edit' ? 'review_edit_submit' : 'review_section_view',
      feedback_id: args.feedbackId != null ? String(args.feedbackId) : undefined,
      slug: args.doctorSlug,
      ok: true,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openDelete = (item: MyFeedbackItem) => {
    setDeleting(item);
    deleteModal.handleOpen();
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setSubmitting(true);
    try {
      await deleteFeedback(String(deleting.id));
      setFeedbacks(prev => prev.filter(item => String(item.id) !== String(deleting.id)));
      void trackRaviReviewEvent({
        event_type: 'review_delete_submit',
        feedback_id: String(deleting.id),
        slug: deleting.doctor_slug,
        ok: true,
      });
      toast.success(COPY.deleteToastOk);
      deleteModal.handleClose();
      setDeleting(null);
    } catch {
      void trackRaviReviewEvent({
        event_type: 'review_delete_submit',
        feedback_id: String(deleting.id),
        slug: deleting.doctor_slug,
        ok: false,
        error_code: 'delete_failed',
      });
      toast.error(COPY.deleteToastFail);
    } finally {
      setSubmitting(false);
    }
  };

  if (pending || (loading && !error)) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} w="100%" h="8rem" rounded="lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="items-center space-y-4 !rounded-none py-8 text-center md:!rounded-lg">
        <Text fontSize="sm" className="text-slate-500">
          {COPY.error}
        </Text>
        <Button onClick={() => void load()}>{COPY.retry}</Button>
      </Card>
    );
  }

  if (!loading && counts.all === 0) {
    return (
      <Card className="items-center space-y-4 !rounded-none py-8 text-center md:!rounded-lg">
        <Text fontSize="sm" className="text-slate-500">
          {COPY.emptyState}
        </Text>
        <Link href="/dashboard/appointments/">
          <Button>{COPY.seeAppointments}</Button>
        </Link>
      </Card>
    );
  }

  const filterTabs: Array<{ id: typeof filter; label: string; count: number }> = [
    { id: 'all', label: COPY.filterAll, count: counts.all },
    { id: 'reviewed', label: COPY.filterReviewed, count: counts.reviewed },
    { id: 'not_reviewed', label: COPY.filterPending, count: counts.notReviewed },
  ];

  return (
    <div className="space-y-3 pb-[calc(20px+env(safe-area-inset-bottom))]" dir="rtl">
      <section className="-mx-4 border-b border-slate-200 bg-white px-4 py-4 md:mx-0 md:rounded-lg md:border">
        <Text as="h1" fontSize="base" fontWeight="bold" className="text-slate-900">
          {COPY.heroTitle}
        </Text>
        <Text fontSize="sm" className="mt-1 block leading-7 text-slate-500">
          {COPY.heroSubtitle}
        </Text>
        <div className="mt-3 flex gap-2">
          <div className="rounded-md bg-gray px-3 py-2">
            <Text fontSize="sm" fontWeight="bold" className="block text-slate-900">
              {counts.reviewed}
            </Text>
            <Text fontSize="xs" className="text-slate-500">
              {COPY.reviewedCountLabel}
            </Text>
          </div>
          {counts.notReviewed > 0 ? (
            <div className="rounded-md bg-gray px-3 py-2">
              <Text fontSize="sm" fontWeight="bold" className="block text-amber-700">
                {counts.notReviewed}
              </Text>
              <Text fontSize="xs" className="text-slate-500">
                {COPY.pendingCountLabel}
              </Text>
            </div>
          ) : null}
        </div>
      </section>

      <div className="sticky top-0 z-10 -mx-4 flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 md:static md:mx-0 md:rounded-lg md:border">
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`min-h-11 shrink-0 rounded-lg border px-3 text-xs font-semibold transition-colors ${
              filter === tab.id ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 bg-white text-slate-600'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visibleAppointments.map(row => {
          const replies = (row.feedback?.replies ?? []).filter(reply => Boolean(String(reply.description ?? '').trim()));
          const rate = row.feedback?.avg_rate_value != null ? Number(row.feedback.avg_rate_value) : null;
          const description = String(row.feedback?.description ?? '').trim();
          const doctorName = row.doctorName || doctorLabelFromSlug(row.doctorSlug);
          return (
            <Card
              key={row.bookId}
              className="space-y-3 !rounded-none border-solid border-slate-200 md:!rounded-lg md:border md:shadow-none"
              data-testid="my-review-card"
            >
              <div className="relative flex items-start justify-between gap-3">
                <Link href={doctorProfileHref(row.doctorSlug)} className="flex min-w-0 flex-1 items-center space-s-3">
                  <Avatar name={doctorName} width={48} height={48} />
                  <div className="flex min-w-0 flex-col">
                    <Text fontSize="sm" fontWeight="bold" className="line-clamp-1">
                      {doctorName}
                    </Text>
                    <Text fontSize="xs" className="mt-1 line-clamp-2 text-slate-500">
                      {[row.bookTime, row.centerName].filter(Boolean).join(' | ')}
                    </Text>
                  </div>
                </Link>
                <div className="flex shrink-0 items-start gap-2">
                  <RateBadge value={rate} />
                  <Chips className={statusChipClass[row.status]}>{statusLabel[row.status]}</Chips>
                </div>
              </div>

              {row.feedback ? (
                <>
                  {description ? (
                    <Text fontSize="sm" align="justify" className="block whitespace-pre-wrap leading-7 text-slate-700">
                      {description}
                    </Text>
                  ) : (
                    <Text fontSize="xs" className="block text-slate-400">
                      {COPY.emptyTextOnly}
                    </Text>
                  )}
                  {replies.length > 0 ? (
                    <div className="space-y-2">
                      {replies.map(reply => (
                        <DoctorReply key={String(reply.id)} description={String(reply.description)} />
                      ))}
                    </div>
                  ) : null}
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() =>
                        openSurvey({
                          bookId: row.bookId,
                          doctorSlug: row.doctorSlug || row.feedback?.doctor_slug,
                          centerId: row.centerId || String(row.feedback?.center_id ?? ''),
                          doctorId: row.doctorId,
                          feedbackId: row.feedback?.id,
                          mode: 'edit',
                        })
                      }
                    >
                      {COPY.editCta}
                    </Button>
                    <Button variant="secondary" theme="error" className="flex-1" onClick={() => openDelete(row.feedback!)}>
                      {COPY.deleteCta}
                    </Button>
                  </div>
                </>
              ) : row.status === 'not_reviewed' ? (
                <ReviewCta
                  onClick={() =>
                    openSurvey({
                      bookId: row.bookId,
                      doctorSlug: row.doctorSlug,
                      centerId: row.centerId,
                      doctorId: row.doctorId,
                      mode: 'create',
                    })
                  }
                />
              ) : (
                <Text fontSize="xs" className="block leading-6 text-slate-400">
                  {COPY.notEligible}
                </Text>
              )}
            </Card>
          );
        })}

      </div>

      {!visibleAppointments.length ? (
        <Card className="items-center !rounded-none md:!rounded-lg">
          <Text fontSize="sm" className="text-slate-500">
            {COPY.emptyFilter}
          </Text>
        </Card>
      ) : null}

      <Modal title={COPY.deleteModalTitle} {...deleteModal.modalProps}>
        <div className="space-y-3 p-1">
          <Text fontSize="sm" className="leading-7 text-slate-600">
            {COPY.deleteModalBody}
          </Text>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={deleteModal.handleClose} disabled={submitting}>
              {COPY.deleteCancel}
            </Button>
            <Button className="flex-1" theme="error" loading={submitting} onClick={() => void confirmDelete()}>
              {COPY.deleteConfirm}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyReviewsList;
