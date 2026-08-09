import Button from '@/common/components/atom/button/button';
import Modal from '@/common/components/atom/modal/modal';
import useModal from '@/common/hooks/useModal';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import * as Popover from '@radix-ui/react-popover';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { deleteFeedback, editFeedback, reportFeedback } from '../api';

const REPORT_REASONS = [
  'نامربوط',
  'غیرواقعی',
  'تضاد منافع',
  'توهین یا فحاشی',
  'اطلاعات شخصی',
  'موارد دیگر',
] as const;

interface RaviReviewOptionsProps {
  feedbackId: string;
  reviewUserId?: string;
  commentText: string;
  doctorSlug?: string;
  onDeleted?: () => void;
  onEdited?: (description: string) => void;
}

const menuItemClass =
  'flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-right text-sm text-slate-700 transition-colors hover:bg-slate-50';

const DotsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-slate-500">
    <circle cx="12" cy="5" r="1.75" />
    <circle cx="12" cy="12" r="1.75" />
    <circle cx="12" cy="19" r="1.75" />
  </svg>
);

export const RaviReviewOptions = ({
  feedbackId,
  reviewUserId,
  commentText,
  doctorSlug,
  onDeleted,
  onEdited,
}: RaviReviewOptionsProps) => {
  const { isLogin, currentUserId } = useUserInfoStore(state => ({
    isLogin: state.isLogin,
    currentUserId: state.info?.id,
  }));
  const { handleOpenLoginModal } = useLoginModalContext();

  const [menuOpen, setMenuOpen] = useState(false);
  const [editText, setEditText] = useState(commentText);
  const [reportReason, setReportReason] = useState<string>(REPORT_REASONS[0]);
  const [reportOtherText, setReportOtherText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editModal = useModal();
  const deleteModal = useModal();
  const reportModal = useModal();

  const isOwner =
    isLogin &&
    currentUserId != null &&
    reviewUserId != null &&
    String(currentUserId) === String(reviewUserId);

  const isOtherReport = reportReason === 'موارد دیگر';

  useEffect(() => {
    setEditText(commentText);
  }, [commentText]);

  const requireLogin = useCallback(() => {
    handleOpenLoginModal({ state: true });
  }, [handleOpenLoginModal]);

  const openEdit = () => {
    setMenuOpen(false);
    if (!isLogin) {
      requireLogin();
      return;
    }
    setEditText(commentText);
    editModal.handleOpen();
  };

  const openDelete = () => {
    setMenuOpen(false);
    if (!isLogin) {
      requireLogin();
      return;
    }
    deleteModal.handleOpen();
  };

  const openReport = () => {
    setMenuOpen(false);
    if (!isLogin) {
      requireLogin();
      return;
    }
    setReportReason(REPORT_REASONS[0]);
    setReportOtherText('');
    reportModal.handleOpen();
  };

  const handleEdit = async () => {
    const description = editText.trim();
    if (!description) {
      toast.error('لطفا متنی را وارد کنید');
      return;
    }

    setIsSubmitting(true);
    try {
      await editFeedback({ feedbackId, description });
      onEdited?.(description);
      editModal.handleClose();
      toast.success('نظر شما پس از بررسی و با استناد به قوانین پذیرش۲۴ ویرایش خواهد شد.');
    } catch {
      toast.error('ویرایش نظر ناموفق بود. دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteFeedback(feedbackId);
      onDeleted?.();
      deleteModal.handleClose();
      toast.success('نظر شما با موفقیت حذف شد.');
    } catch {
      toast.error('حذف نظر ناموفق بود. دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReport = async () => {
    if (!doctorSlug) {
      toast.error('slug پزشک مشخص نیست.');
      return;
    }

    if (isOtherReport && reportOtherText.trim().length < 10) {
      toast.error('حداقل مقدار مجاز ۱۰ کاراکتر می باشد.');
      return;
    }

    setIsSubmitting(true);
    try {
      await reportFeedback({
        feedbackId,
        slug: doctorSlug,
        feedbackDescription: commentText,
        reportDescription: isOtherReport ? reportOtherText.trim() : '',
        reportReason,
        userId: currentUserId != null ? String(currentUserId) : undefined,
      });
      reportModal.handleClose();
      toast.success('گزارش شما ثبت شد.');
    } catch {
      toast.error('ثبت گزارش ناموفق بود. دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
            aria-label="گزینه‌های نظر"
          >
            <DotsIcon />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            side="bottom"
            align="end"
            sideOffset={4}
            collisionPadding={8}
            className="z-50 min-w-[10rem] rounded-xl border border-slate-200 bg-white p-1 shadow-[0_4px_16px_0_rgba(0,0,0,0.12)] outline-none"
            dir="rtl"
          >
            {isOwner ? (
              <>
                <button type="button" className={menuItemClass} onClick={openEdit}>
                  ویرایش
                </button>
                <button type="button" className={`${menuItemClass} text-rose-600`} onClick={openDelete}>
                  حذف
                </button>
              </>
            ) : null}
            <button type="button" className={menuItemClass} onClick={openReport}>
              گزارش
            </button>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {editModal.modalProps.isOpen ? (
        <Modal title="ویرایش نظر" {...editModal.modalProps}>
          <div className="space-y-4" dir="rtl">
            <textarea
              value={editText}
              onChange={event => setEditText(event.target.value)}
              rows={5}
              className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:border-slate-300"
              placeholder="متن نظر خود را بنویسید"
            />
            <Button block loading={isSubmitting} onClick={handleEdit}>
              ثبت ویرایش
            </Button>
          </div>
        </Modal>
      ) : null}

      {deleteModal.modalProps.isOpen ? (
        <Modal title="حذف نظر" {...deleteModal.modalProps}>
          <div className="space-y-4" dir="rtl">
            <p className="text-sm leading-7 text-slate-600">آیا از حذف این نظر اطمینان دارید؟</p>
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={deleteModal.handleClose}>
                انصراف
              </Button>
              <Button theme="error" className="flex-1" loading={isSubmitting} onClick={handleDelete}>
                حذف
              </Button>
            </div>
          </div>
        </Modal>
      ) : null}

      {reportModal.modalProps.isOpen ? (
        <Modal title="گزارش نظر" {...reportModal.modalProps}>
          <div className="space-y-3" dir="rtl">
            <p className="text-sm text-slate-600">دلیل گزارش این نظر را انتخاب کنید.</p>
            <div className="space-y-1">
              {REPORT_REASONS.map(reason => (
                <label
                  key={reason}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm transition-colors ${
                    reportReason === reason ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`report-${feedbackId}`}
                    checked={reportReason === reason}
                    onChange={() => setReportReason(reason)}
                    className="accent-blue-600"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
            {isOtherReport ? (
              <textarea
                value={reportOtherText}
                onChange={event => setReportOtherText(event.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:border-slate-300"
                placeholder="توضیح دهید (حداقل ۱۰ کاراکتر)"
              />
            ) : null}
            <Button block loading={isSubmitting} onClick={handleReport}>
              ثبت گزارش
            </Button>
          </div>
        </Modal>
      ) : null}
    </>
  );
};
