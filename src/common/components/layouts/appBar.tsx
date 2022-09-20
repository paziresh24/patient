import Text from '@/components/atom/text';
import clsx from 'clsx';
import { HTMLAttributes } from 'react';
import Back from '../atom/back';
import Skeleton from '../atom/skeleton';

interface AppBarProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  backButton?: Boolean;
  titleLoading?: Boolean;
}

export const AppBar = ({ title, backButton, titleLoading = false, className, ...rest }: AppBarProps) => {
  return (
    <div className={clsx('flex items-center h-16 px-6 bg-white shadow-md', className)} {...rest}>
      {backButton && <Back />}
      {titleLoading ? (
        <Skeleton w="7rem" h="1rem" rounded="full" />
      ) : (
        <Text fontWeight="bold" fontSize="sm">
          {title}
        </Text>
      )}
    </div>
  );
};

export default AppBar;
