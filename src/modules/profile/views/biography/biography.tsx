import Opener from '@/common/components/atom/opener/opener';
import classNames from '@/common/utils/classNames';
import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';
import { useMemo } from 'react';

interface BiographyProps {
  content: string;
  className?: string;
}

export const Biography = (props: BiographyProps) => {
  const { content, className } = props;

  const needShowMore = useMemo(() => {
    const bio = content ?? '';
    return removeHtmlTagInString(bio).length >= 750;
  }, [content]);

  const Wrapper = needShowMore ? Opener : 'div';

  return (
    <Wrapper
      {...(needShowMore && { height: 200, openButtonText: 'مشاهده بیشتر', closeButtonText: 'مشاهده کمتر' })}
      className={classNames('p-4', className)}
    >
      <div className="flex flex-col space-y-3">
        <div className="flex flex-col space-y-3 leading-6 text-justify text-sm" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </Wrapper>
  );
};

export default Biography;
