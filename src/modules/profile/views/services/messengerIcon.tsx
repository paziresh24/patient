import classNames from '@/common/utils/classNames';
import { useState } from 'react';

interface MessengerIconProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md';
}

export const MessengerIcon = ({ src, alt, size = 'sm' }: MessengerIconProps) => {
  const [failed, setFailed] = useState(false);
  const dimension = size === 'md' ? 'h-7 w-7' : 'h-6 w-6';

  if (!src || failed) {
    return (
      <span
        aria-hidden
        className={classNames(
          'flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary',
          dimension,
          size === 'md' ? 'text-xs' : 'text-[10px]',
        )}
      >
        {alt.trim().charAt(0) || '•'}
      </span>
    );
  }

  return (
    <span className={classNames('relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-slate-100', dimension)}>
      <img
        src={src}
        alt=""
        width={size === 'md' ? 28 : 24}
        height={size === 'md' ? 28 : 24}
        className="h-full w-full object-contain p-0.5"
        onError={() => setFailed(true)}
      />
    </span>
  );
};

export default MessengerIcon;
