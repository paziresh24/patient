import Opener from '@/common/components/atom/opener/opener';
import Text from '@/common/components/atom/text/text';
import ReceiptIcon from '@/common/components/icons/receipt';
import classNames from '@/common/utils/classNames';
import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';
import { useMemo } from 'react';

interface BiographyProps {
  biography?: string;
  className?: string;
}

export const Biography = (props: BiographyProps) => {
  const { biography, className } = props;

  const needShowMore = useMemo(() => {
    const bio = biography ?? '';
    return removeHtmlTagInString(bio).length >= 750;
  }, [biography]);

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
      </div>
    </Wrapper>
  );
};

export default Biography;
