import ChevronIcon from '@/components/icons/chevron';
import clsx from 'clsx';
import { HTMLAttributes, useState } from 'react';
import Text from '../text';

interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
}

const Accordion: React.FC<AccordionProps> = props => {
  const { title, children, className } = props;
  const [open, setOpen] = useState(false);
  return (
    <div className={clsx('p-4 rounded-lg cursor-pointer bg-slate-100 flex flex-col space-y-2  ', className)} onClick={() => setOpen(!open)}>
      <div className="flex items-center justify-between select-none">
        <Text as="h3" fontSize="sm" fontWeight="bold">
          {title}
        </Text>
        <ChevronIcon dir={open ? 'top' : 'bottom'} />
      </div>
      <div className={open ? 'block' : 'hidden'}>{children}</div>
    </div>
  );
};

export default Accordion;
