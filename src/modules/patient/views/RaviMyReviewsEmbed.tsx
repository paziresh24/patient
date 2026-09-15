import Loading from '@/common/components/atom/loading';
import classNames from '@/common/utils/classNames';
import { buildRaviMyReviewsHandoffSrc } from '@/modules/patient/utils/buildRaviMyReviewsHandoff';
import { useState } from 'react';

/** Embed ravi-front my-reviews inside dashboard chrome (keeps SideBar), like نظرات پروفایل من. */
export const RaviMyReviewsEmbed = ({ className }: { className?: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const src = buildRaviMyReviewsHandoffSrc();

  return (
    <div
      className={classNames(
        'relative flex w-full flex-grow h-full md:h-[calc(100vh-80px)] min-h-[40vh]',
        className,
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
          <Loading />
        </div>
      )}
      <iframe
        title="نظرات من"
        src={src}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoading(false)}
        className={classNames('w-full h-full flex-grow border-0', { invisible: isLoading })}
        allow="clipboard-write; fullscreen;"
      />
    </div>
  );
};
