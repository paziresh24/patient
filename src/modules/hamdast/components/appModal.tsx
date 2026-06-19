import Modal, { ModalProps } from '@/common/components/atom/modal';
import useResponsive from '@/common/hooks/useResponsive';

type HamdastAppModalProps = Pick<ModalProps, 'isOpen' | 'onClose' | 'title' | 'children' | 'noHeader' | 'noLine'> & {
  fullScreenOnDesktop?: boolean;
};

export const HamdastAppModal = ({
  isOpen,
  onClose,
  title,
  children,
  fullScreenOnDesktop = true,
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
      className={isMobile ? '!h-[90vh] !max-h-[90vh] !min-h-0 overflow-hidden' : '!min-h-0 overflow-hidden'}
      bodyClassName="flex min-h-0 flex-1 flex-col overflow-hidden p-0"
    >
      <div className="flex h-full min-h-0 flex-1 flex-col">{children}</div>
    </Modal>
  );
};

export default HamdastAppModal;
