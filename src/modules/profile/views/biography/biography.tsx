import Opener from '@/common/components/atom/opener/opener';
import Text from '@/common/components/atom/text/text';
import AtomIcon from '@/common/components/icons/atom';
import AwardIcon from '@/common/components/icons/award';
import ReceiptIcon from '@/common/components/icons/receipt';
import classNames from '@/common/utils/classNames';
import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';
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

  // {
  //   !biography && !awards && !scientific && editable && (
  //     <div
  //       onClick={() => handleViewAs('biography')}
  //       className="flex items-center justify-center p-5 mx-4 transition-all border-2 border-dashed rounded-lg cursor-pointer md:mx-0 hover:bg-slate-200/30 space-s-2 text-slate-400 border-slate-200"
  //     >
  //       <AddIcon className="w-5 h-5" />
  //       <Text fontWeight="medium">نوشتن بیوگرافی</Text>
  //     </div>
  //   );
  // }
  // {
  //   (biography || awards || scientific) && <Biography {...{ biography, awards, scientific }} className="bg-white md:rounded-lg" />;
  // }

  // if (!biography && !awards && !scientific) return null;
  return (
    <Wrapper
      {...(needShowMore && { height: 200, openButtonText: 'مشاهده بیشتر', closeButtonText: 'مشاهده کمتر' })}
      className={classNames('p-4', className)}
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
