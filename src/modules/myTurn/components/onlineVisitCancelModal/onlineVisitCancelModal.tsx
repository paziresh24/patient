import Button from '@/common/components/atom/button';
import Loading from '@/common/components/atom/loading/loading';
import Modal, { ModalProps } from '@/common/components/atom/modal/modal';
import ChevronIcon from '@/common/components/icons/chevron';
import OfficeIcon from '@/common/components/icons/office';
import classNames from '@/common/utils/classNames';
import { ReactNode } from 'react';

export interface CancelReason {
  id: number;
  text: string;
  value: string;
}

interface OnlineVisitCancelModalProps {
  modalProps: Pick<ModalProps, 'isOpen' | 'onClose'>;
  title?: string;
  confirmLabel?: string;
  selectedReason: string | null;
  onReasonChange: (reason: string) => void;
  onConfirm: () => void;
  onBookInPerson?: () => void;
  reasons: CancelReason[];
  isLoading?: boolean;
  isBookInPersonLoading?: boolean;
  showInPersonBanner?: boolean;
  children?: ReactNode;
}

export const OnlineVisitCancelModal = ({
  modalProps,
  title = 'لغو نوبت ویزیت آنلاین',
  confirmLabel = 'لغو نوبت',
  selectedReason,
  onReasonChange,
  onConfirm,
  onBookInPerson,
  reasons,
  isLoading,
  isBookInPersonLoading,
  showInPersonBanner = true,
  children,
}: OnlineVisitCancelModalProps) => {
  return (
    <Modal title={title} {...modalProps} bodyClassName="!p-4" className="md:!w-[26rem]">
      <div dir="rtl">
        {showInPersonBanner && onBookInPerson && (
          <button
            type="button"
            onClick={onBookInPerson}
            disabled={isBookInPersonLoading || isLoading}
            className="mb-4 flex w-full items-center space-s-3 rounded-2xl border border-[#B8D4FE] bg-[#F0F6FF] px-4 py-3.5 text-right transition-colors hover:bg-[#E6F0FF] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#DBE8FE] text-primary">
              {isBookInPersonLoading ? <Loading className="fill-primary" width={20} height={20} /> : <OfficeIcon className="h-5 w-5" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold leading-6 text-primary">اشتباهی آنلاین گرفتید؟</p>
              <p className="text-xs leading-5 text-slate-600">نوبت حضوری همین پزشک را بگیرید</p>
            </div>
            {!isBookInPersonLoading && <ChevronIcon dir="left" className="shrink-0 text-primary" width="8" height="12" />}
          </button>
        )}

        <div className="mb-4 flex items-center space-s-2">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="shrink-0 text-[11px] text-slate-400">یا دلیل لغو را انتخاب کنید</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="mb-4 flex w-full flex-wrap justify-start gap-1.5">
          {reasons.map(reason => (
            <button
              key={reason.id}
              type="button"
              onClick={() => onReasonChange(reason.value)}
              className={classNames(
                'rounded-full border bg-white px-3 py-1.5 text-xs font-medium leading-5 transition-colors',
                selectedReason === reason.value
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-slate-200 text-slate-700 hover:border-slate-300',
              )}
            >
              {reason.text}
            </button>
          ))}
        </div>

        {children}

        <div className="flex space-s-2">
          <Button
            theme="error"
            block
            onClick={onConfirm}
            loading={isLoading}
            disabled={!selectedReason}
            data-testid="modal__remove-turn-button"
          >
            {confirmLabel}
          </Button>
          <Button
            variant="secondary"
            block
            onClick={modalProps.onClose}
            data-testid="modal__cancel-remove-turn-button"
          >
            انصراف
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default OnlineVisitCancelModal;
