import classNames from '@/common/utils/classNames';
import Text from '@/components/atom/text';
import { useRouter } from 'next/router';
import { HTMLAttributes, ReactNode } from 'react';
import Skeleton from '../atom/skeleton';

interface AppBarProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  backButton?: Boolean;
  titleLoading?: Boolean;
  actionButton?: ReactNode;
}

export const AppBar = ({ title, backButton, titleLoading = false, className, actionButton, ...rest }: AppBarProps) => {
  const router = useRouter();
  return (
    <div
      className={classNames(
        'flex sticky top-0 justify-center items-center min-h-14 h-14 px-6 bg-white border-b border-[#EBECEE] z-40',
        className,
      )}
      {...rest}
    >
      {backButton && (
        <div onClick={router.back} className="ml-2 -mr-3 cursor-pointer right-7 absolute">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </div>
      )}

      {titleLoading ? (
        <Skeleton w="7rem" h="1rem" rounded="full" />
      ) : (
        <Text fontWeight="bold" fontSize="sm" className="line-clamp-1">
          {title}
        </Text>
      )}

      {actionButton && <div className="cursor-pointer left-5 absolute">{actionButton}</div>}
    </div>
  );
};

export default AppBar;
