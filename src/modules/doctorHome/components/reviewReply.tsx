'use client';
import classNames from '@/common/utils/classNames';
import { useQueryClient } from '@tanstack/react-query';
import { PointerEvent as ReactPointerEvent, ReactNode, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  FEEDBACK_REPLY_KEY,
  REPORT_REASONS,
  useDeleteReply,
  useEditReply,
  useFeedbackReply,
  useReportFeedback,
  useShareCommentUrl,
  useSubmitReply,
} from '../apis/reviewInteractions';
import { DsButton, ds } from '../designSystem';

// ── BottomSheet مستقل و stack-aware (پورتال به body، بدون vaul) ───────────────────
//
// چرا custom و نه vaul؟ vaul روی Radix Dialog ساخته شده که در حالت modal روی
// document.body مقدار pointer-events:none می‌ذاره. هر شیتِ پورتالیِ خواهر (مثل
// report/share که روی شیت دیتیل باز میشن) این none رو ارث می‌بره و کلیک‌ناپذیر میشه.
// این کامپوننت با pointer-events:auto صریح کاملاً مستقل کار می‌کنه و چند شیت رو
// به‌ترتیب روی هم مدیریت می‌کنه (z-index پلکانی + استک تاریخچه برای دکمه‌ی back).

// شمارنده‌ی سراسری برای ترتیب z-index شیت‌های هم‌زمان باز
let openSheetOrder = 0;

const BottomSheet = ({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [zIndex, setZIndex] = useState(300);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // درگ‌به‌پایین برای بستن (مثل شیت‌های vaul)
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startY = useRef(0);
  const offsetRef = useRef(0);

  const onDragStart = (e: ReactPointerEvent) => {
    startY.current = e.clientY;
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onDragMove = (e: ReactPointerEvent) => {
    if (!dragging) return;
    const d = Math.max(0, e.clientY - startY.current);
    offsetRef.current = d;
    setOffset(d);
  };
  const onDragEnd = (e: ReactPointerEvent) => {
    if (!dragging) return;
    setDragging(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    const dismissed = offsetRef.current > 120;
    offsetRef.current = 0;
    setOffset(0);
    if (dismissed) onClose();
  };

  // mount/animation جدا تا انیمیشن ورود و خروج کامل بشه
  useEffect(() => {
    if (open) {
      setMounted(true);
      // double rAF: اول حالت translateY(100%) نقاشی بشه، بعد به 0 سُر بخوره (وگرنه پرشی باز میشه)
      let id2 = 0;
      const id1 = requestAnimationFrame(() => {
        id2 = requestAnimationFrame(() => setVisible(true));
      });
      return () => { cancelAnimationFrame(id1); cancelAnimationFrame(id2); };
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), 300);
    return () => clearTimeout(t);
  }, [open]);

  // ترتیب z-index: هر شیتی که باز میشه بالاتر از قبلی می‌شینه
  useEffect(() => {
    if (!open) return;
    openSheetOrder += 1;
    setZIndex(300 + openSheetOrder * 10);
    return () => { openSheetOrder -= 1; };
  }, [open]);

  // قفل اسکرول body
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // مدیریت استک تاریخچه: دکمه‌ی back گوشی/مرورگر شیتِ بالای استک رو می‌بنده.
  // باز شدن → یک entry push میشه؛ بستن با back → خودش pop شده؛ بستن دستی → entry رو back می‌زنیم.
  useEffect(() => {
    if (!open) return;
    let poppedByBack = false;
    const onPop = () => { poppedByBack = true; onCloseRef.current(); };
    window.history.pushState({ __dsSheet: true }, '');
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      if (!poppedByBack) window.history.back();
    };
  }, [open]);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    // pointer-events:auto لازم است چون body در حالت modalِ Radix روی none است
    <div className="fixed inset-0" style={{ zIndex, pointerEvents: 'auto' }} dir="rtl">
      <div
        className={classNames('absolute inset-0 bg-black/50 transition-opacity duration-300', visible ? 'opacity-100' : 'opacity-0')}
        style={{ pointerEvents: 'auto' }}
        onClick={onClose}
      />
      <div
        className="absolute inset-x-0 bottom-0 flex max-h-[90vh] flex-col rounded-t-[24px] bg-white"
        style={{
          pointerEvents: 'auto',
          transform: visible ? `translateY(${offset}px)` : 'translateY(100%)',
          transition: dragging ? 'none' : 'transform 300ms ease-out',
        }}
      >
        {/* ناحیه‌ی درگ: دستگیره + عنوان — کشیدن به پایین شیت رو می‌بنده */}
        <div
          className="shrink-0 cursor-grab touch-none select-none active:cursor-grabbing"
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
        >
          <div className="mx-auto mt-3.5 mb-1 h-1 w-10 rounded-full bg-slate-200" />
          <div className="border-b border-slate-100 px-5 py-3 text-base font-bold text-slate-900">{title}</div>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>,
    document.body,
  );
};

