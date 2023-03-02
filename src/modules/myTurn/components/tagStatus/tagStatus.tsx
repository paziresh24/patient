import Chips from '@/components/atom/chips';
import { BookStatus } from '@/modules/myTurn/types/bookStatus';
import classNames from '@/common/utils/classNames';
import useTranslation from 'next-translate/useTranslation';

export interface TagStatusProps {
  /**
   * Status of the turn
   */
  status: BookStatus;
  className?: string;
}

export const TagStatus: React.FC<TagStatusProps> = props => {
  const { status, className } = props;
  const { t } = useTranslation('patient/appointments');

  return (
    <Chips className={classNames(className, 'absolute top-2')} data-testid="tag-status">
      {t(`turnStatus.${[status as BookStatus]}`)}
    </Chips>
  );
};

export default TagStatus;
