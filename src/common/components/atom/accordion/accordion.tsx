import classNames from '@/common/utils/classNames';
import ChevronIcon from '@/components/icons/chevron';
import { HTMLAttributes, useEffect, useState } from 'react';
import Text from '../text';

interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  isOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = props => {
  const { title, children, className, isOpen } = props;
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);
  return (
    <div className={classNames('rounded-lg bg-slate-100 flex flex-col', className)}>
      <div className="flex items-center justify-between select-none cursor-pointer p-4" onClick={() => setOpen(!open)}>
        <Text as="span" fontSize="sm" fontWeight="bold">
          {title}
        </Text>
        <ChevronIcon dir={open ? 'top' : 'bottom'} />
      </div>
      <div className={open ? 'block p-4 pt-0' : 'hidden'}>{children}</div>
    </div>
  );
};

export default Accordion;