interface ReviewActionsProps {
  feedbackId?: string;
  slug?: string;
  doctorUserId?: string;
  commentText?: string;
}

// ── محتوای شیت اشتراک‌گذاری ───────────────────────────────────────────────────────

const ShareSheetContent = ({ slug, feedbackId }: { slug?: string; feedbackId?: string }) => {
  const { data: shareUrl, isLoading } = useShareCommentUrl(slug, feedbackId);
  const [copied, setCopied] = useState(false);

  const url = shareUrl ?? '';
  const enc = encodeURIComponent(url);
  const targets = [
    { label: 'تلگرام', href: `https://telegram.me/share/url?url=${enc}`, bg: 'bg-sky-50', color: 'text-sky-600' },
    { label: 'واتساپ', href: `https://wa.me/?text=${enc}`, bg: 'bg-green-50', color: 'text-green-600' },
    { label: 'ایتا', href: `https://eitaa.com/share/url?url=${enc}`, bg: 'bg-orange-50', color: 'text-orange-600' },
    { label: 'توییتر', href: `https://twitter.com/intent/tweet/?url=${enc}`, bg: 'bg-slate-100', color: 'text-slate-700' },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  if (isLoading || !shareUrl) {
    return <p className={classNames(ds.type.caption, 'px-4 pb-8 pt-4 text-center')}>در حال آماده‌سازی لینک…</p>;
  }

  return (
    <div className="px-4 pb-8 pt-3">
      <div className="grid grid-cols-4 gap-3">
        {targets.map(t => (
          <a
            key={t.label}
            href={t.href}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-2"
          >
            <span className={classNames('flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-bold', t.bg, t.color)}>
              {t.label[0]}
            </span>
            <span className={ds.type.caption}>{t.label}</span>
          </a>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-2xl border border-slate-200 p-2 pr-3">
        <span className="flex-1 truncate text-xs text-slate-500 ltr">{url}</span>
        <DsButton variant="secondary" onClick={copy} className="shrink-0">
          {copied ? 'کپی شد ✓' : 'کپی لینک'}
        </DsButton>
      </div>
    </div>
  );
};

// ── محتوای شیت گزارش ──────────────────────────────────────────────────────────────

const ReportSheetContent = ({
  feedbackId,
  commentText,
  doctorSlug,
  onDone,
}: {
  feedbackId: string;
  commentText?: string;
  doctorSlug?: string;
  onDone: () => void;
}) => {
  const groupName = useId();
  const [reason, setReason] = useState<string>(REPORT_REASONS[0]);
  const [otherText, setOtherText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const reportMutation = useReportFeedback();

  const isOther = reason === REPORT_REASONS[REPORT_REASONS.length - 1];
  const reportText = isOther ? otherText.trim() : reason;
  const valid = isOther ? otherText.trim().length >= 10 : true;

  const submit = async () => {
    if (!valid) {
      setError('برای «موارد دیگر» حداقل ۱۰ کاراکتر بنویسید.');
      return;
    }
    setError(null);
    try {
      await reportMutation.mutateAsync({ feedbackId, reportText, commentText, doctorSlug });
      onDone();
    } catch {
      setError('ثبت گزارش ناموفق بود. دوباره تلاش کنید.');
    }
  };

  return (
    <div className="px-4 pb-8 pt-3">
      <p className={classNames(ds.type.caption, 'mb-3')}>
        دلیل گزارش این نظر را انتخاب کنید. پس از بررسی توسط پاذیرش۲۴ اقدام لازم انجام می‌شود.
      </p>

      <div className="space-y-1">
        {REPORT_REASONS.map(r => (
          <label
            key={r}
            className={classNames(
              'flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-3 transition-colors',
              reason === r ? 'border-primary bg-primary/5' : 'border-slate-200 hover:bg-slate-50',
            )}
          >
            <input
              type="radio"
              name={groupName}
              checked={reason === r}
              onChange={() => setReason(r)}
              className="accent-primary"
            />
            <span className="text-sm text-slate-700">{r}</span>
          </label>
        ))}
      </div>

      {isOther && (
        <textarea
          value={otherText}
          onChange={e => setOtherText(e.target.value)}
          rows={3}
          dir="rtl"
          placeholder="توضیح دهید (حداقل ۱۰ کاراکتر)…"
          className="mt-3 w-full resize-none rounded-2xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:border-primary"
        />
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      <DsButton variant="primary" className="mt-4 w-full" onClick={submit}>
        {reportMutation.isLoading ? 'در حال ثبت…' : 'ثبت گزارش'}
      </DsButton>
    </div>
  );
};

// ── بخش اصلی اقدامات نظر ────────────────────────────────────────────────────────

export const ReviewReplySection = ({ feedbackId, slug, doctorUserId, commentText }: ReviewActionsProps) => {
  const queryClient = useQueryClient();
  const { data: reply, isLoading } = useFeedbackReply(slug, feedbackId);

  const submitMutation = useSubmitReply();
  const editMutation = useEditReply();
  const deleteMutation = useDeleteReply();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [reported, setReported] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(reply?.description ?? '');
  }, [reply?.description]);

  const refreshReply = () =>
    queryClient.invalidateQueries({ queryKey: FEEDBACK_REPLY_KEY(slug, feedbackId) });

  const busy = submitMutation.isLoading || editMutation.isLoading || deleteMutation.isLoading;

  const handleSubmit = async () => {
    if (!feedbackId || !draft.trim()) return;
    setError(null);
    try {
      if (reply) {
        await editMutation.mutateAsync({ replyId: reply.id, description: draft.trim() });
      } else {
        await submitMutation.mutateAsync({ feedbackId, description: draft.trim(), doctorId: doctorUserId });
      }
      setEditing(false);
      await refreshReply();
    } catch {
      setError('ثبت پاسخ ناموفق بود. دوباره تلاش کنید.');
    }
  };

  const handleDelete = async () => {
    if (!reply) return;
    setError(null);
    try {
      await deleteMutation.mutateAsync({ replyId: reply.id });
      setEditing(false);
      setDraft('');
      await refreshReply();
    } catch {
      setError('حذف پاسخ ناموفق بود.');
    }
  };

  if (!feedbackId) return null;

  const showInput = editing || (!reply && !isLoading);

  return (
    <div className="space-y-3 border-t border-slate-100 pt-3">
      {/* اکشن‌بار: گزارش + اشتراک‌گذاری */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-800">پاسخ شما</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowShare(true)}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-primary"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" strokeLinecap="round" />
            </svg>
            اشتراک‌گذاری
          </button>
          <button
            type="button"
            onClick={() => setShowReport(true)}
            disabled={reported}
            className={classNames(
              'flex items-center gap-1 text-xs font-medium transition-colors',
              reported ? 'text-slate-400' : 'text-red-500 hover:text-red-600',
            )}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
              <path d="M4 21V4a1 1 0 0 1 1-1h11l-2 4 2 4H5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {reported ? 'گزارش ثبت شد' : 'گزارش'}
          </button>
        </div>
      </div>

      {/* پاسخ موجود */}
      {reply && !editing && (
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className={classNames(ds.type.cardBody, 'leading-7 text-slate-700')}>{reply.description}</p>
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => { setDraft(reply.description); setEditing(true); }}
              className="text-xs font-bold text-primary hover:underline"
            >
              ویرایش
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isLoading}
              className="text-xs font-bold text-red-500 hover:underline disabled:opacity-50"
            >
              {deleteMutation.isLoading ? 'در حال حذف…' : 'حذف'}
            </button>
          </div>
        </div>
      )}

      {/* ورودی ثبت/ویرایش پاسخ */}
      {showInput && (
        <div className="space-y-2">
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            rows={3}
            dir="rtl"
            placeholder="پاسخ خود را بنویسید…"
            className="w-full resize-none rounded-2xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:border-primary"
          />
          <div className="flex gap-2">
            <DsButton variant="primary" className="flex-1" onClick={handleSubmit}>
              {busy ? 'در حال ثبت…' : reply ? 'ذخیره ویرایش' : 'ثبت پاسخ'}
            </DsButton>
            {editing && (
              <DsButton
                variant="secondary"
                className="flex-1"
                onClick={() => { setEditing(false); setDraft(reply?.description ?? ''); }}
              >
                انصراف
              </DsButton>
            )}
          </div>
        </div>
      )}

      {isLoading && !reply && <p className={ds.type.caption}>در حال بررسی پاسخ…</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* شیت اشتراک‌گذاری — مستقل (پورتال به body) */}
      <BottomSheet open={showShare} onClose={() => setShowShare(false)} title="اشتراک‌گذاری نظر">
        <ShareSheetContent slug={slug} feedbackId={feedbackId} />
      </BottomSheet>

      {/* شیت گزارش — مستقل (پورتال به body) */}
      <BottomSheet open={showReport} onClose={() => setShowReport(false)} title="گزارش نظر">
        <ReportSheetContent
          feedbackId={feedbackId}
          commentText={commentText}
          doctorSlug={slug}
          onDone={() => { setReported(true); setShowReport(false); }}
        />
      </BottomSheet>
    </div>
  );
};
