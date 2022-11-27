import Link from 'next/link';
import ChevronIcon from '../../icons/chevron';
import Text from '../text';

interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  text: string;
  showChevron: boolean;
  chevronDir: 'right' | 'left';
}

export const BreadcrumbItem = ({ href, text, showChevron = true, chevronDir, ...rest }: BreadcrumbItemProps) => {
  return (
    <Link href={href} shallow scroll>
      <a {...rest}>
        <div className="flex items-center px-1 space-s-2 text-slate-600">
          <Text fontSize="xs" fontWeight="medium">
            {text}
          </Text>
          {showChevron && <ChevronIcon dir={chevronDir} />}
        </div>
      </a>
    </Link>
  );
};
