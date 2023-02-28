import Opener from '@/common/components/atom/opener/opener';
import Text from '@/common/components/atom/text/text';
import AtomIcon from '@/common/components/icons/atom';
import AwardIcon from '@/common/components/icons/award';
import ReceiptIcon from '@/common/components/icons/receipt';
import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';
import clsx from 'clsx';
import { useMemo } from 'react';

interface BiographyProps {
  biography?: string;
  awards?: string;
  scientific?: string;
  className?: string;
}

export const Biography = (props: BiographyProps) => {
  const { biography, awards, scientific, className } = props;

  const needShowMore = useMemo(() => {
    const bio = (biography ?? '') + (awards ?? '') + (scientific ?? '');
    return removeHtmlTagInString(bio).length >= 750;
  }, [biography, awards, scientific]);

  const Wrapper = needShowMore ? Opener : 'div';

  return (
    <Wrapper
      {...(needShowMore && { height: 200, openButtonText: 'مشاهده بیشتر', closeButtonText: 'مشاهده کمتر' })}
      className={clsx('p-4', className)}
    >
      <div className="flex flex-col space-y-3">
        {biography && (
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-s-1">
              <ReceiptIcon className="w-5 h-5" />
              <Text fontWeight="bold" fontSize="sm">
                بیوگرافی
              </Text>
            </div>
            <Text className="leading-6" align="justify" fontSize="sm" dangerouslySetInnerHTML={{ __html: biography }} />
          </div>
        )}
        {awards && (
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-s-1">
              <AwardIcon className="w-6 h-6" />
              <Text fontWeight="bold" fontSize="sm">
                دستاوردها
              </Text>
            </div>
            <Text className="leading-6" align="justify" fontSize="sm" dangerouslySetInnerHTML={{ __html: awards }} />
          </div>
        )}
        {scientific && (
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-s-1">
              <AtomIcon className="w-6 h-6" />
              <Text fontWeight="bold" fontSize="sm">
                سوابق علمی
              </Text>
            </div>
            <Text className="leading-6" align="justify" fontSize="sm" dangerouslySetInnerHTML={{ __html: scientific }} />
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default Biography;
