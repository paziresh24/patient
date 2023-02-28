import Chips from '@/common/components/atom/chips';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import InfoIcon from '@/common/components/icons/info';
import useModal from '@/common/hooks/useModal';
import clsx from 'clsx';
import { categoryIcons } from '../../constants/suggestion/categoryIcons';

export interface BadgeProps {
  icon?: `${'star' | 'smile' | 'clock'}-icon`;
  title: string;
  type: 'info' | 'success';
  description?: string;
}

const badgeStyles = {
  type: {
    info: 'bg-[#e5f6fd] text-blue-700',
    success: 'bg-[#eafaee] !text-green-700',
  },
};

export const Badge = (props: BadgeProps) => {
  const { icon, title, description, type } = props;
  const { handleOpen, modalProps } = useModal();

  return (
    <>
      <Chips
        className={clsx(
          'md:!p-2 h-8 cursor-default md:h-10 !px-2 md:!px-2 !rounded-md flex justify-center items-center',
          badgeStyles.type[type],
          {
            '!cursor-pointer': description,
          },
        )}
        icon={icon && categoryIcons[icon]?.()}
        onClick={() => description && handleOpen()}
      >
        <div className="flex items-center">
          {title}
          {description && <InfoIcon className="w-5 h-5 mr-1" />}
        </div>
      </Chips>
      <Modal {...modalProps} noHeader>
        <Text fontSize="sm" fontWeight="medium">
          {description}
        </Text>
      </Modal>
    </>
  );
};
export default Badge;
