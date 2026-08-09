import LikeIcon from '@/common/components/icons/like';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import * as Popover from '@radix-ui/react-popover';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { submitLikeRate } from '../api';
import { getUserLikeRate, saveLikedComment } from '../utils/likedComments';
import { RaviRateStar } from './RaviRateStar';

interface RaviUsefulRatingProps {
  feedbackId: string;
  likeCount?: number;
}

export const RaviUsefulRating = ({ feedbackId, likeCount }: RaviUsefulRatingProps) => {
  const { isLogin, userId } = useUserInfoStore(state => ({
    isLogin: state.isLogin,
    userId: state.info?.id,
  }));
  const { handleOpenLoginModal } = useLoginModalContext();
  const [open, setOpen] = useState(false);
  const [rate, setRate] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitInFlightRef = useRef(false);

  useEffect(() => {
    if (!isLogin || userId == null) {
      setRate(0);
      return;
    }
    setRate(getUserLikeRate(feedbackId, userId));
  }, [feedbackId, isLogin, userId]);

  const requireLogin = useCallback(() => {
    handleOpenLoginModal({ state: true });
  }, [handleOpenLoginModal]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen && !isLogin) {
        requireLogin();
        return;
      }
      if (!nextOpen) {
        setHoverStar(0);
      }
      setOpen(nextOpen);
    },
    [isLogin, requireLogin],
  );

  const handleRate = useCallback(
    async (value: number) => {
      if (!isLogin || userId == null) {
        requireLogin();
        return;
      }

      if (value === rate) {
        setOpen(false);
        return;
      }

      if (submitInFlightRef.current) {
        return;
      }

      submitInFlightRef.current = true;
      setIsSubmitting(true);
      try {
        const response = await submitLikeRate({
          feedbackId,
          rate: value,
          userId: String(userId),
        });

        if (response.status === 200) {
          saveLikedComment({ user_id: userId, id: feedbackId, rate: value });
          setRate(value);
          setOpen(false);
        }
      } catch {
        toast.error('ثبت امتیاز مفید بودن ناموفق بود. دوباره تلاش کنید.');
      } finally {
        submitInFlightRef.current = false;
        setIsSubmitting(false);
      }
    },
    [feedbackId, isLogin, rate, requireLogin, userId],
  );

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-1 text-sm leading-none text-slate-600"
        >
          <span>چقدر مفید بود؟</span>
          <LikeIcon className={`h-4 w-4 shrink-0 ${rate > 0 ? 'text-blue-600' : ''}`} />
          {likeCount != null && likeCount > 0 ? (
            <span className="text-xs leading-none text-slate-500">{likeCount}</span>
          ) : null}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="center"
          sideOffset={6}
          collisionPadding={8}
          className="z-50 flex flex-row items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-[0_4px_16px_0_rgba(0,0,0,0.2)] outline-none"
          dir="ltr"
          onMouseLeave={() => setHoverStar(0)}
        >
          {[1, 2, 3, 4, 5].map(star => {
            const activeStar = hoverStar || rate;

            return (
              <button
                key={star}
                type="button"
                disabled={isSubmitting}
                aria-label={`${star} از ۵ ستاره`}
                className="inline-flex cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-60"
                onMouseEnter={() => setHoverStar(star)}
                onClick={() => handleRate(star)}
              >
                <RaviRateStar selected={star <= activeStar} />
              </button>
            );
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
