import Button from '@/common/components/atom/button/button';
import { useRaviDoctorReply } from '../composables/useRaviDoctorReply';
import { RaviReviewReply } from './RaviReviewReply';

export type RaviDoctorReplyState = ReturnType<typeof useRaviDoctorReply>;

interface RaviDoctorReplyPartsProps {
  state: RaviDoctorReplyState;
}

export const RaviDoctorReplyToolbarButton = ({ state }: RaviDoctorReplyPartsProps) => {
  if (!state.showReplyButton) return null;

  return (
    <button
      type="button"
      onClick={state.openForm}
      className="inline-flex items-center gap-0.5 text-sm leading-none text-slate-600"
    >
      <span>پاسخ به نظر</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
        <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

export const RaviDoctorReplyPanel = ({ state }: RaviDoctorReplyPartsProps) => {
  const {
    isDoctor,
    isLoading,
    reply,
    showForm,
    draft,
    setDraft,
    openForm,
    closeForm,
    handleSubmit,
    handleDelete,
    busy,
    isEditing,
    showPanel,
    doctorUserId,
  } = state;

  if (!showPanel) {
    if (isDoctor && isLoading) {
      return <p className="mt-3 text-xs text-slate-400">در حال بررسی پاسخ…</p>;
    }
    return null;
  }

  if (reply && !showForm) {
    return (
      <div className="mt-3 pt-1">
        <RaviReviewReply
          description={reply.description}
          userId={reply.userId ?? doctorUserId}
          doctorUserId={doctorUserId}
        />
        {isDoctor ? (
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={openForm}
              className="text-xs font-bold text-primary hover:underline"
            >
              ویرایش
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={busy}
              className="text-xs font-bold text-red-500 hover:underline disabled:opacity-50"
            >
              {busy ? 'در حال حذف…' : 'حذف'}
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-2" dir="rtl">
      <span className="text-sm font-semibold text-slate-800">پاسخ شما</span>
      <textarea
        value={draft}
        onChange={event => setDraft(event.target.value)}
        rows={3}
        autoFocus
        placeholder="پاسخ خود را بنویسید…"
        className="w-full resize-none rounded-2xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:border-primary"
      />
      <div className="flex gap-2">
        <Button variant="primary" className="flex-1" onClick={handleSubmit} loading={busy}>
          {isEditing ? 'ذخیره ویرایش' : 'ثبت پاسخ'}
        </Button>
        <Button variant="secondary" className="flex-1" onClick={closeForm}>
          انصراف
        </Button>
      </div>
    </div>
  );
};

export { useRaviDoctorReply };
