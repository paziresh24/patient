import Text from '@/common/components/atom/text';
import classNames from '@/common/utils/classNames';
import { ReactNode } from 'react';

type LinkifiedTextProps = {
  children: string;
  className?: string;
  align?: 'justify' | 'start' | 'end' | 'center';
  as?: 'p' | 'span' | 'div';
};

export const linkifyText = (text: string): ReactNode[] =>
  text.split(/(https?:\/\/[^\s]+)/g).map((part, index) =>
    part.startsWith('http') ? (
      <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="break-all text-primary hover:underline">
        {part}
      </a>
    ) : (
      part
    ),
  );

export const LinkifiedText = ({ children, className, align = 'justify', as = 'p' }: LinkifiedTextProps) => (
  <Text as={as} fontSize="sm" className={classNames('leading-6 text-slate-600', className)} align={align}>
    {linkifyText(children)}
  </Text>
);

export default LinkifiedText;
