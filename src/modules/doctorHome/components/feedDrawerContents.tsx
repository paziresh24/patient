import classNames from '@/common/utils/classNames';
import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';
import moment from 'jalali-moment';
import { useEffect, useRef, useState } from 'react';
import { UpcomingAppointment } from '../apis/upcomingAppointments';
import { useReviewerName, useReviewsInfinite } from '../apis/reviewInteractions';
import { DsBadge, DsButton, ds } from '../designSystem';
import { DoctorHomeFeedReview } from '../types/feed';
import { mapRawReviewToFeed } from '../utils/normalizeReview';
import { ReviewReplySection } from './reviewReply';

// ── helpers ───────────────────────────────────────────────────────────────────

const Row = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div className="flex items-baseline justify-between gap-4 py-2.5 border-b border-slate-100 last:border-0">
    <span className="shrink-0 text-sm text-slate-500">{label}</span>
    <span className={classNames('text-sm font-medium text-left', accent ? 'text-primary' : 'text-slate-900')}>
      {value}
    </span>
  </div>
);

const PaymentBadge = ({ status }: { status?: string }) => {
  if (!status) return null;
  const paid = /پرداخت.?شد|paid/i.test(status);
  return (
    <span className={classNames('inline-flex items-center gap-1 text-sm font-medium', paid ? 'text-green-600' : 'text-red-500')}>
      {paid && <span className="flex h-4 w-4 items-center justify-center rounded-full border border-green-400 text-[10px]">✓</span>}
      {status}
    </span>
  );
};

// ── Review presentation ────────────────────────────────────────────────────────

// عکس نظردهنده از سرویس عکس پاذیرش۲۴؛ اگه نبود یا خطا داد، حرف اول نام نشون داده میشه
const ReviewerAvatar = ({ userId, name }: { userId?: string | number; name?: string }) => {
  const [failed, setFailed] = useState(false);
  const initial = (name?.trim()?.[0] ?? '؟').toUpperCase();
  const showImg = userId != null && userId !== '' && !failed;

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-bold text-primary">
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://pic.paziresh24.com/api/image/${userId}`}
          alt={name ?? 'نظردهنده'}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        initial
      )}
    </div>
  );
};

const Stars = ({ rate }: { rate?: number | null }) => {
  if (rate == null || !Number.isFinite(rate) || rate <= 0) return null;
  const rounded = Math.round(rate);
  return (
    <span className="inline-flex items-center gap-1" aria-label={`امتیاز ${rate.toFixed(1)} از ۵`}>
      <span className="flex items-center gap-0.5">
        {[0, 1, 2, 3, 4].map(i => (
          <svg key={i} viewBox="0 0 20 20" className={classNames('h-3.5 w-3.5', i < rounded ? 'text-amber-400' : 'text-slate-200')} fill="currentColor">
            <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79L1.58 7.62l5.82-.85L10 1.5z" />
          </svg>
        ))}
      </span>
      <span className="text-xs font-bold tabular-nums text-amber-500">{rate.toFixed(1)}</span>
    </span>
  );
};

