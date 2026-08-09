import Modal, { ModalProps } from '@/common/components/atom/modal';
import useResponsive from '@/common/hooks/useResponsive';
import classNames from '@/common/utils/classNames';

type HamdastAppModalProps = Pick<ModalProps, 'isOpen' | 'onClose' | 'title' | 'children' | 'noHeader' | 'noLine'> & {
  fullScreenOnDesktop?: boolean;
  /**
   * اجرای تقریبا تمام‌صفحه در دسکتاپ (layout.fullscreen اپ) — لبه‌های صفحه از پشت
   * دیده می‌شوند و کلیک روی پس‌زمینه مودال را می‌بندد. در موبایل اثری ندارد.
   */
  runFullscreen?: boolean;
};

export const HamdastAppModal = ({
  isOpen,
  onClose,
  title,
  children,
  fullScreenOnDesktop = true,
  runFullscreen = false,
  noHeader = false,
  noLine = false,
}: HamdastAppModalProps) => {
  const { isMobile } = useResponsive();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      noHeader={noHeader}
      noLine={noLine}
      fullScreen={fullScreenOnDesktop && !isMobile}
      className={classNames(
        isMobile ? '!h-[90vh] !max-h-[90vh] !min-h-0 !overflow-hidden' : '!min-h-0 !overflow-hidden',
        !isMobile && 'transition-[width] duration-300',
        !isMobile && runFullscreen && 'md:!w-[calc(100vw_-_6rem)] md:!max-w-none',
      )}
      bodyClassName="flex min-h-0 flex-1 flex-col !overflow-hidden overscroll-contain p-0"
    >
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
    </Modal>
  );
};

export default HamdastAppModal;
