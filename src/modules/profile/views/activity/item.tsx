import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import InfoIcon from '@/common/components/icons/info';
import useModal from '@/common/hooks/useModal';
import { ReactNode } from 'react';

export interface ItemProps {
  text: string | ReactNode;
  icon: ReactNode;
  hint?: string;
}

export const Item = (props: ItemProps) => {
  const { icon, hint, text } = props;
  const { modalProps, handleOpen } = useModal();

  return (
    <>
      <div className="flex items-center p-4 rounded-lg space-s-2 bg-slate-100">
        {icon}
        {typeof text === 'string' ? <Text fontSize="sm" dangerouslySetInnerHTML={{ __html: text }} /> : text}
        {hint && <InfoIcon className="w-5 h-5 opacity-80 cursor-pointer !mr-1" onClick={handleOpen} />}
      </div>
      <Modal {...modalProps} noHeader>
        <Text fontSize="sm" fontWeight="medium">
          {hint}
        </Text>
      </Modal>
    </>
  );
};