export const ReviewHeader = ({ review }: { review: DoctorHomeFeedReview }) => {
  const isRecommended =
    review.recommended === '1' || review.recommended === 1 || review.recommended === true;

  // اگه نام در آیتم نبود، مثل کامپوننت پروفایل پزشک از سرویس users می‌گیریم
  const { data: fetchedName } = useReviewerName(review.userName ? undefined : review.userId);
  const name = review.userName ?? fetchedName ?? undefined;

  return (
    <div className="flex items-center gap-3">
      <ReviewerAvatar userId={review.userId} name={name} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold text-slate-900">
            {name ?? 'کاربر پاذیرش۲۴'}
          </span>
          {review.relativeCreatedTime && (
            <span className={classNames(ds.type.caption, 'shrink-0')}>{review.relativeCreatedTime}</span>
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Stars rate={review.rate} />
          {review.recommended != null && (
            <DsBadge tone={isRecommended ? 'success' : 'neutral'}>
              {isRecommended ? 'توصیه می‌کند' : 'توصیه نمی‌کند'}
            </DsBadge>
          )}
          {review.visited && <DsBadge tone="neutral">ویزیت‌شده</DsBadge>}
        </div>
        {review.centerName && (
          <p className={classNames(ds.type.caption, 'mt-1 truncate')}>{review.centerName}</p>
        )}
      </div>
    </div>
  );
};

// ── Appointment detail sheet ──────────────────────────────────────────────────

export const AppointmentDetailContent = ({ appointment }: { appointment: UpcomingAppointment }) => {
  const date = appointment.from
    ? moment.unix(appointment.from).locale('fa').format('dddd، jD jMMMM')
    : null;
  const time = appointment.from
    ? moment.unix(appointment.from).format('HH:mm')
    : appointment.book_time_string || null;

  const receiptUrl = appointment.center_id
    ? `/receipt/${appointment.center_id}/${appointment.book_id}`
    : null;

  const startVisitUrl = appointment.is_online_visit
    ? `https://messaging-back.paziresh24.com/api/external/conversations/${appointment.book_id}`
    : null;

  return (
    <div className="px-4 pb-4 pt-3">
      {/* تاریخ و ساعت */}
      {(date || time) && (
        <div className="mb-4 grid grid-cols-2 gap-3">
          {date && (
            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0 text-slate-400">
                <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
              </svg>
              <span className="text-sm font-medium text-slate-800">{date}</span>
            </div>
          )}
          {time && (
            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0 text-slate-400">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" strokeLinecap="round" />
              </svg>
              <span className="text-sm font-bold tabular-nums text-slate-800 ltr">{time}</span>
            </div>
          )}
        </div>
      )}

      {/* جدول اطلاعات */}
      <div className="rounded-2xl border border-slate-100 bg-white px-4 py-1">
        <Row label="نام و نام خانوادگی" value={appointment.patient_name} />
        {appointment.cell && <Row label="موبایل" value={appointment.cell} />}
        {appointment.national_code && <Row label="کدملی" value={appointment.national_code} />}
        {appointment.insurance_name && <Row label="بیمه" value={appointment.insurance_name} />}
        {appointment.track_code && <Row label="کد پیگیری" value={appointment.track_code} />}
        {appointment.payment_status && (
          <div className="flex items-baseline justify-between gap-4 py-2.5 border-b border-slate-100 last:border-0">
            <span className="shrink-0 text-sm text-slate-500">وضعیت پرداخت</span>
            <PaymentBadge status={appointment.payment_status} />
          </div>
        )}
        <Row label="نوع نوبت" value={appointment.is_online_visit ? 'ویزیت آنلاین' : 'حضوری'} />
        {appointment.source_site && <Row label="سایت نوبت‌دهی" value={appointment.source_site} />}
        {appointment.center_name && <Row label="مرکز" value={appointment.center_name} />}
        {appointment.service_name && <Row label="خدمت" value={appointment.service_name} />}
        {appointment.prescription && <Row label="توصیه درمانی" value={appointment.prescription} />}
      </div>

      {/* دکمه‌های اقدام */}
      <div className="mt-4 flex gap-3">
        {startVisitUrl && (
          <a href={startVisitUrl} target="_blank" rel="noreferrer" className="flex-1">
            <DsButton variant="primary" className="w-full">شروع ویزیت</DsButton>
          </a>
        )}
        {receiptUrl && (
          <a href={receiptUrl} target="_blank" rel="noreferrer" className={startVisitUrl ? '' : 'flex-1'}>
            <DsButton variant="secondary" className="w-full">پرونده بیمار</DsButton>
          </a>
        )}
      </div>
    </div>
  );
};

// ── All appointments list ─────────────────────────────────────────────────────

const AppointmentRow = ({ appointment, onSelect }: { appointment: UpcomingAppointment; onSelect?: () => void }) => {
  const time = appointment.from
    ? moment.unix(appointment.from).format('HH:mm')
    : appointment.book_time_string || '—';

  const startVisitUrl = appointment.is_online_visit
    ? `https://messaging-back.paziresh24.com/api/external/conversations/${appointment.book_id}`
    : null;

  return (
    <div
      className="rounded-2xl border border-slate-100 bg-white p-4 space-y-3"
      onClick={onSelect}
      role={onSelect ? 'button' : undefined}
      style={onSelect ? { cursor: 'pointer' } : undefined}
    >
      {/* ردیف اول: زمان + نام + badge نوع */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base font-bold tabular-nums text-primary ltr shrink-0">{time}</span>
          <span className="text-sm font-semibold text-slate-900 truncate">{appointment.patient_name}</span>
        </div>
        <DsBadge tone={appointment.is_online_visit ? 'online' : 'neutral'} className="shrink-0">
          {appointment.is_online_visit ? 'آنلاین' : 'حضوری'}
        </DsBadge>
      </div>

      {/* ردیف دوم: کدملی + موبایل */}
      {(appointment.national_code || appointment.cell) && (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {appointment.national_code && (
            <span className={classNames(ds.type.caption, 'tabular-nums')}>
              <span className="text-slate-400">کدملی: </span>{appointment.national_code}
            </span>
          )}
          {appointment.cell && (
            <span className={classNames(ds.type.caption, 'tabular-nums ltr')}>
              <span className="text-slate-400 ltr-override">موبایل: </span>{appointment.cell}
            </span>
          )}
        </div>
      )}

      {/* ردیف سوم: سایت + وضعیت پرداخت */}
      <div className="flex items-center justify-between gap-2">
        {appointment.source_site ? (
          <span className={classNames(ds.type.caption)}>{appointment.source_site}</span>
        ) : <span />}
        {appointment.payment_status && <PaymentBadge status={appointment.payment_status} />}
      </div>

      {/* دکمه‌ها */}
      {(startVisitUrl || onSelect) && (
        <div className="flex gap-2 pt-1" onClick={e => e.stopPropagation()}>
          {startVisitUrl && (
            <a href={startVisitUrl} target="_blank" rel="noreferrer" className="flex-1">
              <DsButton variant="primary" className="w-full text-sm">شروع ویزیت</DsButton>
            </a>
          )}
          {onSelect && (
            <DsButton variant="secondary" className="flex-1 text-sm" onClick={onSelect}>
              پرونده بیمار
            </DsButton>
          )}
        </div>
      )}
    </div>
  );
};

export const AllAppointmentsDrawerContent = ({
  items,
  todayCount,
  onSelectAppointment,
}: {
  items: UpcomingAppointment[];
  todayCount: number | null;
  onSelectAppointment?: (id: string) => void;
}) => (
  <div className="px-4 pb-8 pt-3 space-y-3">
    {items.map(appointment => (
      <AppointmentRow
        key={appointment.book_id}
        appointment={appointment}
        onSelect={onSelectAppointment ? () => onSelectAppointment(String(appointment.book_id)) : undefined}
      />
    ))}
    {todayCount != null && todayCount > items.length && (
      <p className={classNames(ds.type.caption, 'text-center pt-1')}>
        {(todayCount - items.length).toLocaleString('fa-IR')} نوبت دیگر در برنامه
      </p>
    )}
  </div>
);

// ── All reviews ───────────────────────────────────────────────────────────────

// نمای کامل جزئیات یک نظر + بخش پاسخ/گزارش/اشتراک‌گذاری
export const ReviewDetailContent = ({
  review,
  slug,
  doctorUserId,
}: {
  review: DoctorHomeFeedReview;
  slug?: string;
  doctorUserId?: string;
}) => {
  const description = removeHtmlTagInString(String(review.description ?? '')).trim();

  return (
    <div className="space-y-4 px-4 pb-8 pt-3">
      <ReviewHeader review={review} />
      {description ? (
        <div className={classNames(ds.radius.card, 'border border-slate-100 bg-slate-50 p-4')}>
          <p className={classNames(ds.type.cardBody, 'leading-7')}>{description}</p>
        </div>
      ) : (
        <p className={classNames(ds.type.caption, 'text-center')}>بدون متن</p>
      )}
      <ReviewReplySection
        feedbackId={review.id != null ? String(review.id) : undefined}
        slug={slug ?? review.doctorSlug}
        doctorUserId={doctorUserId}
        commentText={description}
      />
    </div>
  );
};

const ReviewListCard = ({
  review,
  onSelect,
}: {
  review: DoctorHomeFeedReview;
  onSelect?: (review: DoctorHomeFeedReview) => void;
}) => {
  const description = removeHtmlTagInString(String(review.description ?? '')).trim();
  const selectable = onSelect && review.id != null;

  return (
    <div
      role={selectable ? 'button' : undefined}
      onClick={selectable ? () => onSelect(review) : undefined}
      className={classNames(
        'space-y-3 rounded-2xl border border-slate-100 bg-white p-4',
        selectable && 'cursor-pointer transition-colors hover:bg-slate-50',
      )}
    >
      <ReviewHeader review={review} />
      {description && (
        <p className={classNames(ds.type.cardBody, 'line-clamp-3 leading-7 text-slate-700')}>{description}</p>
      )}
    </div>
  );
};

export const AllReviewsDrawerContent = ({
  items,
  onSelectReview,
}: {
  items: DoctorHomeFeedReview[];
  onSelectReview?: (review: DoctorHomeFeedReview) => void;
}) => (
  <div className="space-y-3 px-4 pb-8 pt-3">
    {items.map((review, index) => (
      <ReviewListCard key={review.id ?? index} review={review} onSelect={onSelectReview} />
    ))}
  </div>
);

// لیست همه‌ی نظرها با صفحه‌بندی واقعی (offset) — به‌ترتیب ثبت، با لود خودکار هنگام رسیدن به انتها
export const PaginatedReviewsList = ({
  slug,
  onSelectReview,
}: {
  slug?: string;
  onSelectReview?: (review: DoctorHomeFeedReview) => void;
}) => {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useReviewsInfinite(slug);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const reviews = (data?.pages ?? [])
    .flatMap(page => page.list ?? [])
    .map(item => mapRawReviewToFeed(item, slug));

  // لود خودکار صفحه‌ی بعد وقتی sentinel دیده میشه
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNextPage || typeof IntersectionObserver === 'undefined') return;
    const ob = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting && !isFetchingNextPage) fetchNextPage();
    }, { rootMargin: '200px' });
    ob.observe(el);
    return () => ob.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <p className={classNames(ds.type.caption, 'px-4 pb-8 pt-6 text-center')}>در حال بارگذاری نظرها…</p>;
  }
  if (isError && reviews.length === 0) {
    return <p className={classNames(ds.type.caption, 'px-4 pb-8 pt-6 text-center')}>بارگذاری نظرها ممکن نشد.</p>;
  }
  if (reviews.length === 0) {
    return <p className={classNames(ds.type.caption, 'px-4 pb-8 pt-6 text-center')}>هنوز نظری ثبت نشده است.</p>;
  }

  return (
    <div className="space-y-3 px-4 pb-8 pt-3">
      {reviews.map((review, index) => (
        <ReviewListCard key={review.id ?? index} review={review} onSelect={onSelectReview} />
      ))}
      <div ref={sentinelRef} />
      {isFetchingNextPage && (
        <p className={classNames(ds.type.caption, 'text-center')}>در حال بارگذاری بیشتر…</p>
      )}
      {!hasNextPage && (
        <p className={classNames(ds.type.caption, 'text-center')}>پایان نظرها</p>
      )}
    </div>
  );
};
