import classNames from '@/common/utils/classNames';
import Link from 'next/link';
import ChevronIcon from '../../icons/chevron';
import Text from '../text';

interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href?: string;
  text: string;
  showChevron: boolean;
  chevronDir: 'right' | 'left';
}

export const BreadcrumbItem = ({ href, text, showChevron = true, chevronDir, ...rest }: BreadcrumbItemProps) => {
  const Component = href ? Link : ('div' as any);

  return (
    <Component
      {...(href && {
        href,
        shallow: true,
        prefetch: false,
        scroll: true,
      })}
      {...rest}
    >
      <div
        className={classNames('flex items-center px-1 space-s-2 text-slate-600', {
          'cursor-default': !href,
        })}
      >
        <Text fontSize="xs" fontWeight="medium">
          {text}
        </Text>
        {showChevron && <ChevronIcon dir={chevronDir} />}
      </div>
    </Component>
  );
};
