import classNames from '@/common/utils/classNames';
import type { MouseEvent } from 'react';
import { dsFocusRing } from '../utils/a11y';
import { ds } from '../designSystem';
import type { CenterBookingPlatform } from '../utils/centerBookingPlatforms';

export const BookingPlatformsActiveHint = ({
  platforms,
  className,
  onPress,
}: {
  platforms: CenterBookingPlatform[];
  className?: string;
  onPress?: () => void;
}) => {
  if (platforms.length === 0) return null;

  const names = platforms.map(platform => platform.name).join('، ');
  const ariaLabel = `باز کردن شیرازه، ${names}`;

  const handlePress = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onPress?.();
  };

  const icons = (
    <span className="inline-flex shrink-0 items-center" aria-hidden>
      {platforms.map((platform, index) =>
        platform.icon ? (
          <img
            key={platform.id}
            src={platform.icon}
            alt=""
            width={16}
            height={16}
            className={classNames(
              'relative h-4 w-4 rounded-full bg-white object-contain p-px shadow-[0_0_0_1px_rgba(15,23,42,0.06)]',
              index > 0 && '-ms-1',
            )}
            style={{ zIndex: platforms.length - index }}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span
            key={platform.id}
            className={classNames(
              'relative flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-[8px] font-bold text-slate-500 shadow-[0_0_0_1px_rgba(15,23,42,0.06)]',
              index > 0 && '-ms-1',
            )}
            style={{ zIndex: platforms.length - index }}
          >
            {platform.name.slice(0, 1)}
          </span>
        ),
      )}
    </span>
  );

  const body = icons;

  if (!onPress) {
    return (
      <span className={classNames('inline-flex min-w-0 max-w-full items-center gap-1.5', className)} title={names}>
        {body}
      </span>
    );
  }

  return (
    <button
      type="button"
      title={names}
      aria-label={ariaLabel}
      onClick={handlePress}
      className={classNames(
        'inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-md',
        ds.motion.press,
        dsFocusRing,
        className,
      )}
    >
      {body}
    </button>
  );
};
